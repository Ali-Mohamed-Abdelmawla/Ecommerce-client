//  src/components/Cartpartials/OrderButton.jsx
import { Component } from "react";
import PropTypes from "prop-types";

class OrderButton extends Component {
  handleOrder = () => {
    const { cartItems, createOrder } = this.props;
    const orderInput = {
      products: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.prices[0].amount,
        selectedAttributes: Object.entries(
          item.selectedAttributes
        ).map(([id, value]) => ({
          id,
          selectedItemId: value,
        })),
      })),
      currency_label: "USD",
      currency_symbol: "$",
    };
    createOrder({ variables: { input: orderInput } });
  };

  render() {
    const { loading, disabled } = this.props;
    
    return (
      <div className="mt-3 sm:mt-4">
        <button
          onClick={this.handleOrder}
          disabled={disabled || loading}
          className={`px-3 sm:px-4 py-2 rounded text-white font-semibold w-full text-sm sm:text-base ${
            disabled || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          } transition duration-200`}
        >
          {loading ? "PLACING ORDER..." : "PLACE ORDER"}
        </button>
      </div>
    );
  }
}

OrderButton.propTypes = {
  loading: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  cartItems: PropTypes.array.isRequired,
  createOrder: PropTypes.func.isRequired,
};

export default OrderButton;