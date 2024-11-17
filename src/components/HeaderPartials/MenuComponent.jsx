// MenuComponent.js
import { Component } from "react";
import { Query } from "@apollo/client/react/components";
import PropTypes from "prop-types";
import { GET_CATEGORIES } from "../../graphql/queries/GetCategories";

class MenuComponent extends Component {
  render() {
    const { onCategoryClick, isActiveCategory } = this.props;
    return (
      <Query query={GET_CATEGORIES}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          return (
            <nav className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-1">
              {data.categories.map((category) => {
                const categoryPath = category.name.toLowerCase();
                const isActive = isActiveCategory(categoryPath);
                return (
                  <a
                    key={category.id}
                    href={`/${categoryPath}`}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ease-in-out
                      ${
                        isActive
                          ? "bg-green-500 text-white shadow-md hover:bg-green-600"
                          : "text-gray-700 hover:bg-green-100"
                      }`}
                    onClick={(e) => {
                      e.preventDefault();
                      onCategoryClick(category.id, category.name);
                    }}
                    {...(isActive
                      ? { "data-testid": "active-category-link" }
                      : {})}
                  >
                    {category.name.toUpperCase()}
                  </a>
                );
              })}
            </nav>
          );
        }}
      </Query>
    );
  }
}
MenuComponent.propTypes = {
  onCategoryClick: PropTypes.func.isRequired,
  isActiveCategory: PropTypes.func.isRequired,
};

export default MenuComponent;
