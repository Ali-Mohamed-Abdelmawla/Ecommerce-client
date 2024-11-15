//  src/components/Cartpartials/CartItem.jsx
import { Component } from "react";
import PropTypes from "prop-types";
import CartAttribute from "./CartAttribute";

class CartItem extends Component {
  handleDecreaseQuantity = () => {
    const { item, updateQuantity } = this.props;
    updateQuantity(item.id, item.selectedAttributes, item.quantity - 1);
  };

  handleIncreaseQuantity = () => {
    const { item, updateQuantity } = this.props;
    updateQuantity(item.id, item.selectedAttributes, item.quantity + 1);
  };

  render() {
    const { item } = this.props;

    return (
      <div className="border-b pb-3 sm:pb-4 flex gap-2 sm:gap-4 items-start">
        <img
          src={item.gallery[0].image_url}
          alt={item.name}
          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
        />

        <div className="flex-1">
          <p className="font-bold text-sm sm:text-base">{item.name}</p>
          <p className="text-gray-600 text-xs sm:text-sm">
            ${item.prices[0].amount.toFixed(2)}
          </p>

          {item.attributes.map((attribute) => (
            <CartAttribute
              key={attribute.id}
              attribute={attribute}
              selectedValue={item.selectedAttributes[attribute.id]}
            />
          ))}

          <div className="flex items-center mt-2">
            <button
              data-testid="cart-item-amount-decrease"
              onClick={this.handleDecreaseQuantity}
              className="px-2 py-1 bg-gray-200 rounded transition hover:bg-gray-300 text-sm sm:text-base"
            >
              -
            </button>
            <span
              data-testid="cart-item-amount"
              className="mx-2 sm:mx-3 font-semibold text-sm sm:text-base"
            >
              {item.quantity}
            </span>
            <button
              data-testid="cart-item-amount-increase"
              onClick={this.handleIncreaseQuantity}
              className="px-2 py-1 bg-gray-200 rounded transition hover:bg-gray-300 text-sm sm:text-base"
            >
              +
            </button>
          </div>
        </div>
      </div>
    );
  }
}

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    gallery: PropTypes.arrayOf(
      PropTypes.shape({
        image_url: PropTypes.string.isRequired,
      })
    ).isRequired,
    prices: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
      })
    ).isRequired,
    attributes: PropTypes.array.isRequired,
    selectedAttributes: PropTypes.object.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  updateQuantity: PropTypes.func.isRequired,
};

export default CartItem;