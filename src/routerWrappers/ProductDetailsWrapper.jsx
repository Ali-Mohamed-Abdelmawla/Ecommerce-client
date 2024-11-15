// src/routerWrappers/ProductDetailsWrapper.js
import { Component } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductDetails from '../components/ProductDetails';
import PropTypes from 'prop-types';

export function ProductDetailsWrapper({ addToCart, toggleCart }) {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  return (
    <ProductDetailsClass 
      productId={productId}
      addToCart={addToCart}
      toggleCart={toggleCart}
      navigate={navigate}
    />
  );
}
class ProductDetailsClass extends Component {
  navigateToHome = () => {
    this.props.navigate(-1);
  };

  render() {
    return (
      <ProductDetails
        productId={this.props.productId}
        addToCart={this.props.addToCart}
        navigateToHome={this.navigateToHome}
      />
    );
  }
}

ProductDetailsWrapper.propTypes = {
  addToCart: PropTypes.func.isRequired,
  toggleCart: PropTypes.func.isRequired,
};

ProductDetailsClass.propTypes = {
  productId: PropTypes.string.isRequired,
  addToCart: PropTypes.func.isRequired,
  navigateToHome: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};
