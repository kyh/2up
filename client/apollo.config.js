module.exports = {
  client: {
    service: {
      name: "playhouse",
      url: "http://localhost:4000/graphql",
      skipSSLValidation: true,
    },
    includes: ["src/**/*.tsx"],
    tagName: "gql",
  },
};
