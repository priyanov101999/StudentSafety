import PoliceStation from "../models/PoliceStation.js";
import ResponseUtil from "../utils/ResponseUtil.js";
export const createPoliceStation = async (req, res, next) => {
  try {
    let data = req.body;
    console.log(data);
    await PoliceStation.query()
      .insert(data)
      .then((data) =>
        ResponseUtil.success(
          data,
          201,
          `Police Station created successfully`,
          res
        )
      );
  } catch (error) {
    ResponseUtil.failure(error.name, error.statusCode, res);
  }
};

export const updatePoliceStation = async (req, res, next) => {
  try {
    let data = req.body;
    let id = req.params.id;
    let exists = PoliceStation.query().findById(id);
    if (!exists) {
      ResponseUtil.failure("Police station not found", 404, res);
    } else {
      await PoliceStation.query()
        .upsertGraphAndFetch({ ...data, id })
        .then((data) =>
          ResponseUtil.success(
            data,
            200,
            `Police Station updated successfully`,
            res
          )
        );
    }
  } catch (error) {
    ResponseUtil.failure(error.name, error.statusCode, res);
  }
};

export const getPoliceStationById = async (req, res, next) => {
  try {
    let id = req.params.id;
    let exists = await PoliceStation.query().findById(id);
    if (!exists) {
      ResponseUtil.failure("Police station not found", 404, res);
    } else {
      ResponseUtil.success(
        exists,
        200,
        `Police Station fetched successfully`,
        res
      );
    }
  } catch (error) {
    ResponseUtil.failure(error.name, error.statusCode, res);
  }
};

export const policeStationList = async (req, res, next) => {
  try {
    let list = await PoliceStation.query();

    ResponseUtil.success(
      list,
      200,
      `Police Station List fetched successfully`,
      res
    );
  } catch (error) {
    ResponseUtil.failure(error.name, error.statusCode, res);
  }
};
