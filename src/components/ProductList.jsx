// components/ProductList.jsx
import { Component } from "react";
import { Query } from "@apollo/client/react/components";
import PropTypes from "prop-types";
import { GET_PRODUCTS } from "../graphql/queries/GetProducts";
import ProductCard from "./ProductListPartials/ProductCard";

class ProductList extends Component {
  render() {
    const { categoryId, addToCart, navigateToProduct, toggleCart } = this.props;
    return (
      <Query query={GET_PRODUCTS} variables={{ categoryId }}>
        {({ loading, error, data }) => {
          if (loading) return <p className="text-center py-4 sm:py-8">Loading...</p>;
          if (error) return <p className="text-center py-4 sm:py-8 text-red-500">Error :(</p>;
          return (
            <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
              <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8">
                {data.category.name}
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {data.category.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                    navigateToProduct={navigateToProduct}
                    toggleCart={toggleCart}
                  />
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
  categoryId: PropTypes.string.isRequired,
  addToCart: PropTypes.func.isRequired,
  navigateToProduct: PropTypes.func.isRequired,
  toggleCart: PropTypes.func.isRequired
};

export default ProductList;