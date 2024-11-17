// src/routerWrappers/ProductListWrapper.js
import { Component } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductList from '../components/ProductList';
import PropTypes from 'prop-types';
import { Query } from '@apollo/client/react/components';
import { Navigate } from 'react-router-dom';
import { GET_CATEGORIES } from '../graphql/queries/GetCategories';

export function ProductListWrapper({ addToCart, toggleCart }) {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  return (
    <Query query={GET_CATEGORIES}>
      {({ loading, error, data }) => {
        if (loading || error) return null;

        const category = data.categories.find(
          cat => cat.name.toLowerCase() === categoryName.toLowerCase()
        );

        if (!category) return <Navigate to="/" />;

        return (
          <ProductListClass 
            categoryId={category.id}
            addToCart={addToCart}
            toggleCart={toggleCart}
            navigate={navigate}
          />
        );
      }}
    </Query>
  );
}

class ProductListClass extends Component {
  navigateToProduct = (productId) => {
    this.props.navigate(`/product/${productId}`);
  };

  render() {
    return (
      <ProductList
        categoryId={this.props.categoryId}
        addToCart={this.props.addToCart}
        navigateToProduct={this.navigateToProduct}
      />
    );
  }
}

ProductListWrapper.propTypes = {
  addToCart: PropTypes.func.isRequired,
  toggleCart: PropTypes.func.isRequired,
};

ProductListClass.propTypes = {
  categoryId: PropTypes.string.isRequired,
  addToCart: PropTypes.func.isRequired,
  navigateToHome: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};
