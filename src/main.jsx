// src/main.jsx
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import client from "./apollo-client";
import App from "./App";
import "./index.css";
import CartProvider from "./context/CartProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <CartProvider>
      <App />
    </CartProvider>
  </ApolloProvider>
);
