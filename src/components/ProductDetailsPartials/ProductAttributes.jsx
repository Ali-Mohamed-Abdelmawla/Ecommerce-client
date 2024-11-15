// components/ProductAttributes.jsx
import { Component } from "react";
import PropTypes from "prop-types";

class ProductAttributes extends Component {
  isLightColor = (color) => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };

  render() {
    const { attributes, selectedAttributes, onSelectAttribute } = this.props;

    return attributes.map((attribute) => (
      <div
        key={attribute.id}
        className="mb-3 sm:mb-4"
        data-testid={`product-attribute-${attribute.name.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
          {attribute.name}:
        </h3>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {attribute.items.map((item) => {
            const isSelected = selectedAttributes[attribute.id] === item.value;

            if (attribute.type === "swatch") {
              return (
                <button
                  key={`${attribute.id}-${item.id}`}
                  onClick={() => onSelectAttribute(attribute.id, item.value)}
                  data-testid={`product-attribute-${attribute.name.toLowerCase()}-${item.value}`}
                  className={`
                    w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer
                    transition-all duration-200 relative
                    ${isSelected ? "ring-2 ring-offset-2 ring-black scale-110" : "hover:scale-105"}
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
                          this.isLightColor(item.value) ? "text-black" : "text-white"
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
                onClick={() => onSelectAttribute(attribute.id, item.value)}
                data-testid={`product-attribute-${attribute.name.toLowerCase()}-${item.value}`}
                className={`
                  px-3 sm:px-4 py-1 sm:py-2 border-2 rounded
                  transition-all duration-200 text-sm sm:text-base font-medium
                  ${isSelected
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
  }
}

ProductAttributes.propTypes = {
  attributes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
          display_value: PropTypes.string.isRequired
        })
      ).isRequired
    })
  ).isRequired,
  selectedAttributes: PropTypes.object.isRequired,
  onSelectAttribute: PropTypes.func.isRequired
};

export default ProductAttributes;
