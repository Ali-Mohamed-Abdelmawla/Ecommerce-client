// components/ProductDetails.jsx
import { Component } from "react";
import { Query } from "@apollo/client/react/components";
import PropTypes from "prop-types";
import { GET_PRODUCT_DETAILS } from "../graphql/queries/GetProductDetails";
import ProductGallery from "./ProductDetailsPartials/ProductGallery";
import ProductAttributes from "./ProductDetailsPartials/ProductAttributes";

class ProductDetails extends Component {
  state = {
    selectedAttributes: {},
    currentImageIndex: 0,
    isModalOpen: false,
  };

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
      currentImageIndex: (prevState.currentImageIndex - 1 + galleryLength) % galleryLength,
    }));
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
    return !inStock || attributes.some((attr) => !this.state.selectedAttributes[attr.id]);
  };

  addToCart = (product) => {
    if (!this.isAddToCartDisabled(product.attributes, product.inStock)) {
      this.props.addToCart(product, this.state.selectedAttributes,true);
      this.props.toggleCart();
    }
  };

  render() {
    const { productId } = this.props;

    return (
      <Query query={GET_PRODUCT_DETAILS} variables={{ id: productId }}>
        {({ loading, error, data }) => {
          if (loading) return <p className="text-center py-4 sm:py-8">Loading...</p>;
          if (error) return <p className="text-center py-4 sm:py-8 text-red-500">Error: {error.message}</p>;

          const product = data.product;

          return (
            <div className="container mx-auto px-4 py-4 sm:py-8" data-testid={`product-${product.id}`}>
              <div className="flex flex-col md:flex-row gap-4 sm:gap-8">
                <ProductGallery
                  gallery={product.gallery}
                  currentImageIndex={this.state.currentImageIndex}
                  onImageChange={this.changeImage}
                  onNextImage={this.nextImage}
                  onPrevImage={this.prevImage}
                  productName={product.name}
                />

                <div className="product-info w-full md:w-1/2 space-y-4 sm:space-y-6">
                  <h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">{product.name}</h1>
                  <p className="text-lg sm:text-xl mb-2 sm:mb-4 text-gray-700">{product.brand}</p>

                  <ProductAttributes
                    attributes={product.attributes}
                    selectedAttributes={this.state.selectedAttributes}
                    onSelectAttribute={this.selectAttribute}
                  />

                  <div className="price mb-2 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold">PRICE:</h3>
                    <p className="text-xl sm:text-2xl font-bold text-green-500">
                      {product.prices[0].currency_symbol}
                      {product.prices[0].amount.toFixed(2)}
                    </p>
                  </div>

                  <button
                    data-testid="add-to-cart"
                    onClick={() => this.addToCart(product)}
                    disabled={this.isAddToCartDisabled(product.attributes, product.inStock)}
                    className={`w-full py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base 
                      text-white font-semibold rounded
                      ${this.isAddToCartDisabled(product.attributes, product.inStock)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600"
                      } transition duration-200`}
                  >
                    {product.inStock ? "ADD TO CART" : "OUT OF STOCK"}
                  </button>

                  <div className="description mt-4 sm:mt-8" data-testid="product-description">
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