import * as ReportController from "./../controller/ReportController.js";
export default function (app) {
  app.post("/report", ReportController.createReport);
  app.put(
    "/assignReportToPoliceman/:id",

    ReportController.assignReportToPoliceman
  );
  app.put("/resolvedReport/:id", ReportController.resolvedReport);
  app.get("/reports", ReportController.ReportList);
  app.get(
    "/assignedReportsByPoliceMan/:policemanId",
    ReportController.getAssignedReportsByPoliceMan
  );
}
