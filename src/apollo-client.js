// src/apollo-client.js
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const httpLink = createHttpLink({
  // uri: 'http://localhost/ecommerce2/public/index.php', // Replace with your actual GraphQL endpoint
  uri: "https://f3dc-41-45-83-109.ngrok-free.app/ecommerce2/public/index.php",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
