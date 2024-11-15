import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts($categoryId: ID!) {
    category(id: $categoryId) {
      id
      name
      typename
      products {
        id
        name
        inStock
        description
        brand
        attributes {
          id
          name
          type
          items {
            id
            value
            display_value
          }
        }
        prices {
          id
          amount
          currency_label
          currency_symbol
        }
        gallery {
          id
          image_url
        }
      }
    }
  }
`;