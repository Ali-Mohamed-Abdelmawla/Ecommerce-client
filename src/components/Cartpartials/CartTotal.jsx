//  src/components/Cartpartials/CartTotal.jsx
import { Component } from "react";
import PropTypes from "prop-types";

class CartTotal extends Component {
  render() {
    const { total } = this.props;
    
    return (
      <div className="mt-3 sm:mt-4">
        <div className="flex justify-between font-bold text-base sm:text-lg">
          <span>Total:</span>
          <span data-testid="cart-total">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>
    );
  }
}

CartTotal.propTypes = {
  total: PropTypes.number.isRequired,
};

export default CartTotal;