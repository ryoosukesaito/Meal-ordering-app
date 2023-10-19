import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL

const httpLink = new HttpLink({
  uri: `${serverURL}/graphql`
  // uri: 'http://localhost:4000/graphql'
})

const wsURI = serverURL?.startsWith('http://localhost')
  ? `ws${serverURL.substring(4)}/subscriptions`
  : serverURL?.startsWith('https')
  ? `wss${serverURL.substring(5)}/subscriptions`
  : ''

const wsLink = new GraphQLWsLink(
  createClient({
    // url: wsURI
    url: 'ws://localhost:4001/subscriptions'
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

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
})
