import * as FieldValidator from "./validate";

export async function validator(request, response, next) {
  if (request.route.stack[0].method === "post") {
    switch (request.route.path) {
      case "/policeStation":
        await FieldValidator.createPoliceStation(request);
        break;
      case "/policeman":
        await FieldValidator.createPoliceman(request);
        break;
      case "/report":
        await FieldValidator.createReport(request);
        break;
      case "/login":
        await FieldValidator.login(request);
        break;
    }
  } else if (request.route.stack[0].method === "put") {
    switch (request.route.path) {
      case "/policeStation/:id":
        await FieldValidator.updatePoliceStation(request);
        break;
      case "/policeman/:id":
        await FieldValidator.updatePoliceman(request);
        break;
      case "/assignReportToPoliceman/:id":
        await FieldValidator.assignReportToPoliceman(request);
        break;
      case "/assignReportToOtherPoliceStation/:id":
        await FieldValidator.assignReportToOtherPoliceStation(request);
        break;
    }
  }
  const result = await request.getValidationResult();
  if (!result.isEmpty()) {
    return response.status(400).send({ error: result.array()[0].msg });
  } else {
    next();
  }
}
