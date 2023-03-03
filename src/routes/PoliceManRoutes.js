import * as PoliceManController from "./../controller/PoliceManController.js";
export default function (app) {
  app.post(
    "/policeman",

    PoliceManController.createPoliceman
  );
  app.put(
    "/policeman/:id",

    PoliceManController.updatePoliceman
  );
  app.get(
    "/policeman/:id",

    PoliceManController.getPolicemanById
  );
  app.post(
    "/policemanList",

    PoliceManController.policemanList
  );
}
