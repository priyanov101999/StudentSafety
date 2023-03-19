import * as PoliceManController from "./controller";
import { validator } from "../../validator/index";
import { handle } from "../../common/request-handler";
export default function (app) {
  app.post(
    "/policeStation",
    validator,
    handle(PoliceManController.createPoliceStation)
  );
  app.put(
    "/policeStation/:id",

    validator,
    handle(PoliceManController.updatePoliceStation)
  );
  app.get(
    "/policeStation/:id",

    validator,
    handle(PoliceManController.getPoliceStationById)
  );
  app.post(
    "/policeStations",

    validator,
    handle(PoliceManController.policeStationList)
  );
}
