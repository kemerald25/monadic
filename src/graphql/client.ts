import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { config } from '../lib/config'

// The Graph subgraph endpoint from environment variables
const SUBGRAPH_URL = config.graph.subgraphUrl

const httpLink = createHttpLink({
  uri: SUBGRAPH_URL,
})

const authLink = setContext((_, { headers }) => {
  const authHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // Add API key if available
  if (config.graph.apiKey) {
    authHeaders['Authorization'] = `Bearer ${config.graph.apiKey}`
  }

  return {
    headers: {
      ...headers,
      ...authHeaders,
    }
  }
})

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Event: {
        fields: {
          ticketTiers: {
            merge: false,
          },
          sponsorshipTiers: {
            merge: false,
          },
          polls: {
            merge: false,
          },
          attendanceRecords: {
            merge: false,
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
})

export default apolloClient