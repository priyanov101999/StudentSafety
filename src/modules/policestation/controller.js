import Service from "./service";
export const createPoliceStation = async (handler) => {
  try {
    const data = await handler.getBody();
    const res = await Service.createPoliceStation(data);
    return handler.handleCreatedResponse(res);
  } catch (err) {
    return handler.sendServerError(err);
  }
};

export const updatePoliceStation = async (handler) => {
  try {
    const data = await handler.getBody();
    const id = await handler.getRequestParameterAsString("id");
    const res = await Service.updatePoliceStation(data, id);
    return handler.handleResponse(res);
  } catch (err) {
    return handler.sendServerError(err);
  }
};

export const getPoliceStationById = async (handler) => {
  try {
    const id = await handler.getRequestParameterAsString("id");
    const res = await Service.getPoliceStationById(id);
    return handler.handleResponse(res);
  } catch (err) {
    return handler.sendServerError(err);
  }
};

export const policeStationList = async (handler) => {
  try {
    const data = await handler.getBody();
    const res = await Service.policeStationList(data);
    return handler.handleResponse(res);
  } catch (err) {
    return handler.sendServerError(err);
  }
};
