// components/ProductGallery.jsx
import { Component } from "react";
import PropTypes from "prop-types";

class ProductGallery extends Component {
  render() {
    const { 
      gallery, 
      currentImageIndex, 
      onImageChange, 
      onNextImage, 
      onPrevImage, 
      productName 
    } = this.props;
    
    const hasMultipleImages = gallery.length > 1;

    return (
      <div className="product-gallery w-full md:w-1/2 flex flex-col sm:flex-row" data-testid="product-gallery">
        {/* Thumbnails */}
        <div className="flex overflow-x-auto sm:overflow-x-visible sm:flex-col gap-2 mb-2 sm:mb-0 sm:mr-4">
          {gallery.map((image, index) => (
            <img
              key={image.id}
              src={image.image_url}
              alt={productName}
              onClick={() => onImageChange(index)}
              className={`cursor-pointer rounded flex-shrink-0 
                w-16 h-16 sm:w-20 sm:h-20 object-cover
                ${currentImageIndex === index ? "border-2 border-black" : ""}`}
            />
          ))}
        </div>

        {/* Main image */}
        <div className="main-image relative flex-grow">
          {hasMultipleImages && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrevImage(gallery.length);
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
            src={gallery[currentImageIndex].image_url}
            alt={productName}
            className="w-full rounded shadow-md"
          />
          
          {hasMultipleImages && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNextImage(gallery.length);
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
    );
  }
}

ProductGallery.propTypes = {
  gallery: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      image_url: PropTypes.string.isRequired
    })
  ).isRequired,
  currentImageIndex: PropTypes.number.isRequired,
  onImageChange: PropTypes.func.isRequired,
  onNextImage: PropTypes.func.isRequired,
  onPrevImage: PropTypes.func.isRequired,
  productName: PropTypes.string.isRequired
};

export default ProductGallery;