// Header.js
import { Component } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate, useLocation } from "react-router-dom";
import MenuComponent from "./HeaderPartials/MenuComponent";
import CartButton from "./HeaderPartials/CartButton";
import { FaBars } from "react-icons/fa";

export function HeaderWrapper(props) {
  const navigate = useNavigate();
  const location = useLocation();
  return <Header {...props} navigate={navigate} location={location} />;
}

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileMenuOpen: false,
    };
  }

  toggleMobileMenu = () => {
    this.setState(prevState => ({ mobileMenuOpen: !prevState.mobileMenuOpen }));
  };

  handleCategoryClick = (categoryId) => {
    this.props.onCategoryChange(categoryId);
    this.props.navigate(`/category/${categoryId}`);
    if (this.state.mobileMenuOpen) {
      this.toggleMobileMenu();
    }
  };

  isActiveCategory = (categoryId) => {
    const { location } = this.props;
    return location.pathname === `/category/${categoryId}`;
  };

  render() {
    const { toggleCart, itemCount } = this.props;

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
              <MenuComponent
                onCategoryClick={this.handleCategoryClick}
                isActiveCategory={this.isActiveCategory}
              />
            </div>

            <div className="flex-grow flex justify-center">
              <Link to="/" className="block">
                <img src="/images/a-logo.svg" alt="Logo" className="h-8 md:h-10" />
              </Link>
            </div>

            <div className="flex items-center">
              <CartButton toggleCart={toggleCart} itemCount={itemCount} />
            </div>
          </div>

          {this.state.mobileMenuOpen && (
            <div className="md:hidden mt-4">
              <MenuComponent
                onCategoryClick={this.handleCategoryClick}
                isActiveCategory={this.isActiveCategory}
              />
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
  itemCount: PropTypes.number.isRequired,
  navigate: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
};

export default HeaderWrapper;
