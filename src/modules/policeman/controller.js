import Service from "./service";
export const createPoliceman = async (handler) => {
  try {
    const data = await handler.getBody();
    const res = await Service.createPoliceman(data);
    return handler.handleCreatedResponse(res);
  } catch (err) {
    return handler.sendServerError(err);
  }
};

export const updatePoliceman = async (handler) => {
  try {
    const data = await handler.getBody();
    const id = await handler.getRequestParameterAsString("id");
    const res = await Service.updatePoliceman(data, id);
    return handler.handleResponse(res);
  } catch (err) {
    return handler.sendServerError(err);
  }
};

export const getPolicemanById = async (handler) => {
  try {
    const id = await handler.getRequestParameterAsString("id");
    const res = await Service.getPolicemanById(id);
    return handler.handleResponse(res);
  } catch (err) {
    return handler.sendServerError(err);
  }
};

export const policemanList = async (handler) => {
  try {
    const data = await handler.getBody();
    const res = await Service.policemanList(data);
    return handler.handleResponse(res);
  } catch (err) {
    return handler.sendServerError(err);
  }
};

export const policemanListByStationId = async (handler) => {
  try {
    const stationId = await handler.getRequestParameterAsString("stationId");
    const res = await Service.policemanListByStationId(stationId);
    return handler.handleResponse(res);
  } catch (err) {
    return handler.sendServerError(err);
  }
};
