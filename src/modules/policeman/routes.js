import * as PoliceManController from "./controller";
import { validator } from "../../validator/index";
import { handle } from "../../common/request-handler";
export default function (app) {
  app.post(
    "/policeman",
    validator,
    handle(PoliceManController.createPoliceman)
  );
  app.put(
    "/policeman/:id",

    validator,
    handle(PoliceManController.updatePoliceman)
  );
  app.get(
    "/policeman/:id",

    validator,
    handle(PoliceManController.getPolicemanById)
  );
  app.post(
    "/policemanList",

    validator,
    handle(PoliceManController.policemanList)
  );
}
