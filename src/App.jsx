// App.js
import { Component } from "react";
import { CartContext } from "./context/CartContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import CartOverlay from "./components/CartOverlay";
import Snackbar from "./components/Snackbar";
import { ProductListWrapper } from "./routerWrappers/ProductListWrapper";
import { ProductDetailsWrapper } from "./routerWrappers/ProductDetailsWrapper";
class App extends Component {
  static contextType = CartContext;

  constructor(props) {
    super(props);
    this.state = {
      activeCategory: "1",
    };
  }

  handleCategoryChange = (categoryId) => {
    this.setState({ activeCategory: categoryId });
  };

  render() {
    const {
      cartItems,
      total,
      isCartOpen,
      snackbars,
      updateQuantity,
      toggleCart,
      removeSnackbar,
      placeOrder,
    } = this.context;

    if (isCartOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    const { activeCategory } = this.state;
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
      <BrowserRouter>
        <div className="App flex flex-col min-h-screen">
          <Header
            onCategoryChange={this.handleCategoryChange}
            cartItems={cartItems}
            total={total}
            toggleCart={toggleCart}
            activeCategory={activeCategory}
            itemCount={itemCount}
            isCartOpen={isCartOpen}
          />

          <div className="flex-grow relative">
            {isCartOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out z-20"
                onClick={toggleCart}
                style={{ top: "var(--header-height, 75px)" }}
              />
            )}

            <div className="relative z-10">
            <Routes>
              <Route
                path="/"
                element={<Navigate to="/all" />}
              />
              <Route
                path="/:categoryName"
                element={
                  <ProductListWrapper
                    addToCart={this.context.addToCart}
                    toggleCart={toggleCart}
                  />
                }
              />
              <Route
                path="/product/:productId"
                element={
                  <ProductDetailsWrapper
                    addToCart={this.context.addToCart}
                    toggleCart={toggleCart}
                  />
                }
              />
              <Route path="*" element={<div>Page not found</div>} />
            </Routes>
            </div>
          </div>

          <CartOverlay
            isOpen={isCartOpen}
            cartItems={cartItems}
            total={total}
            itemCount={itemCount}
            updateQuantity={updateQuantity}
            toggleCart={toggleCart}
            onOrderPlaced={placeOrder}
          />

          <div className="fixed bottom-0 right-0 z-50">
            {snackbars.map((snackbar, index) => (
              <Snackbar
                key={snackbar.id}
                message={snackbar.message}
                onClose={() => removeSnackbar(snackbar.id)}
                index={index}
              />
            ))}
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
