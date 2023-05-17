import knex from "../../knex";
import PoliceMan from "../../models/PoliceMan";
import fetchTableList from "../../utils/listing-helper";
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
      let query = PoliceMan.query().toKnexQuery().clearSelect();
      query.select("policeman.*");
      return fetchTableList({
        baseQuery: query,
        filters: data.filters,
        pagination: data.pagination,
        sorting: data.sorting,
        search: data.search,
      });
    } catch (error) {
      return {
        error: true,
        errorText: error,
      };
    }
  };

  static policemanListByStationId = async (policeStationId) => {
    try {
      let list = await PoliceMan.query().where({ policeStationId });

      return list;
    } catch (error) {
      return {
        error: true,
        errorText: error,
      };
    }
  };
}
