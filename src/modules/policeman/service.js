import knex from "../../knex";
import PoliceMan from "../../models/PoliceMan";
export default class Service {
  static createPoliceman = async (data) => {
    try {
      await PoliceMan.query().insert(data);
      return {
        message: "Policeman Created Successfully",
      };
    } catch (error) {
      return {
        error: true,
        errorText: error,
      };
    }
  };

  static updatePoliceman = async (data, id) => {
    try {
      let exists = PoliceMan.query().findById(id);
      if (!exists) {
        return {
          error: true,
          errorText: "Policeman not found",
        };
      } else {
        await PoliceMan.query().upsertGraphAndFetch({ ...data, id });
        return {
          message: "Policeman Updated Successfully",
        };
      }
    } catch (error) {
      return {
        error: true,
        errorText: error,
      };
    }
  };

  static getPolicemanById = async (id) => {
    try {
      let policeman = await PoliceMan.query().findById(id);
      if (!policeman) {
        return {
          error: true,
          errorText: "Policeman not found",
        };
      }
      return policeman;
    } catch (error) {
      return {
        error: true,
        errorText: error,
      };
    }
  };

  static policemanList = async (data) => {
    try {
      let { pagination, search, sorting } = data;
      let list = await PoliceMan.query()
        .select("policeman.*")
        .orderBy(sorting)
        .having(
          knex.raw(
            `concat_ws(' ', ${search.fields.toString()}) LIKE '%${
              search.value
            }%'`
          )
        )
        .limit(pagination.limit)
        .offset(pagination.offset);

      return list;
    } catch (error) {
      return {
        error: true,
        errorText: error,
      };
    }
  };
}
