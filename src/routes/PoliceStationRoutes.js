import * as PoliceStationController from "./../controller/PoliceStationController.js";
export default function (app) {
  app.post(
    "/policeStation",

    PoliceStationController.createPoliceStation
  );
  app.put(
    "/policeStation/:id",

    PoliceStationController.updatePoliceStation
  );
  app.get(
    "/policeStation/:id",

    PoliceStationController.getPoliceStationById
  );
  app.post("/policeStations", PoliceStationController.policeStationList);
}
