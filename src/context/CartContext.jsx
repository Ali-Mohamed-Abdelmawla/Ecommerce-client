// CartContext.js
import { Component, createContext } from "react";
import PropTypes from "prop-types";

export const CartContext = createContext();

class CartProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems: [],
      total: 0,
      isCartOpen: false,
      snackbars: [],
    };
  }

  componentDidMount() {
    const savedCart = sessionStorage.getItem("cartItems");
    const savedTotal = sessionStorage.getItem("cartTotal");
    if (savedCart && savedTotal) {
      this.setState({
        cartItems: JSON.parse(savedCart),
        total: parseFloat(savedTotal),
      });
    }
  }

  saveCartToSession = (cartItems, total) => {
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
    sessionStorage.setItem("cartTotal", total.toString());
  };

  addToCart = (product, selectedAttributes = {}, isCartOpen) => {
    if (!Object.keys(selectedAttributes).length) {
      selectedAttributes = product.attributes.reduce((acc, attr) => {
        if (attr.items.length) acc[attr.id] = attr.items[0].value;
        return acc;
      }, {});
    }

    this.setState((prevState) => {
      const existingIndex = prevState.cartItems.findIndex(
        (item) =>
          item.id === product.id &&
          JSON.stringify(item.selectedAttributes) ===
            JSON.stringify(selectedAttributes)
      );

      const newSnackbar = {
        id: Date.now(),
        message: `${product.name} added to cart`,
      };

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

      const newTotal = updatedItems.reduce(
        (acc, item) => acc + item.prices[0].amount * item.quantity,
        0
      );

      this.saveCartToSession(updatedItems, newTotal);

      if (isCartOpen) {
        return {
          cartItems: updatedItems,
          total: newTotal,
          isCartOpen: true,
          snackbars: [...prevState.snackbars, newSnackbar],
        };
      } else {
        return {
          cartItems: updatedItems,
          total: newTotal,
          snackbars: [...prevState.snackbars, newSnackbar],
        };
      }
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

      const newTotal = updatedItems.reduce(
        (acc, item) => acc + item.prices[0].amount * item.quantity,
        0
      );

      this.saveCartToSession(updatedItems, newTotal);

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
      snackbars: prevState.snackbars.filter((snackbar) => snackbar.id !== id),
    }));
  };

  placeOrder = () => {
    console.log("Placing order...");
    sessionStorage.removeItem("cartItems");
    sessionStorage.removeItem("cartTotal");

    this.setState({
      cartItems: [],
      total: 0,
      isCartOpen: false,
      snackbars: [
        ...this.state.snackbars,
        { id: Date.now(), message: "Order placed successfully!" },
      ],
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