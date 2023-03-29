import * as LoginController from "./controller";
import { validator } from "../../validator/index";
import { handle } from "../../common/request-handler";
export default function (app) {
  app.post("/login", validator, handle(LoginController.login));
  app.post(
    "/policemanLogin",

    validator,
    handle(LoginController.policemanLogin)
  );
}
