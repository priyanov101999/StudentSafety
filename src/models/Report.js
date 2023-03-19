import { Model } from "objection";
import { TYPES } from "../constants/Constants";
import BaseModel from "./BaseModel";
import ReportType from "./ReportType";

export default class Report extends BaseModel {
  static get tableName() {
    return "report";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        currentLatitude: TYPES.STRING,
        currentLongitude: TYPES.STRING,
        stationLatitude: TYPES.STRING,
        stationLongitude: TYPES.STRING,
        reportTypeId: TYPES.ID,
        policemanId: TYPES.ID,
      },
    };
  }

  static get relationMappings() {
    return {
      reportType: {
        relation: Model.BelongsToOneRelation,
        modelClass: ReportType,
        filter: (query) => query.select("id", "name"),
        join: {
          from: `${this.tableName}.reportTypeId`,
          to: `${ReportType.tableName}.id`,
        },
      },
    };
  }
}
