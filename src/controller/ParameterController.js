import { MODEL } from "../constants/Model.js";
import ResponseUtil from "../utils/ResponseUtil.js";
export const createParams = async (req, res, next) => {
  try {
    let data = req.body;
    let model = req.params.model;
    await MODEL[model]
      .query()
      .upsertGraphAndFetch(data)
      .then((data) =>
        ResponseUtil.success(data, 201, `${model} created successfully`, res)
      );
  } catch (error) {
    ResponseUtil.failure(error.name, error.statusCode, res);
  }
};

export const getParams = async (req, res, next) => {
  try {
    let model = req.params.model;
    await MODEL[model]
      .query()
      .then((data) =>
        ResponseUtil.success(data, 200, `${model} fetched successfully`, res)
      );
  } catch (error) {
    ResponseUtil.failure(error.name, error.statusCode, res);
  }
};
