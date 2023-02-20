import { TYPES } from "../constants/Constants";
import BaseModel from "./BaseModel";

export default class PoliceMan extends BaseModel {
  static get tableName() {
    return "policeman";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        name: TYPES.STRING,
        mobileNo: TYPES.STRING,
        emailId: TYPES.STRING,
        policeStationId: TYPES.ID,
      },
    };
  }

  static get relationMappings() {
    return {};
  }
}
