const { getPaths } = require('@redwoodjs/internal')

// module.exports = {
//   schema: getPaths().generated.schema,
// }

module.exports = {
  // URL of your Hasura backend
  schema: `http://localhost:8080/v1/graphql`,
}
