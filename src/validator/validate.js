export const createPoliceStation = (request) => {
  request
    .assert("latitude", `Latitude is mandatory and should be a string`)
    .notEmpty()
    .isString();
  request
    .assert("longitude", `Longitude is mandatory and should be a string`)
    .notEmpty()
    .isString();
  request
    .assert("name", `Police Station name is mandatory and should be a string`)
    .notEmpty()
    .isString();
  request
    .assert("password", `Password is mandatory and should be a string`)
    .notEmpty()
    .isString();
};

export const updatePoliceStation = (request) => {
  request
    .assert("latitude", `Latitude is mandatory and should be a string`)
    .notEmpty()
    .isString();
  request
    .assert("longitude", `Longitude is mandatory and should be a string`)
    .notEmpty()
    .isString();
  request
    .assert("name", `Police Station name is mandatory and should be a string`)
    .notEmpty()
    .isString();
  request
    .assert("password", `Password is mandatory and should be a string`)
    .notEmpty()
    .isString();
};

export const createPoliceman = (request) => {
  request
    .assert("name", `Policeman name is mandatory and should be a string`)
    .notEmpty()
    .isString();
  request.assert("mobileNo", `Mobile no is mandatory`).notEmpty().isString();
  request
    .assert("emailId", `Email is mandatory and should be a string`)
    .notEmpty()
    .isString();
  request
    .assert("policeStationId", `Police sation is mandatory`)
    .notEmpty()
    .isUUID();
};
export const updatePoliceman = (request) => {
  request
    .assert("name", `Policeman name is mandatory and should be a string`)
    .notEmpty()
    .isString();
  request.assert("mobileNo", `Mobile no is mandatory`).notEmpty().isString();
  request
    .assert("emailId", `Email is mandatory and should be a string`)
    .notEmpty()
    .isString();
  request
    .assert("policeStationId", `Police sation is mandatory`)
    .notEmpty()
    .isUUID();
};
export const createReport = (request) => {
  request
    .assert(
      "currentLatitude",
      `Current Latitude is mandatory and should be a string`
    )
    .notEmpty()
    .isString();
  request
    .assert(
      "currentLongitude",
      `Current Longitude is mandatory and should be a string`
    )
    .notEmpty()
    .isString();
  request
    .assert("reportTypeId", `Report Type is mandatory`)
    .notEmpty()
    .isUUID();
};
export const assignReportToPoliceman = (request) => {
  request.assert("policemanId", `Poilce man is mandatory`).notEmpty().isUUID();
};
