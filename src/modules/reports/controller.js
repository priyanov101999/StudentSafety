import Service from "./service";
export const createReport = async (handler) => {
  try {
    const data = await handler.getBody();
    const res = await Service.createReport(data);
    return handler.handleCreatedResponse(res);
  } catch (err) {
    return handler.sendServerError(err);
  }
};

export const assignReportToPoliceman = async (handler) => {
  try {
    const data = await handler.getBody();
    const id = await handler.getRequestParameterAsString("id");
    const res = await Service.assignReportToPoliceman(data, id);
    return handler.handleResponse(res);
  } catch (err) {
    return handler.sendServerError(err);
  }
};
export const resolvedReport = async (handler) => {
  try {
    const id = await handler.getRequestParameterAsString("id");
    const res = await Service.resolvedReport(id);
    return handler.handleResponse(res);
  } catch (err) {
    return handler.sendServerError(err);
  }
};

export const reportList = async (handler) => {
  try {
    const res = await Service.reportList();
    return handler.handleResponse(res);
  } catch (err) {
    return handler.sendServerError(err);
  }
};

export const assignedReportsByPoliceMan = async (handler) => {
  try {
    const policemanId = await handler.getRequestParameterAsString(
      "policemanId"
    );
    const res = await Service.assignedReportsByPoliceMan(policemanId);
    return handler.handleResponse(res);
  } catch (err) {
    return handler.sendServerError(err);
  }
};
