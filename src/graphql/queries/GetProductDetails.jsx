import { gql } from "@apollo/client";


export const GET_PRODUCT_DETAILS = gql`
  query GetProductDetails($id: ID!) {
    product(id: $id) {
      id
      name
      inStock
      description
      brand
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
    }
  }
`;

