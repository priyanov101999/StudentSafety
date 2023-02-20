import { Model } from "objection";
import { TYPES } from "../constants/Constants";
import BaseModel from "./BaseModel";
import PoliceMan from "./PoliceMan";

export default class PoliceStation extends BaseModel {
  static get tableName() {
    return "police_station";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        latitude: TYPES.STRING,
        longitude: TYPES.STRING,
        name: TYPES.STRING,
      },
    };
  }

  static get relationMappings() {
    return {
      policeMan: {
        relation: Model.HasManyRelation,
        modelClass: PoliceStation,
        join: {
          from: `${this.tableName}.id`,
          to: `${PoliceMan.tableName}.policeStationId`,
        },
      },
    };
  }
}
