// src/context/SnackbarManager.js
class SnackbarManager {
    createSnackbar(message) {
      return {
        id: Date.now(),
        message,
      };
    }
  
    removeSnackbar(currentSnackbars, id) {
      return currentSnackbars.filter(snackbar => snackbar.id !== id);
    }
  }
  
  export default SnackbarManager;