import { default as ParameterRoutes } from "./ParameterRoutes.js";
import { default as PoliceStationRoutes } from "../modules/policestation/routes";
import { default as PoliceManRoutes } from "../modules/policeman/routes";
import { default as ReportRoutes } from "../modules/reports/routes";
import { default as LoginRoutes } from "../modules/login/routes";
export default function (app) {
  ParameterRoutes(app);
  PoliceStationRoutes(app);
  PoliceManRoutes(app);
  ReportRoutes(app);
  LoginRoutes(app);
}
