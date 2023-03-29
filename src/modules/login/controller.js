import Service from "./service";
export const login = async (handler) => {
  try {
    const data = await handler.getBody();
    const res = await Service.login(data);
    return handler.handleCreatedResponse(res);
  } catch (err) {
    return handler.sendServerError(err);
  }
};

export const policemanLogin = async (handler) => {
  try {
    const data = await handler.getBody();
    const res = await Service.policemanLogin(data);
    return handler.handleResponse(res);
  } catch (err) {
    return handler.sendServerError(err);
  }
};
