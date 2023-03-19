export const TYPES = {
  STRING: {
    type: ["string", "null"],
    minLength: 0,
    maxLength: 255,
  },
  LONGTEXT: {
    type: ["string", "null"],
    minLength: 0,
    maxLength: 4294967295,
  },
  ID: {
    type: "string",
    minLength: 0,
    maxLength: 36,
  },
  EMAIL: {
    type: "string",
    minLength: 0,
    maxLength: 255,
  },
  TEXT: {
    type: ["string", "null"],
    minLength: 0,
    maxLength: 65535,
  },
  DECIMAL: {
    type: ["number", "null"],
  },
  INTEGER: {
    type: ["integer", "null"],
  },
  BOOLEAN: {
    type: ["boolean", "null"],
  },
  CUSTOMSTRING: (length = 100) => ({
    type: ["string", "null"],
    minLength: 0,
    maxLength: length,
  }),
  DATE: {
    type: ["string", "null"],
  },
  JSON: {
    type: ["object", "null"],
  },
  TIME: {
    type: ["string", "null"],
  },
};

export const SERVER_ERROR = {
  UNIQUE: "UniqueViolationError",
  UNIQUE_ERROR_MSG: "Duplicate Entry",
  VALIDATION: "ValidationError",
  VALIDATION_ERROR_MSG: "Type Validation Error",
  FOREIGN_KEY: "ForeignKeyViolationError",
};
