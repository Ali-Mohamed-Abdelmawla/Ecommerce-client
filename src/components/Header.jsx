import { Component } from "react";
import { Query } from "@apollo/client/react/components";
import { gql } from "@apollo/client";
import PropTypes from "prop-types";
import { PiShoppingCartLight } from "react-icons/pi";
import { FaBars } from "react-icons/fa";

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      typename
    }
  }
`;

class Header extends Component {
  state = {
    mobileMenuOpen: false,
  };

  toggleMobileMenu = () => {
    this.setState(prevState => ({ mobileMenuOpen: !prevState.mobileMenuOpen }));
  };

  render() {
    const {
      onCategoryChange,
      toggleCart,
      navigateToHome,
      activeCategory,
      itemCount,
    } = this.props;

    return (
      <header className="bg-white shadow-md relative z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="md:hidden">
              <button onClick={this.toggleMobileMenu} className="p-2">
                <FaBars className="w-6 h-6" />
              </button>
            </div>
            <div className="hidden md:block">
              <Query query={GET_CATEGORIES}>
                {({ loading, error, data }) => {
                  if (loading) return <p>Loading...</p>;
                  if (error) return <p>Error :(</p>;
                  return (
                    <nav className="flex space-x-1">
                      {data.categories.map((category) => (
                        <button
                          key={category.id}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ease-in-out
                            ${
                              activeCategory === category.id
                                ? "bg-green-500 text-white shadow-md"
                                : "text-gray-700 hover:bg-green-100"
                            }`}
                          onClick={() => {
                            onCategoryChange(category.id);
                            navigateToHome();
                          }}
                          data-testid={
                            activeCategory === category.id
                              ? "active-category-link"
                              : "category-link"
                          }
                        >
                          {category.name.toUpperCase()}
                        </button>
                      ))}
                    </nav>
                  );
                }}
              </Query>
            </div>
            <div className="flex-grow flex justify-center">
              <img src="/images/a-logo.svg" alt="Logo" className="h-8 md:h-10" />
            </div>
            <div className="flex items-center">
              <button
                data-testid="cart-btn"
                onClick={toggleCart}
                className="relative p-2 transition-transform duration-300 ease-in-out hover:scale-110"
              >
                <PiShoppingCartLight className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition-all duration-300 ease-in-out animate-pulse">
                    {itemCount >= 2 ? "x" : `${itemCount}`}
                  </span>
                )}
              </button>
            </div>
          </div>
          {this.state.mobileMenuOpen && (
            <div className="md:hidden mt-4">
              <Query query={GET_CATEGORIES}>
                {({ loading, error, data }) => {
                  if (loading) return <p>Loading...</p>;
                  if (error) return <p>Error :(</p>;
                  return (
                    <nav className="flex flex-col space-y-2">
                      {data.categories.map((category) => (
                        <button
                          key={category.id}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ease-in-out
                            ${
                              activeCategory === category.id
                                ? "bg-green-500 text-white shadow-md"
                                : "text-gray-700 hover:bg-green-100"
                            }`}
                          onClick={() => {
                            onCategoryChange(category.id);
                            navigateToHome();
                            this.toggleMobileMenu();
                          }}
                          data-testid={
                            activeCategory === category.id
                              ? "active-category-link"
                              : "category-link"
                          }
                        >
                          {category.name.toUpperCase()}
                        </button>
                      ))}
                    </nav>
                  );
                }}
              </Query>
            </div>
          )}
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  onCategoryChange: PropTypes.func.isRequired,
  toggleCart: PropTypes.func.isRequired,
  navigateToHome: PropTypes.func.isRequired,
  activeCategory: PropTypes.string,
  itemCount: PropTypes.number.isRequired,
  isCartOpen: PropTypes.bool.isRequired,
};

export default Header;