import PoliceMan from "../models/PoliceMan.js";
import ResponseUtil from "../utils/ResponseUtil.js";

export const createPoliceman = async (req, res, next) => {
  try {
    let data = req.body;
    console.log(data);
    await PoliceMan.query()
      .insert(data)
      .then((data) =>
        ResponseUtil.success(data, 201, `Police Man created successfully`, res)
      );
  } catch (error) {
    ResponseUtil.failure(error.name, error.statusCode, res);
  }
};

export const updatePoliceman = async (req, res, next) => {
  try {
    let data = req.body;
    let id = req.params.id;
    let exists = PoliceMan.query().findById(id);
    if (!exists) {
      ResponseUtil.failure("Police man not found", 404, res);
    } else {
      await PoliceMan.query()
        .upsertGraphAndFetch({ ...data, id })
        .then((data) =>
          ResponseUtil.success(
            data,
            200,
            `Police man updated successfully`,
            res
          )
        );
    }
  } catch (error) {
    ResponseUtil.failure(error.name, error.statusCode, res);
  }
};

export const getPolicemanById = async (req, res, next) => {
  try {
    let id = req.params.id;
    let exists = await PoliceMan.query().findById(id);
    if (!exists) {
      ResponseUtil.failure("Police man not found", 404, res);
    } else {
      ResponseUtil.success(exists, 200, `Police man fetched successfully`, res);
    }
  } catch (error) {
    ResponseUtil.failure(error.name, error.statusCode, res);
  }
};

export const policemanList = async (req, res, next) => {
  try {
    let list = await PoliceMan.query();

    ResponseUtil.success(
      list,
      200,
      `Police Man List fetched successfully`,
      res
    );
  } catch (error) {
    ResponseUtil.failure(error.name, error.statusCode, res);
  }
};
