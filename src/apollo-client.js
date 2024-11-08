// src/apollo-client.js
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const httpLink = createHttpLink({
  // uri: 'http://localhost/ecommerce/public/index.php', // Replace with the deployment GraphQL endpoint
  uri: "https://5da2-35-180-79-2.ngrok-free.app/ecommerce/public/index.php",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
