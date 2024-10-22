import { Component } from "react";
import PropTypes from "prop-types";
import { gql } from "@apollo/client";
import { Mutation } from "@apollo/client/react/components";

const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($input: OrderInput!) {
    createOrder(input: $input) {
      id
      status
      created_at
      total_amount
      currency_label
      currency_symbol
      product_list
    }
  }
`;

class CartOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRendered: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.isOpen !== prevProps.isOpen) {
      if (this.props.isOpen) {
        this.setState({ isRendered: true });
      } else {
        setTimeout(() => this.setState({ isRendered: false }), 300);
      }
    }
  }

  handleCartClick = (e) => {
    e.stopPropagation();
  };

  renderAttributes = (attributes, selectedAttributes) => {
    return attributes.map((attribute) => {
      const attributeId = attribute.name.toLowerCase().replace(/\s+/g, '-');
      return (
        <div 
          key={attribute.id} 
          className="mb-2 sm:mb-3"
          data-testid={`cart-item-attribute-${attributeId}`}
        >
          <h4 className="text-sm font-semibold mb-1">
            {attribute.name}:
          </h4>
          <div className="flex flex-wrap gap-1">
            {attribute.items.map((item) => {
              const isSelected = selectedAttributes[attribute.id] === item.value;
              const optionId = item.display_value.toLowerCase().replace(/\s+/g, '-');
              const baseTestId = `cart-item-attribute-${attributeId}-${optionId}`;
              
              if (attribute.type === "swatch") {
                return (
                  <div
                    key={`${attribute.id}-${item.id}`}
                    data-testid={isSelected ? `${baseTestId}-selected` : baseTestId}
                    className={`
                      w-6 h-6 sm:w-8 sm:h-8
                      rounded-full
                      relative
                      ${isSelected ? 'ring-2 ring-offset-1 ring-black' : ''}
                    `}
                    style={{
                      backgroundColor: item.value,
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    {isSelected && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <svg className={`w-3 h-3 ${this.isLightColor(item.value) ? 'text-black' : 'text-white'}`} 
                          viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" 
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                            clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </div>
                );
              }
    
              return (
                <div
                  key={`${attribute.id}-${item.id}`}
                  data-testid={isSelected ? `${baseTestId}-selected` : baseTestId}
                  className={`
                    px-2 sm:px-3 py-1
                    border rounded
                    text-xs sm:text-sm
                    ${
                      isSelected
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 bg-white text-gray-700'
                    }
                  `}
                >
                  {item.display_value}
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };
  
  isLightColor = (color) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };

  render() {
    const {
      isOpen,
      cartItems,
      total,
      currency,
      currencySymbol,
      updateQuantity,
      itemCount,
      onOrderPlaced,
    } = this.props;
    const { isRendered } = this.state;

    if (!isRendered) return null;

    return (
      <Mutation
        mutation={CREATE_ORDER_MUTATION}
        onCompleted={() => {
          onOrderPlaced();
        }}
      >
        {(createOrder, { loading, error }) => (
          <div
            className={`fixed right-0 sm:right-4 top-14 z-50 w-full sm:w-96 max-h-[calc(100vh-5rem)] 
              overflow-y-auto bg-white p-3 sm:p-4 rounded-lg shadow-xl transform transition-all 
              duration-300 ease-in-out ${
                isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            onClick={this.handleCartClick}
          >
            <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
              My Cart, {itemCount === 1 ? "1 Item" : `${itemCount} Items`}
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${JSON.stringify(item.selectedAttributes)}`}
                  className="border-b pb-3 sm:pb-4 flex gap-2 sm:gap-4 items-start"
                >
                  {/* Product Image */}
                  <img
                    src={item.gallery[0].image_url}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
                  />
                  
                  {/* Product Details */}
                  <div className="flex-1">
                    <p className="font-bold text-sm sm:text-base">{item.name}</p>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {currency}
                      {item.prices[0].amount.toFixed(2)}
                    </p>
                    
                    {/* Attributes */}
                    {this.renderAttributes(item.attributes, item.selectedAttributes)}
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center mt-2">
                      <button
                        data-testid="cart-item-amount-decrease"
                        onClick={() => updateQuantity(
                          item.id,
                          item.selectedAttributes,
                          item.quantity - 1
                        )}
                        className="px-2 py-1 bg-gray-200 rounded transition hover:bg-gray-300 text-sm sm:text-base"
                      >
                        -
                      </button>
                      <span
                        data-testid="cart-item-amount"
                        className="mx-2 sm:mx-3 font-semibold text-sm sm:text-base"
                      >
                        {item.quantity}
                      </span>
                      <button
                        data-testid="cart-item-amount-increase"
                        onClick={() => updateQuantity(
                          item.id,
                          item.selectedAttributes,
                          item.quantity + 1
                        )}
                        className="px-2 py-1 bg-gray-200 rounded transition hover:bg-gray-300 text-sm sm:text-base"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Total */}
            <div className="mt-3 sm:mt-4">
              <div className="flex justify-between font-bold text-base sm:text-lg">
                <span>Total:</span>
                <span data-testid="cart-total">
                  {currency}
                  {total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-3 sm:mt-4 text-red-500 text-sm">
                {error.message}
              </div>
            )}

            {/* Place Order Button */}
            <div className="mt-3 sm:mt-4">
              <button
                onClick={() => {
                  const orderInput = {
                    products: cartItems.map((item) => ({
                      id: item.id,
                      quantity: item.quantity,
                      price: item.prices[0].amount,
                      selectedAttributes: Object.entries(item.selectedAttributes)
                        .map(([id, value]) => ({
                          id,
                          selectedItemId: value,
                        })),
                    })),
                    currency_label: currencySymbol,
                    currency_symbol: currency,
                  };
                  createOrder({ variables: { input: orderInput } });
                }}
                disabled={cartItems.length === 0 || loading}
                className={`px-3 sm:px-4 py-2 rounded text-white font-semibold w-full text-sm sm:text-base ${
                  cartItems.length === 0 || loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                } transition duration-200`}
              >
                {loading ? "PLACING ORDER..." : "PLACE ORDER"}
              </button>
            </div>
          </div>
        )}
      </Mutation>
    );
  }
}

CartOverlay.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  cartItems: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  currencySymbol: PropTypes.string.isRequired,
  updateQuantity: PropTypes.func.isRequired,
  toggleCart: PropTypes.func.isRequired,
  onOrderPlaced: PropTypes.func.isRequired,
  itemCount: PropTypes.number.isRequired,
};

export default CartOverlay;