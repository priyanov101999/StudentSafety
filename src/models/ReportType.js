import { TYPES } from "../constants/Constants";
import BaseModel from "./BaseModel";

export default class ReportType extends BaseModel {
  static get tableName() {
    return "report_type";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: TYPES.ID,
        name: TYPES.STRING,
      },
    };
  }

  static get relationMappings() {
    return {};
  }
}
