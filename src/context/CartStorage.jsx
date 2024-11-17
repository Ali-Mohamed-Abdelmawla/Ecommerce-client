// src/context/CartStorage.js
class CartStorage {
    saveCart(cartItems, total) {
      sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
      sessionStorage.setItem("cartTotal", total.toString());
    }
  
    loadCart() {
      const savedCart = sessionStorage.getItem("cartItems");
      const savedTotal = sessionStorage.getItem("cartTotal");
      return {
        cartItems: savedCart ? JSON.parse(savedCart) : [],
        total: savedTotal ? parseFloat(savedTotal) : 0,
      };
    }
  
    clearCart() {
      sessionStorage.removeItem("cartItems");
      sessionStorage.removeItem("cartTotal");
    }
  }
  
  export default CartStorage;