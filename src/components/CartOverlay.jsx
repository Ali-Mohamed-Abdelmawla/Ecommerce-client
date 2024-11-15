// src/components/CartOverlay.jsx
import { Component } from "react";
import PropTypes from "prop-types";
import { Mutation } from "@apollo/client/react/components";
import { CREATE_ORDER_MUTATION } from "../graphql/mutations/CreateOrder";
import CartItem from "./Cartpartials/CartItem";
import CartTotal from "./Cartpartials/CartTotal";
import OrderButton from "./Cartpartials/OrderButton";

class CartOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRendered: false,
      isVisible: false
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.isOpen !== prevProps.isOpen) {
      if (this.props.isOpen) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.setState({ isRendered: true }, () => {
          requestAnimationFrame(() => {
            this.setState({ isVisible: true });
          });
        });
      } else {
        this.setState({ isVisible: false });
        setTimeout(() => {
          if (!this.props.isOpen) {
            this.setState({ isRendered: false });
          }
        }, 300);
      }
    }
  }

  handleCartClick = (e) => {
    e.stopPropagation();
  };

  render() {
    const { isRendered, isVisible } = this.state;
    const {
      cartItems,
      total,
      updateQuantity,
      itemCount,
      onOrderPlaced,
    } = this.props;

    if (!isRendered) return null;

    return (

      <Mutation
        mutation={CREATE_ORDER_MUTATION}
        onCompleted={onOrderPlaced}
      >
        {(createOrder, { loading, error }) => (
          <div
            data-testid="cart-overlay"
            className={`fixed right-0 sm:right-4 top-14 z-50 w-full sm:w-96 max-h-[calc(100vh-5rem)] 
              overflow-y-auto bg-white p-3 sm:p-4 rounded-lg shadow-xl transform transition-all 
              duration-300 ease-in-out ${
                isVisible
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            onClick={this.handleCartClick}
          >
          
            <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
              My Cart, {itemCount === 1 ? "1 Item" : `${itemCount} Items`}
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={`${item.id}-${JSON.stringify(item.selectedAttributes)}`}
                  item={item}
                  updateQuantity={updateQuantity}
                />
              ))}
            </div>

            <CartTotal total={total} />

            {error && (
              <div className="mt-3 sm:mt-4 text-red-500 text-sm">
                {error.message}
              </div>
            )}

            <OrderButton
              loading={loading}
              disabled={cartItems.length === 0}
              cartItems={cartItems}
              createOrder={createOrder}
            />
          </div>
        )}
      </Mutation>
    );
  }
}

CartOverlay.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  cartItems: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  updateQuantity: PropTypes.func.isRequired,
  toggleCart: PropTypes.func.isRequired,
  onOrderPlaced: PropTypes.func.isRequired,
  itemCount: PropTypes.number.isRequired,
};

export default CartOverlay;