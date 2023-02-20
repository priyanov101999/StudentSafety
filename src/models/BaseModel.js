import { Model } from "objection";
import { v4 as uuid } from "uuid";
import knex from "../knex";
Model.knex(knex);
export default class BaseModel extends Model {
  async $beforeInsert(context) {
    await super.$beforeInsert(context);
    this.id = this.id || uuid();
  }
}
