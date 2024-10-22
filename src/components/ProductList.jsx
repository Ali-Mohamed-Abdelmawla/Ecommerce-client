import { Component } from "react";
import { Query } from "@apollo/client/react/components";
import { gql } from "@apollo/client";
import { PiShoppingCartLight } from "react-icons/pi";
import PropTypes from "prop-types";

const GET_PRODUCTS = gql`
  query GetProducts($categoryId: ID!) {
    category(id: $categoryId) {
      id
      name
      typename
      products {
        id
        name
        inStock
        description
        brand
        attributes {
          id
          name
          type
          items {
            id
            value
            display_value
          }
        }
        prices {
          id
          amount
          currency_label
          currency_symbol
        }
        gallery {
          id
          image_url
        }
      }
    }
  }
`;

class ProductList extends Component {
  render() {
    const { categoryId, addToCart, navigateToProduct } = this.props;
    return (
      <Query query={GET_PRODUCTS} variables={{ categoryId }}>
        {({ loading, error, data }) => {
          if (loading) return <p className="text-center py-4 sm:py-8">Loading...</p>;
          if (error)
            return <p className="text-center py-4 sm:py-8 text-red-500">Error :(</p>;
          return (
            <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
              <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8">
                {data.category.name}
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {data.category.products.map((product) => (
                  <div
                    key={product.id}
                    className={`relative group transition-all duration-300 ease-in-out 
                      transform hover:-translate-y-1 sm:hover:-translate-y-2 
                      ${!product.inStock ? "opacity-50" : ""} 
                      border border-gray-200 rounded-lg overflow-hidden 
                      shadow-md hover:shadow-lg cursor-pointer`}
                    data-testid={`product-${product.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
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
                      <h2 className="text-base sm:text-lg font-semibold 
                        line-clamp-2 mb-1">
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
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product, {});
                        }}
                        aria-label="Add to cart"
                      >
                        <PiShoppingCartLight className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

ProductList.propTypes = {
  categoryId: PropTypes.string,
  addToCart: PropTypes.func.isRequired,
  navigateToProduct: PropTypes.func.isRequired,
};

export default ProductList;