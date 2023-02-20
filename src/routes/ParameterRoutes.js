import * as ParameterController from "./../controller/ParameterController.js";
export default function (app) {
  app.post("/createParams/:model", ParameterController.createParams);
  app.get("/getParams/:model", ParameterController.getParams);
}
