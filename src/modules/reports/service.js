import knex from "../../knex";
import https from "https";
import PoliceStation from "../../models/PoliceStation";
import Report from "../../models/Report";
import _ from "lodash";
import { io } from "../../../app.js";
import ReportType from "../../models/ReportType";
import PoliceMan from "../../models/PoliceMan";
import fetchTableList from "../../utils/listing-helper";
export default class Service {
  static createReport = async (data) => {
    try {
      console.log(data);
      let graphhoperApi =
        "https://graphhopper.com/api/1/matrix?key=b82a54e4-549a-4e1e-aa09-7b82bd922b2a&type=json" +
        `&point=${data.currentLatitude}, ${data.currentLongitude}`;
      let policeStations = await PoliceStation.query();
      console.log("policeStations:", policeStations);
      for (let i = 0; i < policeStations.length; i++) {
        console.log(policeStations[i].name);
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
          console.log(responseData);
          let policeStationLatLong = responseData.distances;
          let result = _.map(policeStationLatLong, _.head);
          result.shift();
          let min = Math.min(...result);
          let elementIndex =
            result.indexOf(min) == -1 ? 0 : result.indexOf(min);
          console.log(result, elementIndex);
          let latitude = policeStations[elementIndex].latitude;
          let longitude = policeStations[elementIndex].longitude;
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
          console.log(data);
          await Report.query()
            .insert(data)
            .then((data) => {
              console.log("then:", {
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
        message: "Report has been created",
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
      let policeman = await PoliceMan.query().findById(report.policemanId);
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
      report.isResolved = true;
      await Report.query()
        .upsertGraphAndFetch({ ...report, id })
        .withGraphFetched("reportType");
      io.emit("assignedReport", {
        action: "resolvedReport",
        report: {
          ...report,
          policemanId: policeman.id,
          policeman: policeman.name,
          policeStation: policestation.name,
          id,
        },
      });
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

  static reportList = async (data) => {
    try {
      const query = Report.query().toKnexQuery().clearSelect();
      query
        .select(
          "report.*",
          "report_type.name as reportType",
          "policeman.name as policeman",
          "police_station.name as policeStation"
        )
        .join("report_type", "report_type.id", "report.reportTypeId")
        .leftJoin("policeman", "policeman.id", "report.policemanId")
        .join("police_station", "police_station.id", "report.policeStationId")
        .orderBy("report.isResolved", "asc");
      //return query;
      return fetchTableList({
        baseQuery: query,
        filters: data.filters,
        pagination: data.pagination,
        sorting: data.sorting,
        search: data.search,
      });
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
