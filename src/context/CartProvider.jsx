// src/context/CartProvider.js
import { Component } from "react";
import PropTypes from "prop-types";
import { CartContext } from "./CartContext";
import CartStorage from "./CartStorage";
import SnackbarManager from "./SnackbarManager";
import CartUtils from "./CartUtils";

class CartProvider extends Component {
  constructor(props) {
    super(props);
    this.cartStorage = new CartStorage();
    this.snackbarManager = new SnackbarManager();

    this.state = {
      cartItems: [],
      total: 0,
      isCartOpen: false,
      snackbars: [],
    };
  }

  componentDidMount() {
    const { cartItems, total } = this.cartStorage.loadCart();
    if (cartItems && total) {
      this.setState({ cartItems, total });
    }
  }

  addToCart = (product, selectedAttributes = {}, isCartOpen) => {
    // If no attributes selected, use default ones
    if (!Object.keys(selectedAttributes).length) {
      selectedAttributes = CartUtils.getDefaultAttributes(product);
    }

    this.setState((prevState) => {
      const existingIndex = CartUtils.findExistingCartItem(
        prevState.cartItems,
        product.id,
        selectedAttributes
      );

      const newSnackbar = this.snackbarManager.createSnackbar(
        `${product.name} added to cart`
      );

      let updatedItems;
      if (existingIndex > -1) {
        updatedItems = [...prevState.cartItems];
        updatedItems[existingIndex].quantity += 1;
      } else {
        updatedItems = [
          ...prevState.cartItems,
          { ...product, quantity: 1, selectedAttributes },
        ];
      }

      const newTotal = CartUtils.calculateTotal(updatedItems);
      this.cartStorage.saveCart(updatedItems, newTotal);

      return {
        cartItems: updatedItems,
        total: newTotal,
        isCartOpen: isCartOpen ? true : prevState.isCartOpen,
        snackbars: [...prevState.snackbars, newSnackbar],
      };
    });
  };

  updateQuantity = (productId, selectedAttributes, newQuantity) => {
    this.setState((prevState) => {
      const updatedItems = prevState.cartItems
        .map((item) => {
          if (
            item.id === productId &&
            JSON.stringify(item.selectedAttributes) ===
              JSON.stringify(selectedAttributes)
          ) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      const newTotal = CartUtils.calculateTotal(updatedItems);
      this.cartStorage.saveCart(updatedItems, newTotal);

      return {
        cartItems: updatedItems,
        total: newTotal,
      };
    });
  };

  toggleCart = () => {
    this.setState((prevState) => ({
      isCartOpen: !prevState.isCartOpen,
    }));
  };

  removeSnackbar = (id) => {
    this.setState((prevState) => ({
      snackbars: this.snackbarManager.removeSnackbar(prevState.snackbars, id),
    }));
  };

  placeOrder = () => {
    console.log("Placing order...");
    this.cartStorage.clearCart();

    const newSnackbar = this.snackbarManager.createSnackbar(
      "Order placed successfully!"
    );

    this.setState({
      cartItems: [],
      total: 0,
      isCartOpen: false,
      snackbars: [...this.state.snackbars, newSnackbar],
    });
  };

  render() {
    const value = {
      ...this.state,
      addToCart: this.addToCart,
      updateQuantity: this.updateQuantity,
      toggleCart: this.toggleCart,
      removeSnackbar: this.removeSnackbar,
      placeOrder: this.placeOrder,
    };

    return (
      <CartContext.Provider value={value}>
        {this.props.children}
      </CartContext.Provider>
    );
  }
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartProvider;