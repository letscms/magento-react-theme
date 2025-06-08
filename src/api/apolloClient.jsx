import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Base URL for Magento GraphQL API
const BASE_URL = `${import.meta.env.VITE_BASE_URL}/graphql`;

// Create the HTTP link for public API access
const httpLink = createHttpLink({
  uri: BASE_URL,
  credentials: 'same-origin', // Include cookies for session-based auth if needed
});

// Create the Apollo Client
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          products: {
            // Merge function for products query to handle pagination
            merge(existing = { items: [] }, incoming) {
              return incoming;
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

// Function to reset the Apollo Client cache
export const resetApolloCache = () => {
  return apolloClient.resetStore();
};

export default apolloClient;
