import knex from "../../knex";
import https from "https";
import PoliceStation from "../../models/PoliceStation";
import Report from "../../models/Report";
import _ from "lodash";
import { io } from "../../../app.js";
import ReportType from "../../models/ReportType";
import PoliceMan from "../../models/PoliceMan";
export default class Service {
  static createReport = async (data) => {
    try {
      let graphhoperApi =
        "https://graphhopper.com/api/1/matrix?key=498c1977-9179-45a3-9a1e-d7edc2a95dab&type=json" +
        `&point=${data.currentLatitude}, ${data.currentLongitude}`;
      let policeStations = await PoliceStation.query();
      for (let i = 0; i < policeStations.length; i++) {
        graphhoperApi += `&point=${policeStations[i].latitude}, ${policeStations[i].longitude}`;
      }
      let reportType = await ReportType.query().findById(data.reportTypeId);
      graphhoperApi += `&out_array=distances`;
      await https.get(graphhoperApi, async (response) => {
        let graphhoperApiData = "";
        response.on("data", (chunk) => {
          graphhoperApiData += chunk;
        });
        response.on("end", async () => {
          const responseData = JSON.parse(graphhoperApiData);
          let policeStationLatLong = responseData.distances;
          let result = _.map(policeStationLatLong, _.head);
          let min = result[1];
          let elementIndex = 1;
          result.forEach((element, index) => {
            elementIndex = min < element && element != 0 ? elementIndex : index;
            min = min < element && element != 0 ? min : element;
          });
          console.log(result, elementIndex);
          let latitude = policeStations[elementIndex - 1].latitude;
          let longitude = policeStations[elementIndex - 1].longitude;
          console.log(latitude, " ", longitude);
          let stationExists = await PoliceStation.query()
            .where({
              latitude,
              longitude,
            })
            .first();
          if (!stationExists) {
            return {
              error: true,
              errorText: "Station not found! Please try again.",
            };
          }
          data.policeStationId = stationExists.id;
          data.reportDate = new Date();
          await Report.query()
            .insert(data)
            .then((data) => {
              console.log({
                ...data,
                policemanId: null,
                policeman: null,
                reportType: reportType.name,
                policeStation: stationExists.name,
              });
              io.emit("report", {
                action: "created",
                report: {
                  ...data,
                  reportType: reportType.name,
                  policeStation: stationExists.name,
                  policemanId: "",
                  policeman: "",
                },
              });
            });
        });
      });
      return {
        message: "Report created successfully",
      };
    } catch (error) {
      return {
        error: true,
        errorText: error,
      };
    }
  };

  static assignReportToPoliceman = async (data, id) => {
    try {
      let policemanId = data.policemanId;
      let report = await Report.query()
        .findById(id)
        .select("report.*", "report_type.name as reportType")
        .join("report_type", "report_type.id", "report.reportTypeId");
      let policeman = await PoliceMan.query().findById(policemanId);
      let policestation = await PoliceStation.query().findById(
        report.policeStationId
      );
      if (!report) {
        return {
          error: true,
          errorText: "Report not found",
        };
      }
      if (!policestation) {
        return {
          error: true,
          errorText: "Police station not found",
        };
      }
      if (!policeman) {
        return {
          error: true,
          errorText: "Policeman not found",
        };
      }
      report.policemanId = policemanId;
      await Report.query()
        .update({
          ...report,
          id: id,
        })
        .where({ id })
        .then(async (data) => {
          console.log({
            ...report,
            policemanId,
            policeman: policeman.name,
            policeStation: policestation.name,
            id,
          });
          io.emit("assignedReport", {
            action: "assignedReport",
            report: {
              ...report,
              policemanId,
              policeman: policeman.name,
              policeStation: policestation.name,
              id,
            },
          });
        });
      return {
        message: `Report updated successfully`,
      };
    } catch (error) {
      return {
        error: true,
        errorText: error,
      };
    }
  };

  static resolvedReport = async (id) => {
    try {
      let report = await Report.query().findById(id);
      if (!report) {
        return {
          error: true,
          errorText: "Report not found",
        };
      }
      report.isResolved = true;
      await Report.query()
        .upsertGraphAndFetch({ ...report, id })
        .withGraphFetched("reportType");

      return {
        message: `Report resolved successfully`,
      };
    } catch (error) {
      return {
        error: true,
        errorText: error,
      };
    }
  };
  static assignReportToOtherPoliceStation = async (data, id) => {
    try {
      console.log("service");
      let report = await Report.query().findById(id);
      if (!report) {
        return {
          error: true,
          errorText: "Report not found",
        };
      }
      report.policeStationId = data.policeStationId;
      let result = await Report.query()
        .upsertGraphAndFetch({ ...report, id })
        .withGraphFetched("reportType");
      result.reportType = result.reportType.name;
      console.log(result);
      io.emit("report", {
        action: "created",
        report: { ...result },
      });
      return {
        message: `Report assigned to different police station successfully`,
      };
    } catch (error) {
      return {
        error: true,
        errorText: error,
      };
    }
  };

  static reportList = async () => {
    try {
      let list = await Report.query()
        .select(
          "report.*",
          "report_type.name as reportType",
          "policeman.name as policeman",
          "police_station.name as policeStation"
        )
        .join("report_type", "report_type.id", "report.reportTypeId")
        .leftJoin("policeman", "policeman.id", "report.policemanId")
        .join("police_station", "police_station.id", "report.policeStationId");
      return list;
    } catch (error) {
      return {
        error: true,
        errorText: error,
      };
    }
  };

  static assignedReportsByPoliceMan = async (policemanId) => {
    try {
      let list = await Report.query()
        .select("report.*", "report_type.name as reportType")
        .join("report_type", "report_type.id", "report.reportTypeId")
        .where({
          policemanId,
        });

      return list;
    } catch (error) {
      return {
        error: true,
        errorText: error,
      };
    }
  };
}
