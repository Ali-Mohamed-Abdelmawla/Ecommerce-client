// src/routerWrappers/ProductListWrapper.js
import { Component } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductList from '../components/ProductList';
import PropTypes from 'prop-types';

export function ProductListWrapper({ addToCart, toggleCart }) {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  
  return (
    <ProductListClass 
      categoryId={categoryId}
      addToCart={addToCart}
      toggleCart={toggleCart}
      navigate={navigate}
    />
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
