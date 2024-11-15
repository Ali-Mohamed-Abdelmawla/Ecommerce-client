import { Component } from "react";
import PropTypes from "prop-types";

const SNACKBAR_HEIGHT = 40;
const SPACING = 8;

class Snackbar extends Component {
  componentDidMount() {
    this.timer = setTimeout(() => {
      this.props.onClose();
    }, this.props.duration);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const { message, index } = this.props;

    return (
      <div
        className="fixed right-4 bg-primary text-white px-4 py-2 rounded shadow-lg"
        style={{
          height: `${SNACKBAR_HEIGHT}px`,
          bottom: `${16 + index * (SNACKBAR_HEIGHT + SPACING)}px`,
          transition: "all 0.3s ease-out",
          animation: "slideIn 0.3s ease-out forwards",
        }}
      >
        {message}
      </div>
    );
  }
}

Snackbar.propTypes = {
  message: PropTypes.string.isRequired,
  duration: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

Snackbar.defaultProps = {
  duration: 3000,
};

export default Snackbar;
