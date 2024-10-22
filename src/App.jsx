import { Component } from "react";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import CartOverlay from "./components/CartOverlay";
import Snackbar from "./components/Snackbar";

class App extends Component {
  state = {
    activeCategory: null,
    cartItems: [],
    total: 0,
    currency: "$",
    currencySymbol: "USD",
    isCartOpen: false,
    currentPage: "home",
    selectedProductId: null,
    snackbars: [],
  };

  componentDidMount() {
    this.setState({ activeCategory: "1" });
    
    // Load cart data from sessionStorage
    const savedCart = sessionStorage.getItem('cartItems');
    const savedTotal = sessionStorage.getItem('cartTotal');
    
    if (savedCart && savedTotal) {
      this.setState({
        cartItems: JSON.parse(savedCart),
        total: parseFloat(savedTotal)
      });
    }
  }

  // Add method to save cart to sessionStorage
  saveCartToSession = (cartItems, total) => {
    sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
    sessionStorage.setItem('cartTotal', total.toString());
  };


  componentDidUpdate(prevProps, prevState) {
    if (prevState.isCartOpen !== this.state.isCartOpen) {
      this.toggleScrollLock();
    }
  }

  toggleScrollLock = () => {
    const body = document.body;
    if (this.state.isCartOpen) {
      body.style.overflow = "hidden";
      body.style.paddingRight = this.getScrollbarWidth() + "px"; // Prevent layout shift
    } else {
      body.style.overflow = "";
      body.style.paddingRight = "";
    }
  };

  getScrollbarWidth = () => {
    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.overflow = "scroll";
    document.body.appendChild(outer);

    const inner = document.createElement("div");
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
  };

  handleCategoryChange = (categoryId) => {
    this.setState({ activeCategory: categoryId, currentPage: "home" });
  };

  navigateToProduct = (productId) => {
    this.setState({ currentPage: "product", selectedProductId: productId });
  };

  navigateToHome = () => {
    this.setState({ currentPage: "home", selectedProductId: null });
  };

  addToCart = (product, selectedAttributes) => {
    if (Object.keys(selectedAttributes).length === 0) {
      selectedAttributes = product.attributes.reduce((acc, attr) => {
        if (attr.items && attr.items.length > 0) {
          acc[attr.id] = attr.items[0].value;
        }
        return acc;
      }, {});
    }

    this.setState((prevState) => {
      const existingItemIndex = prevState.cartItems.findIndex((item) => {
        const isSameProduct = item.id === product.id;
        const isSameAttributes =
          JSON.stringify(item.selectedAttributes) ===
          JSON.stringify(selectedAttributes);
        return isSameProduct && isSameAttributes;
      });

      const newSnackbar = {
        id: Date.now(),
        message: `${product.name} added to cart`,
      };

      let newState;
      if (existingItemIndex > -1) {
        const updatedCartItems = [...prevState.cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        newState = {
          cartItems: updatedCartItems,
          total: prevState.total + product.prices[0].amount,
          snackbars: [...prevState.snackbars, newSnackbar],
        };
      } else {
        const newCartItem = {
          ...product,
          quantity: 1,
          selectedAttributes: selectedAttributes,
        };
        newState = {
          cartItems: [...prevState.cartItems, newCartItem],
          total: prevState.total + product.prices[0].amount,
          snackbars: [...prevState.snackbars, newSnackbar],
        };
      }

      // Save to sessionStorage
      this.saveCartToSession(newState.cartItems, newState.total);
      
      return newState;
    });
  };
  updateQuantity = (productId, selectedAttributes, newQuantity) => {
    this.setState((prevState) => {
      var priceDifference = 0;
      const updatedCartItems = prevState.cartItems
        .map((item) => {
          if (
            item.id === productId &&
            JSON.stringify(item.selectedAttributes) ===
              JSON.stringify(selectedAttributes)
          ) {
            priceDifference =
              item.prices[0].amount * (newQuantity - item.quantity);
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      const newTotal = prevState.total + priceDifference;
      
      // Save to sessionStorage
      this.saveCartToSession(updatedCartItems, newTotal);

      return {
        cartItems: updatedCartItems,
        total: newTotal,
      };
    });
  };

  toggleCart = () => {
    this.setState((prevState) => ({ isCartOpen: !prevState.isCartOpen }));
  };

  placeOrder = () => {
    // Implement GraphQL mutation to create a new order
    console.log("Placing order...");
    this.setState({ cartItems: [], total: 0, isCartOpen: false });
  };

  renderCurrentPage() {
    switch (this.state.currentPage) {
      case "home":
        return (
          <ProductList
            categoryId={this.state.activeCategory}
            addToCart={this.addToCart}
            navigateToProduct={this.navigateToProduct}
          />
        );
      case "product":
        return (
          <ProductDetails
            productId={this.state.selectedProductId}
            addToCart={this.addToCart}
            navigateToHome={this.navigateToHome}
            toggleCart={this.toggleCart}
          />
        );
      default:
        return <div>Page not found</div>;
    }
  }

  handlePageClick = () => {
    if (this.state.isCartOpen) {
      this.toggleCart();
    }
  };

  handleOrderPlaced = () => {
    // Clear cart data from sessionStorage
    sessionStorage.removeItem('cartItems');
    sessionStorage.removeItem('cartTotal');

    this.setState((prevState) => ({
      cartItems: [],
      total: 0,
      isCartOpen: false,
      snackbars: [
        ...prevState.snackbars,
        {
          id: Date.now(),
          message: "Order placed successfully!",
        },
      ],
    }));
  };

  handleSnackbarClose = () => {
    this.setState({ showSnackbar: false });
  };

  removeSnackbar = (id) => {
    this.setState((prevState) => ({
      snackbars: prevState.snackbars.filter((snackbar) => snackbar.id !== id),
    }));
  };

  render() {
    const itemCount = this.state.cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    return (
      <div
        className="App flex flex-col min-h-screen"
        onClick={this.handlePageClick}
      >
        <Header
          onCategoryChange={this.handleCategoryChange}
          cartItems={this.state.cartItems}
          total={this.state.total}
          currency={this.state.currency}
          toggleCart={this.toggleCart}
          navigateToHome={this.navigateToHome}
          activeCategory={this.state.activeCategory}
          itemCount={itemCount}
          isCartOpen={this.state.isCartOpen}
        />
        <div className="flex-grow relative">
          <div
            className={`fixed inset-0 z-40 transition-opacity duration-300 ease-in-out ${
              this.state.isCartOpen
                ? "opacity-50 bg-black pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            style={{ top: "64px" }}
          />
          <div className="relative z-30 p-4 md:p-6 lg:p-8">
            {this.renderCurrentPage()}
          </div>
        </div>
        <CartOverlay
          isOpen={this.state.isCartOpen}
          cartItems={this.state.cartItems}
          total={this.state.total}
          currency={this.state.currency}
          currencySymbol={this.state.currencySymbol}
          updateQuantity={this.updateQuantity}
          toggleCart={this.toggleCart}
          onOrderPlaced={this.handleOrderPlaced}
          itemCount={itemCount}
        />
  {this.state.snackbars.map((snackbar, index) => (
    <Snackbar
      key={snackbar.id}
      message={snackbar.message}
      onClose={() => this.removeSnackbar(snackbar.id)}
      duration={2000}
      index={index}
    />
  ))}
      </div>
    );
  }
}

export default App;
