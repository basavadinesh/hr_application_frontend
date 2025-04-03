export const AppConfigProps = {
  serverRoutePrefix: "",
  httpStatusCode: {
    ok: 200,
    badRequest: 400,
    unauthorized: 401,
    notFound: 404,
    unprocessable: 422,
    internalServerError: 500,
  },
  identitySession: {
    tokenKey: "sram-t",
    expiryCheckRemainingSeconds: 600,
  },
  identityProfile: {
    profileKey: "user-profile",
  },
  logging: {
    userPageAccess: true,
  },

  listPage: {
    searchKeyword: {
      defaultValue: "",
    },
    pageOffset: {
      defaultValue: 0,
    },
    pageLimit: {
      defaultValue: 20,
    },
    sortField: {
      defaultValue: "",
    },
    sortOrder: {
      defaultValue: 1,
      ascendingValue: 1,
      descendingValue: -1,
      ASCENDING: "ASC",
      DESCENDING: "DESC",
    },
  },
};
