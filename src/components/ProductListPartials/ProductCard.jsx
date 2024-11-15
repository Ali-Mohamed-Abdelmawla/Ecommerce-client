// components/ProductCard.jsx
import { Component } from "react";
import PropTypes from "prop-types";
import { PiShoppingCartLight } from "react-icons/pi";

class ProductCard extends Component {
  handleAddToCart = (e) => {
    e.stopPropagation();
    const { product, addToCart } = this.props;
    addToCart(product, {},false);
  };

  render() {
    const { product, navigateToProduct } = this.props;
    const productTestId = `product-${product.name.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div
        className={`relative group transition-all duration-300 ease-in-out 
          transform hover:-translate-y-1 sm:hover:-translate-y-2 
          ${!product.inStock ? "opacity-50" : ""} 
          border border-gray-200 rounded-lg overflow-hidden 
          shadow-md hover:shadow-lg cursor-pointer`}
        data-testid={productTestId}
        onClick={() => navigateToProduct(product.id)}
      >
        {/* Product Image Container */}
        <div className="relative w-full pt-[100%]">
          <img
            src={product.gallery[0].image_url}
            alt={product.name}
            className="absolute top-0 left-0 w-full h-full object-cover 
              transition-transform duration-200 ease-in-out group-hover:scale-105"
          />
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg sm:text-2xl font-bold text-white 
                bg-black bg-opacity-50 px-3 sm:px-4 py-1 sm:py-2">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3 sm:p-4">
          <h2 className="text-base sm:text-lg font-semibold line-clamp-2 mb-1">
            {product.name}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            {product.prices[0].currency_symbol}
            {product.prices[0].amount.toFixed(2)}
          </p>
        </div>

        {/* Add to Cart Button */}
        {product.inStock && (
          <button
            className="absolute hover:bg-green-600 transition-all duration-300 
              right-2 sm:right-3 bottom-12 sm:top-[66%] 
              h-10 w-10 sm:h-12 sm:w-12 
              flex items-center justify-center 
              bg-green-500 text-white rounded-full 
              opacity-100 sm:opacity-0 sm:group-hover:opacity-100
              shadow-lg"
            onClick={this.handleAddToCart}
            aria-label="Add to cart"
          >
            <PiShoppingCartLight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>
    );
  }
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    inStock: PropTypes.bool.isRequired,
    gallery: PropTypes.arrayOf(
      PropTypes.shape({
        image_url: PropTypes.string.isRequired
      })
    ).isRequired,
    prices: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        currency_symbol: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired,
  addToCart: PropTypes.func.isRequired,
  navigateToProduct: PropTypes.func.isRequired
};

export default ProductCard;