import * as ReportController from "./controller";
import { validator } from "../../validator/index";
import { handle } from "../../common/request-handler";
export default function (app) {
  app.post("/report", validator, handle(ReportController.createReport));
  app.put(
    "/assignReportToPoliceman/:id",

    validator,
    handle(ReportController.assignReportToPoliceman)
  );
  app.put(
    "/resolvedReport/:id",

    validator,
    handle(ReportController.resolvedReport)
  );
  app.put(
    "/assignReportToOtherPoliceStation/:id",
    validator,
    handle(ReportController.assignReportToOtherPoliceStation)
  );
  app.post(
    "/reports",

    validator,
    handle(ReportController.reportList)
  );
  app.get(
    "/assignedReportsByPoliceMan/:policemanId",

    validator,
    handle(ReportController.assignedReportsByPoliceMan)
  );
  app.post("/phoneNoOfNearestStation", validator, handle(ReportController.phoneNoOfNearestStation));
}
