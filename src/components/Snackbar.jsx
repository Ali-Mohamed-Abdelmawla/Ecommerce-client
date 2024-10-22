// Snackbar.jsx
import { Component } from 'react';
import PropTypes from 'prop-types';

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
    return (
      <div 
        style={{
          bottom: `${this.props.index * 3}rem`, // Adjust this value to control spacing
          transition: 'all 0.3s ease-in-out'
        }}
        className="mb-4 fixed bottom-2 right-1 transform bg-primary text-white px-4 py-2 rounded shadow-lg animate-fade-in-up z-30"
      >
        {this.props.message}
      </div>
    );
  }
}

Snackbar.propTypes = {
  message: PropTypes.string.isRequired,
  duration: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired // Add this prop
};

Snackbar.defaultProps = {
  duration: 3000
};

export default Snackbar;