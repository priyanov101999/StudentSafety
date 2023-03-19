import { io } from "../../app.js";
import PoliceStation from "../models/PoliceStation.js";
import Report from "../models/Report.js";
import ResponseUtil from "../utils/ResponseUtil.js";
import _ from "lodash";
import https from "https";
import ReportType from "../models/ReportType.js";

export const createReport = async (req, res, next) => {
  try {
    let data = req.body;
    let graphhoperApi =
      "https://graphhopper.com/api/1/matrix?key=3fc6f15a-1859-4944-9e9e-2f2befc610e5&type=json" +
      `&point=${data.currentLatitude}, ${data.currentLongitude}`;
    let policeStations = await PoliceStation.query();
    for (let i = 0; i < policeStations.length; i++) {
      graphhoperApi += `&point=${policeStations[i].latitude}, ${policeStations[i].longitude}`;
    }
    let reportType = await ReportType.query().findById(req.body.reportTypeId);
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
          console.log(index, elementIndex);
          elementIndex = min < element && element != 0 ? elementIndex : index;
          min = min < element && element != 0 ? min : element;
        });
        let latitude = policeStations[elementIndex - 1].latitude;
        let longitude = policeStations[elementIndex - 1].longitude;
        let stationExists = await PoliceStation.query()
          .where({
            latitude,
            longitude,
          })
          .first();
        if (!stationExists) {
          ResponseUtil.failure(
            "Station not found! Please try again.",
            404,
            res
          );
        }
        data.policeStationId = stationExists.id;
        data.reportDate = new Date();
        console.log("data", data);
        await Report.query()
          .insert(data)
          .then((data) => {
            console.log({ ...data, reportType: reportType.name });
            io.emit("report", {
              action: "created",
              report: { ...data, reportType: reportType.name },
            });
            ResponseUtil.success(data, 201, `Report created successfully`, res);
          });
      });
    });
  } catch (error) {
    console.log(error);
    ResponseUtil.failure(error.name, error.statusCode, res);
  }
};

export const assignReportToPoliceman = async (req, res, next) => {
  try {
    let id = req.params.id;
    let policemanId = req.body.policemanId;
    let report = await Report.query()
      .findById(id)
      .select("report.*", "report_type.name as reportType")
      .join("report_type", "report_type.id", "report.reportTypeId");
    if (!report) {
      ResponseUtil.failure("Report not found", 404, res);
    } else {
      report.policemanId = policemanId;
      await Report.query()
        .update({
          ...report,
          id: id,
        })
        .where({ id })
        .then(async (data) => {
          console.log("Inserted successfully", report.reportTypeId);
          io.emit("assignedReport", {
            action: "assignedReport",
            report: {
              ...report,
              policemanId,
              id,
            },
          });
          return ResponseUtil.success(
            {
              ...report,
              policemanId,
              id,
            },
            200,
            `Report updated successfully`,
            res
          );
        });
    }
  } catch (error) {
    ResponseUtil.failure(error.name, error.statusCode, res);
  }
};

export const resolvedReport = async (req, res, next) => {
  try {
    let id = req.params.id;
    let report = await Report.query().findById(id);
    if (!report) {
      ResponseUtil.failure("Report not found", 404, res);
    } else {
      report.isResolved = true;
      await Report.query()
        .upsertGraphAndFetch({ ...report, id })
        .withGraphFetched("reportType")
        .then((data) =>
          ResponseUtil.success(data, 200, `Report updated successfully`, res)
        );
    }
  } catch (error) {
    ResponseUtil.failure(error.name, error.statusCode, res);
  }
};

export const ReportList = async (req, res, next) => {
  try {
    let list = await Report.query()
      .select(
        "report.*",
        "report_type.name as reportType",
        "policeman.name as policeman"
      )
      .join("report_type", "report_type.id", "report.reportTypeId")
      .leftJoin("policeman", "policeman.id", "report.policemanId");
    ResponseUtil.success(list, 200, `Report List fetched successfully`, res);
  } catch (error) {
    ResponseUtil.failure(error.name, error.statusCode, res);
  }
};

export const getAssignedReportsByPoliceMan = async (req, res, next) => {
  try {
    let list = await Report.query()
      .select("report.*", "report_type.name as reportType")
      .join("report_type", "report_type.id", "report.reportTypeId")
      .where({
        policemanId: req.params.policemanId,
      });
    ResponseUtil.success(
      list,
      200,
      `Report List assigned to policeman fetched successfully`,
      res
    );
  } catch (error) {
    ResponseUtil.failure(error.name, error.statusCode, res);
  }
};
