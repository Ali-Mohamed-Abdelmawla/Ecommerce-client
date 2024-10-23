// src/apollo-client.js
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Your ngrok URI and authentication details
const username = 'your-username';
const password = 'your-password';
const encodedCredentials = btoa(`${username}:${password}`);

// Create HTTP Link to the GraphQL endpoint
const httpLink = createHttpLink({
  uri: 'https://828c-197-36-122-196.ngrok-free.app/ecommerce2/public/index.php'
});

// Set the Authorization header for Basic Authentication
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      Authorization: `Basic ${encodedCredentials}`
    }
  };
});

// Combine authLink and httpLink
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default client;
