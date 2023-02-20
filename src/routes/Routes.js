import { default as ParameterRoutes } from "./ParameterRoutes.js";
import { default as PoliceStationRoutes } from "./PoliceStationRoutes.js";
import { default as PoliceManRoutes } from "./PoliceManRoutes.js";
import { default as ReportRoutes } from "./ReportRoutes.js";
export default function (app) {
  ParameterRoutes(app);
  PoliceStationRoutes(app);
  PoliceManRoutes(app);
  ReportRoutes(app);
}
