import knex from "../../knex";
import AdminUser from "../../models/AdminUser";
import PoliceMan from "../../models/PoliceMan";
import PoliceStation from "../../models/PoliceStation";
export default class Service {
  static login = async (data) => {
    try {
      let loginDetails = await AdminUser.query().findOne(data);
      if (loginDetails) {
        loginDetails.isSuperAdmin = true;
        loginDetails.isPoliceStationAdmin = false;
        return loginDetails;
      }
      loginDetails = await PoliceStation.query().findOne(data);
      if (loginDetails) {
        loginDetails.isPoliceStationAdmin = true;
        loginDetails.isSuperAdmin = false;
        return loginDetails;
      }
      return {
        error: true,
        errorText: "User not found",
      };
    } catch (error) {
      return {
        error: true,
        errorText: error,
      };
    }
  };

  static policemanLogin = async (data) => {
    try {
      let loginDetails = await PoliceStation.query().findOne(data);
      if (loginDetails) {
        loginDetails.isPoliceStationAdmin = true;
        return loginDetails;
      }
      loginDetails = await PoliceMan.query()
        .join(
          "police_station",
          "police_station.id",
          "policeman.policeStationId"
        )
        .select("policeman.*")
        .where("policeman.mobileNo", "=", data.mobileNo)
        .where("police_station.password", "=", data.password)
        .first();
      if (!loginDetails) {
        return {
          error: true,
          errorText: "User not found",
        };
      } else {
        loginDetails.isPoliceStationAdmin = false;
        return loginDetails;
      }
    } catch (error) {
      return {
        error: true,
        errorText: error,
      };
    }
  };
}
