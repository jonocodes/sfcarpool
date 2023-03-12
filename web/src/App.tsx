import { split, HttpLink } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'

import './index.css'

const uri = global.RWJS_API_GRAPHQL_URL

const wsUrl = uri.replace(/http(s)?\:\/\//, 'ws$1://')

console.log(wsUrl)

const httpLink = new HttpLink({
  uri: uri,
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: wsUrl,
  })
)

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)

    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },

  wsLink,

  httpLink
)

const App = () => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider titleTemplate="%AppTitle">
      <RedwoodApolloProvider graphQLClientConfig={{ link: splitLink }}>
        <Routes />
      </RedwoodApolloProvider>
    </RedwoodProvider>
  </FatalErrorBoundary>
)

export default App
