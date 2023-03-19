import * as _ from "lodash";
// import * as jwt from "jsonwebtoken";

import { SERVER_ERROR } from "../constants/Constants";

export class RequestHandler {
  constructor(request, response) {
    this.request = request;
    this.response = response;
  }

  getBody() {
    return this.request.body;
  }

  getRequest() {
    return this.request;
  }

  getFiles() {
    return this.request.files;
  }

  getResponse() {
    return this.response;
  }

  getQueryParameter(key) {
    return this.request.query[key];
  }

  getQueryParameters() {
    return this.request.query;
  }

  getAllRequestParameters() {
    return { ...this.request.query, ...this.request.params };
  }

  getRequestParameterAsString(key) {
    return this.request.params[key];
  }

  getRequestParameterAsNumber(key) {
    const value = parseInt(this.request.params[key]);
    return _.isNaN(value) ? undefined : value;
  }

  getRequestParameterAsBoolean(key) {
    return this.request.params[key] === "true" ? true : false;
  }
  getRequestQueryParameter(key) {
    return this.request.query[key];
  }

  validate(field, message) {
    return this.request.assert(field, message);
  }

  async performValidation() {
    const result = await this.request.getValidationResult();
    if (!result.isEmpty()) {
      this.sendValidationError({ message: result.array()[0].msg });
      return false;
    }
    return true;
  }

  sendResponse(data) {
    return this.response.status(200).send(data);
  }

  sendNotFoundResponse(data) {
    return this.response.status(404).send(data);
  }

  sendCreatedResponse(data) {
    return this.response.status(201).send(data);
  }

  sendValidationError(error) {
    console.log("sendValidationError : ", error);
    if (error.name && error.name === SERVER_ERROR.UNIQUE)
      return this.response
        .status(500)
        .send({ error: SERVER_ERROR.UNIQUE_ERROR_MSG });
    else if (error.name && error.name === SERVER_ERROR.VALIDATION)
      return this.response.status(500).send({
        error: SERVER_ERROR.VALIDATION_ERROR_MSG,
        errorDetails: error,
      });
    else if (error.name) return this.response.status(500).send(error);
    else return this.response.status(400).send({ error });
  }

  sendServerError(error) {
    console.log("sendServerError : ", error);
    return this.response.status(500).send({ error });
  }

  handleCreatedResponse(data) {
    if (data.error === undefined) return this.sendResponse(data);
    if (data.error) return this.sendValidationError(data.errorText);
    else return this.sendCreatedResponse(data.values);
  }

  handleResponse(data) {
    if (data.error === undefined) return this.sendResponse(data);
    if (data.error) return this.sendValidationError(data.errorText);
    else return this.sendResponse(data.values);
  }

  handleFileResponse(data) {
    if (data.error === undefined) return this.sendResponse(data);
    if (data.error) return this.sendValidationError(data.errorText);
    this.response.header("Content-Type", "text/csv");
    this.response.attachment(process.env.FILE_NAME_FOR_DOWNLOAD);
    return this.response.send(data.values);
  }
}

export function handle(method) {
  return (request, response, next) => {
    method(new RequestHandler(request, response), next);
  };
}
// export async function authenticate(request, response, next) {
//   try {
//     const authorization = (request.headers["authorization"] || "").toString();
//     if (!authorization)
//       return response.status(401).send("Authorization required !");
//     const token = authorization.split("Bearer ")[1];
//     if (!token) {
//       return response.status(401).send("Authentication falied !");
//     }
//     const tokenData = jwt.decode(token);
//     // if (tokenData.exp < moment().unix()) {
//     // 	return response.status(401).send("Token expired !");
//     // }
//     if (tokenData?.data?.id) request.params.authUserId = tokenData.data.id;
//     next();
//   } catch (err) {
//     response.status(401).send("Invalid token !");
//   }
// }

// // Check for Permission
// export function checkPermission(permissionId: number) {
//   return async (request: Request, response: Response, next: (error?: any) => void) => {
//     try {
//       if ([ROLES.SUPER_ADMIN, ROLES.REGIONAL_ADMIN, ROLES.CS_ADMIN].includes(parseInt(request.params.authRoleId))) {
//         const user = await checkUserPermission(permissionId, request.params.authUserId);
//         if (!user) return response.send(403).end();
//       }
//       next();
//     }
//     catch (error) {
//       next(error);
//     }
//   };
// }

// // User Permission check
// export async function checkUserPermission(permissionId: number, authUserId: string) {
//   const user: any = await UserPermission.findOne({
//     where: { userId: authUserId, permissionId }
//   });
//   return user;
// }
