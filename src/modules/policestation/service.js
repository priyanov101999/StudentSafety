import knex from "../../knex";
import PoliceStation from "../../models/PoliceStation";
import fetchTableList from "../../utils/listing-helper";
export default class Service {
  static createPoliceStation = async (data) => {
    try {
      await PoliceStation.query().insert(data);
      return {
        message: "Police Station Created Successfully",
      };
    } catch (error) {
      return {
        error: true,
        errorText: error,
      };
    }
  };

  static updatePoliceStation = async (data, id) => {
    try {
      let exists = PoliceStation.query().findById(id);
      if (!exists) {
        return {
          error: true,
          errorText: "Police Station not found",
        };
      } else {
        await PoliceStation.query().upsertGraphAndFetch({ ...data, id });
        return {
          message: "Police Station Updated Successfully",
        };
      }
    } catch (error) {
      return {
        error: true,
        errorText: error,
      };
    }
  };

  static getPoliceStationById = async (id) => {
    try {
      let policeStation = await PoliceStation.query().findById(id);
      if (!policeStation) {
        return {
          error: true,
          errorText: "Police station not found",
        };
      }
      return policeStation;
    } catch (error) {
      return {
        error: true,
        errorText: error,
      };
    }
  };

  static policeStationList = async (data) => {
    try {
      let query = PoliceStation.query().toKnexQuery().clearSelect();
      query.select("police_station.*");
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
}
