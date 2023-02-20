import { TYPES } from "../constants/Constants";
import BaseModel from "./BaseModel";

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
    return {};
  }
}
