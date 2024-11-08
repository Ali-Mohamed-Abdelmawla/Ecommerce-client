// src/components/ProductDetails.jsx
import { Component } from "react";
import { Query } from "@apollo/client/react/components";
import { gql } from "@apollo/client";
import PropTypes from "prop-types";

// GraphQL query to get product details
const GET_PRODUCT_DETAILS = gql`
  query GetProductDetails($id: ID!) {
    product(id: $id) {
      id
      name
      inStock
      description
      brand
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
    }
  }
`;

class ProductDetails extends Component {
  state = {
    selectedAttributes: {},
    currentImageIndex: 0,
    isModalOpen: false,
  };

  // Methods for changing images
  changeImage = (index) => {
    this.setState({ currentImageIndex: index });
  };

  nextImage = (galleryLength) => {
    this.setState((prevState) => ({
      currentImageIndex: (prevState.currentImageIndex + 1) % galleryLength,
    }));
  };

  prevImage = (galleryLength) => {
    this.setState((prevState) => ({
      currentImageIndex:
        (prevState.currentImageIndex - 1 + galleryLength) % galleryLength,
    }));
  };

  toggleModal = () => {
    this.setState((prevState) => ({ isModalOpen: !prevState.isModalOpen }));
  };

  selectAttribute = (attributeId, value) => {
    this.setState((prevState) => ({
      selectedAttributes: {
        ...prevState.selectedAttributes,
        [attributeId]: value,
      },
    }));
  };

  isAddToCartDisabled = (attributes, inStock) => {
    return (
      !inStock ||
      attributes.some((attr) => !this.state.selectedAttributes[attr.id])
    );
  };

  addToCart = (product) => {
    if (!this.isAddToCartDisabled(product.attributes, product.inStock)) {
      this.props.addToCart(product, this.state.selectedAttributes);
    }
    this.props.toggleCart();
  };

  renderAttributes = (attributes) => {
    return attributes.map((attribute) => (
      <div
        key={attribute.id}
        className="mb-3 sm:mb-4"
        data-testid={`product-attribute-${attribute.name
          .toLowerCase()
          .replace(/\s+/g, "-")}`}
      >
        <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
          {attribute.name}:
        </h3>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {attribute.items.map((item) => {
            const isSelected =
              this.state.selectedAttributes[attribute.id] === item.value;

            if (attribute.type === "swatch") {
              return (
                <button
                  key={`${attribute.id}-${item.id}`}
                  onClick={() => this.selectAttribute(attribute.id, item.value)}
                  data-testid={`product-attribute-${attribute.name.toLowerCase()}-${
                    item.value
                  }`}
                  className={`
        w-8 h-8 sm:w-10 sm:h-10
        rounded-full
        cursor-pointer
        transition-all duration-200
        relative
        ${
          isSelected
            ? "ring-2 ring-offset-2 ring-black scale-110"
            : "hover:scale-105"
        }
      `}
                  style={{
                    backgroundColor: item.value,
                    border: "2px solid #e5e7eb",
                  }}
                >
                  {isSelected && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className={`w-4 h-4 ${
                          this.isLightColor(item.value)
                            ? "text-black"
                            : "text-white"
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              );
            }

            return (
              <button
                key={`${attribute.id}-${item.id}`}
                onClick={() => this.selectAttribute(attribute.id, item.value)}
                data-testid={`product-attribute-${attribute.name.toLowerCase()}-${
                  item.value
                }`}
                className={`
      px-3 sm:px-4 py-1 sm:py-2
      border-2 rounded
      transition-all duration-200
      text-sm sm:text-base
      font-medium
      ${
        isSelected
          ? "border-black bg-black text-white scale-105"
          : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
      }
    `}
              >
                {item.display_value}
              </button>
            );
          })}
        </div>
      </div>
    ));
  };

  isLightColor = (color) => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };

  // gallery and attributes rendering
  render() {
    const { productId } = this.props;

    return (
      <Query query={GET_PRODUCT_DETAILS} variables={{ id: productId }}>
        {({ loading, error, data }) => {
          if (loading)
            return <p className="text-center py-4 sm:py-8">Loading...</p>;
          if (error)
            return (
              <p className="text-center py-4 sm:py-8 text-red-500">
                Error: {error.message}
              </p>
            );

          const product = data.product;
          const { gallery } = product;
          const hasMultipleImages = gallery.length > 1;

          return (
            <div
              className="container mx-auto px-4 py-4 sm:py-8"
              data-testid={`product-${product.id}`}
            >
              <div className="flex flex-col md:flex-row gap-4 sm:gap-8">
                {/* Product Gallery */}
                <div
                  className="product-gallery w-full md:w-1/2 flex flex-col sm:flex-row"
                  data-testid="product-gallery"
                >
                  {" "}
                  {/* Thumbnails */}
                  <div className="flex overflow-x-auto sm:overflow-x-visible sm:flex-col gap-2 mb-2 sm:mb-0 sm:mr-4">
                    {gallery.map((image, index) => (
                      <img
                        key={image.id}
                        src={image.image_url}
                        alt={product.name}
                        onClick={() => this.changeImage(index)}
                        className={`cursor-pointer rounded flex-shrink-0 
                          w-16 h-16 sm:w-20 sm:h-20 object-cover
                          ${
                            this.state.currentImageIndex === index
                              ? "border-2 border-black"
                              : ""
                          }`}
                      />
                    ))}
                  </div>
                  {/* Main image */}
                  <div className="main-image relative flex-grow">
                    {/* previous image button */}
                    {hasMultipleImages && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          this.prevImage(gallery.length);
                        }}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 
                        bg-black bg-opacity-50 p-1 sm:p-2 text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-4 h-4 sm:w-6 sm:h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                    )}
                    <img
                      src={gallery[this.state.currentImageIndex].image_url}
                      alt={product.name}
                      className="w-full rounded shadow-md"
                    />
                    {/* next image button */}
                    {hasMultipleImages && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          this.nextImage(gallery.length);
                        }}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 
                        bg-black bg-opacity-50 p-1 sm:p-2 text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-4 h-4 sm:w-6 sm:h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="product-info w-full md:w-1/2 space-y-4 sm:space-y-6">
                  <h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">
                    {product.name}
                  </h1>
                  <p className="text-lg sm:text-xl mb-2 sm:mb-4 text-gray-700">
                    {product.brand}
                  </p>

                  {/* Attributes */}
                  {this.renderAttributes(product.attributes)}

                  {/* Price */}
                  <div className="price mb-2 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold">
                      PRICE:
                    </h3>
                    <p className="text-xl sm:text-2xl font-bold text-green-500">
                      {product.prices[0].currency_symbol}
                      {product.prices[0].amount.toFixed(2)}
                    </p>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    data-testid="add-to-cart"
                    onClick={() => this.addToCart(product)}
                    disabled={this.isAddToCartDisabled(
                      product.attributes,
                      product.inStock
                    )}
                    className={`w-full py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base 
                      text-white font-semibold rounded ${
                        this.isAddToCartDisabled(
                          product.attributes,
                          product.inStock
                        )
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600"
                      } transition duration-200`}
                  >
                    {product.inStock ? "ADD TO CART" : "OUT OF STOCK"}
                  </button>

                  {/* Description */}
                  <div
                    className="description mt-4 sm:mt-8"
                    data-testid="product-description"
                  >
                    {product.description.split("\n").map((paragraph, index) => (
                      <p
                        key={index}
                        className="mb-2 sm:mb-4 text-sm sm:text-base text-gray-700 leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

ProductDetails.propTypes = {
  productId: PropTypes.string.isRequired,
  addToCart: PropTypes.func.isRequired,
  toggleCart: PropTypes.func.isRequired,
};

export default ProductDetails;
