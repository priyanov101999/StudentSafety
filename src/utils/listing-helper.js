import _ from "lodash";
import knex from "../knex";

export function constuctFilter(builder, filters) {
  const filterConfig = {
    eq: (field, value) => builder.having(field, "=", value),
    ne: (field, value) => builder.having(field, "<>", value),
    contains: (field, value) => builder.having(field, "like", `%${value}%`),
    notContains: (field, value) =>
      builder.having(field, "not like", `%${value}%`),
    gt: (field, value) => builder.having(field, ">", value),
    ge: (field, value) => builder.having(field, ">=", value),
    lt: (field, value) => builder.having(field, "<", value),
    le: (field, value) => builder.having(field, "<=", value),
    in: (field, value) => builder.havingIn(field, value),
    notIn: (field, value) => builder.havingNotIn(field, value),
    between: (field, value) => builder.havingBetween(field, value),
    beginsWith: (field, value) => builder.having(field, "like", `${value}%`),
    endsWith: (field, value) => builder.having(field, "like", `%${value}`),
    isNull: (field, value) => builder.havingNull(field),
    isNotNull: (field, value) => builder.havingNotNull(field),
  };

  filters.map((filter) =>
    filterConfig[filter.type](filter.field, filter.value)
  );
}

function constuctSearch(builder, search) {
  if (search.value)
    builder.having(
      knex.raw(
        `concat_ws(' ', ${search.fields.toString()}) LIKE '%${search.value}%'`
      )
    );
}

export default async function fetchTableList({
  baseQuery,
  filters = [],
  pagination = { limit: 100, offset: 0 },
  sorting = [],
  // sorting = [{ column: "createdAt", order: "desc" }],
  search = { fields: [], value: "" },
}) {
  console.log("filters : ", filters);
  baseQuery.modify((builder) => constuctFilter(builder, filters));

  if (!_.isEmpty(search)) constuctSearch(baseQuery, search);

  const countQuery = knex
    .from(baseQuery.clone().as("List"))
    .count({ count: `*` });

  const [countResult, rows] = await Promise.all([
    countQuery,
    baseQuery
      .orderBy(sorting)
      .limit(pagination.limit)
      .offset(pagination.offset),
  ]);
  return { count: countResult[0].count, rows };
}
