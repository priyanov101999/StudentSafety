import { TYPES } from "../constants/Constants";
import BaseModel from "./BaseModel";

export default class AdminUser extends BaseModel {
  static get tableName() {
    return "admin_user";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        name: TYPES.STRING,
        mobileNo: TYPES.STRING,
        id: TYPES.ID,
      },
    };
  }

  static get relationMappings() {
    return {};
  }
}
