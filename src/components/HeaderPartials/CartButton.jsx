// CartButton.js
import { Component } from "react";
import PropTypes from "prop-types";
import { PiShoppingCartLight } from "react-icons/pi";

class CartButton extends Component {
  render() {
    const { toggleCart, itemCount } = this.props;
    return (
      <button
        data-testid="cart-btn"
        onClick={toggleCart}
        className="relative p-2 transition-transform duration-300 ease-in-out hover:scale-110"
      >
        <PiShoppingCartLight className="w-6 h-6" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition-all duration-300 ease-in-out animate-pulse">
            {itemCount >= 2 ? "x" : `${itemCount}`}
          </span>
        )}
      </button>
    );
  }
}

CartButton.propTypes = {
  toggleCart: PropTypes.func.isRequired,
  itemCount: PropTypes.number.isRequired,
};

export default CartButton;
