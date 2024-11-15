//  src/components/Cartpartials/CartAttribute.jsx
import { Component } from "react";
import PropTypes from "prop-types";

class CartAttribute extends Component {
  isLightColor = (color) => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };

  renderSwatchAttribute = (item, isSelected, attribute) => {
    return (
      <div
        key={`${attribute.id}-${item.id}`}
        data-testid={`cart-item-attribute-${attribute.name.toLowerCase()}-${
          item.value
        }${isSelected ? "-selected" : ""}`}
        className={`
          w-6 h-6 sm:w-8 sm:h-8
          rounded-full
          relative
          ${isSelected ? "ring-2 ring-offset-1 ring-black" : ""}
        `}
        style={{
          backgroundColor: item.value,
          border: "1px solid #e5e7eb",
        }}
      >
        {isSelected && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg
              className={`w-3 h-3 ${
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
      </div>
    );
  };

  renderTextAttribute = (item, isSelected, attribute) => {
    return (
      <div
        key={`${attribute.id}-${item.id}`}
        data-testid={`cart-item-attribute-${attribute.name.toLowerCase()}-${
          item.value
        }${isSelected ? "-selected" : ""}`}
        className={`
          px-2 sm:px-3 py-1
          border rounded
          text-xs sm:text-sm
          ${
            isSelected
              ? "border-black bg-black text-white"
              : "border-gray-300 bg-white text-gray-700"
          }
        `}
      >
        {item.display_value}
      </div>
    );
  };

  render() {
    const { attribute, selectedValue } = this.props;
    const attributeId = attribute.name.toLowerCase().replace(/\s+/g, "-");

    return (
      <div
        className="mb-2 sm:mb-3"
        data-testid={`cart-item-attribute-${attributeId}`}
      >
        <h4 className="text-sm font-semibold mb-1">{attribute.name}:</h4>
        <div className="flex flex-wrap gap-1">
          {attribute.items.map((item) => {
            const isSelected = selectedValue === item.value;
            return attribute.type === "swatch"
              ? this.renderSwatchAttribute(item, isSelected, attribute)
              : this.renderTextAttribute(item, isSelected, attribute);
          })}
        </div>
      </div>
    );
  }
}

CartAttribute.propTypes = {
  attribute: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        display_value: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default CartAttribute;