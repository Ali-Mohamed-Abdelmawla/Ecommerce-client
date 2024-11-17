// src/context/CartUtils.js
class CartUtils {
    static calculateTotal(cartItems) {
      return cartItems.reduce(
        (acc, item) => acc + item.prices[0].amount * item.quantity,
        0
      );
    }
  
    static getDefaultAttributes(product) {
      return product.attributes.reduce((acc, attr) => {
        if (attr.items.length) acc[attr.id] = attr.items[0].value;
        return acc;
      }, {});
    }
  
    static findExistingCartItem(cartItems, productId, selectedAttributes) {
      return cartItems.findIndex(
        item =>
          item.id === productId &&
          JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
      );
    }
  }
  
  export default CartUtils;