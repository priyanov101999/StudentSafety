import { io } from "../../app.js";
import PoliceStation from "../models/PoliceStation.js";
import Report from "../models/Report.js";
import ResponseUtil from "../utils/ResponseUtil.js";
import _ from "lodash";
export const createReport = async (req, res, next) => {
  try {
    let data = req.body;
    let stationExists = await PoliceStation.query()
      .where({
        latitude: data.stationLatitude,
        longitude: data.stationLongitude,
      })
      .first();
    if (!stationExists) {
      ResponseUtil.failure("Station not found! Please try again.", 404, res);
    }
    let { stationLatitude, stationLongitude, ...payload } = data;
    payload.policeStationId = stationExists.id;
    payload.reportDate = new Date();

    await Report.query()
      .insert(payload)
      .then((data) => {
        io.emit("report", {
          action: "created",
          report: { ...data },
        });
        ResponseUtil.success(data, 201, `Report created successfully`, res);
      });
  } catch (error) {
    ResponseUtil.failure(error.name, error.statusCode, res);
  }
};

export const assignReportToPoliceman = async (req, res, next) => {
  try {
    let id = req.params.id;
    let policemanId = req.body.policemanId;
    let report = await Report.query().findById(id);

    if (!report) {
      ResponseUtil.failure("Report not found", 404, res);
    } else {
      await Report.query()
        .update({
          ...report,
          policemanId,
          id,
        })
        .where({ id })
        .then((data) => {
          // io.emit("report", {
          //   action: "assignedReport",
          //   policemanId,
          // });
          io.sockets.in(policemanId).emit("report", {
            action: "assignedReport",
            policemanId,
          });
          return ResponseUtil.success(
            data,
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
    let list = await Report.query();
    ResponseUtil.success(list, 200, `Report List fetched successfully`, res);
  } catch (error) {
    ResponseUtil.failure(error.name, error.statusCode, res);
  }
};

export const getAssignedReportsByPoliceMan = async (req, res, next) => {
  try {
    let list = await Report.query().where({
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
