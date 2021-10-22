exports.id = 8177;
exports.ids = [8177];
exports.modules = {

/***/ 8177:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MM": function() { return /* binding */ databaseErrorCodes; },
/* harmony export */   "b$": function() { return /* binding */ duplicateError; },
/* harmony export */   "Eh": function() { return /* binding */ createServerError; }
/* harmony export */ });
/* unused harmony exports databaseErrorMessages, createValidationError */
const databaseErrorCodes = {
  DUPLICATE_KEY: 11000
};
const duplicateError = new Error();
duplicateError.code = databaseErrorCodes.DUPLICATE_KEY;
const databaseErrorMessages = {
  [databaseErrorCodes.DUPLICATE_KEY]: {
    orgUrl: "Ce nom d'organisation n'est pas disponible",
    eventUrl: "Ce nom d'événement n'est pas disponible"
  }
};
/**
 * @param {Error} error
 * @returns {
 *   "email": "Field is required",
 * }
 */

const createValidationError = error => {
  if (error.errors) {
    const errors = {};
    Object.keys(error.errors).map(key => {
      errors[key] = error.errors[key].message;
    });
    return errors;
  }

  return {
    [error.errors.name.path]: error.errors.name.message
  };
};
/**
 * Make server (api, database) errors friendly to the client
 * @param {Error} error
 * @returns {
 *   "message": error.message
 * }
 */

const createServerError = error => {
  if (error.name === "ValidationError") return createValidationError(error);

  if (error.code && databaseErrorMessages[error.code]) {
    return {
      message: databaseErrorMessages[error.code][Object.keys(error.keyPattern)[0]] + "."
    };
  }

  return {
    message: error.message + "."
  };
};

/***/ })

};
;