import { gql } from "@apollo/client";

export const CREATE_ORDER_MUTATION = gql`
mutation CreateOrder($input: OrderInput!) {
  createOrder(input: $input) {
    id
    status
    created_at
    total_amount
    currency_label
    currency_symbol
    product_list
  }
}
`;
