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
      let graphhoperApi =
        "https://maps.googleapis.com/maps/api/distancematrix/json?" +
        `origins=${data.currentLatitude},${data.currentLongitude}&destinations=`;
      let policeStations = await PoliceStation.query();
      for (let i = 0; i < policeStations.length; i++) {
        console.log(policeStations[i].name);
        graphhoperApi += `${policeStations[i].latitude},${policeStations[i].longitude}|`;
      }
      let reportType = await ReportType.query().findById(data.reportTypeId);
      graphhoperApi += `&key=AIzaSyBtVz2yeWdiCJoxTQmynq5U5ZxUJr1qhHI`;
      await https.get(graphhoperApi, async (response) => {
        let graphhoperApiData = "";
        response.on("data", (chunk) => {
          graphhoperApiData += chunk;
        });
        response.on("end", async () => {
          const responseData = JSON.parse(graphhoperApiData);
          console.log(graphhoperApi, responseData.rows[0]);
          let policeStationLatLong = responseData.rows[0].elements.map(
            (item) => {
              if (item.distance) {
                return item.distance.value;
              } else {
                return Infinity;
              }
            }
          );

          let min = Math.min(...policeStationLatLong);
          let elementIndex =
            policeStationLatLong.indexOf(min) == -1
              ? 0
              : policeStationLatLong.indexOf(min);
          console.log(policeStationLatLong, elementIndex);
          let latitude = policeStations[elementIndex].latitude;
          let longitude = policeStations[elementIndex].longitude;
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

  static phoneNoOfNearestStation = async (data) => {
    try {
      var station;
      let graphhoperApi =
        "https://maps.googleapis.com/maps/api/distancematrix/json?" +
        `origins=${data.currentLatitude},${data.currentLongitude}&destinations=`;
      let policeStations = await PoliceStation.query();
      for (let i = 0; i < policeStations.length; i++) {
        graphhoperApi += `${policeStations[i].latitude},${policeStations[i].longitude}|`;
      }
      graphhoperApi += `&key=AIzaSyBtVz2yeWdiCJoxTQmynq5U5ZxUJr1qhHI`;

      const graphhoperApiData = await new Promise((resolve, reject) => {
        https
          .get(graphhoperApi, (response) => {
            let data = "";
            response.on("data", (chunk) => {
              data += chunk;
            });
            response.on("end", () => {
              resolve(data);
            });
          })
          .on("error", (error) => {
            reject(error);
          });
      });

      const responseData = JSON.parse(graphhoperApiData);
      let policeStationLatLong = responseData.rows[0].elements.map((item) => {
        if (item.distance) {
          return item.distance.value;
        } else {
          return Infinity;
        }
      });

      let min = Math.min(...policeStationLatLong);
      let elementIndex =
        policeStationLatLong.indexOf(min) == -1
          ? 0
          : policeStationLatLong.indexOf(min);
      console.log(policeStationLatLong, elementIndex);
      let latitude = policeStations[elementIndex].latitude;
      let longitude = policeStations[elementIndex].longitude;
      console.log(latitude, longitude);
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

      station = stationExists;
      console.log("station:", station);

      return {
        error: false,
        values: station,
      };
    } catch (error) {
      return {
        error: true,
        errorText: error,
      };
    }
  };
}
