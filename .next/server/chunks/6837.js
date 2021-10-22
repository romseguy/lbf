exports.id = 6837;
exports.ids = [6837];
exports.modules = {

/***/ 6837:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var utils_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8177);
/* harmony import */ var utils_isServer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7870);



async function request(endpoint, params, method = "GET") {
  console.log(`${method} /${endpoint}`);
  if (params) console.log(params);

  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json"
      }
    };

    if (params) {
      if (method === "GET") {
        endpoint += "?" + objectToQueryString(params);
      } else {
        options.body = JSON.stringify(params);
      }
    }

    console.log(`Fetching /${endpoint}`);
    const response = await fetch(`${"https://aucourant.de/api"}/${endpoint}`, options);
    console.log(`Fulfilled /${endpoint}`);

    if (response.status === 200) {
      const data = await response.json(); // if (!process.env.NEXT_PUBLIC_IS_TEST)

      if (!(0,utils_isServer__WEBPACK_IMPORTED_MODULE_1__/* .isServer */ .s)()
      /*  && process.env.NEXT_PUBLIC_VERCEL_ENV !== "production" */
      ) console.log(`Result /${endpoint}`, data);
      return {
        data
      };
    }

    const error = await response.json();
    console.log(`API ERROR /${endpoint}`, error);
    return {
      error,
      status: response.status
    };
  } catch (error) {
    console.error(`API ERROR /${endpoint}`, error);
    return {
      error: {
        message: error.message // "Une erreur inconnue est survenue, merci de contacter le développeur"

      }
    };
  }
}

function objectToQueryString(obj) {
  return Object.keys(obj).map(key => key + "=" + obj[key]).join("&");
}

function get(endpoint, params) {
  return request(endpoint, params);
}

function post(endpoint, params) {
  return request(endpoint, params, "POST");
}

function update(endpoint, params) {
  return request(endpoint, params, "PUT");
}

function remove(endpoint, params) {
  return request(endpoint, params, "DELETE");
}

/* harmony default export */ __webpack_exports__["Z"] = ({
  get,
  post,
  update,
  remove,
  databaseErrorCodes: utils_errors__WEBPACK_IMPORTED_MODULE_0__/* .databaseErrorCodes */ .MM
});

/***/ }),

/***/ 7870:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "s": function() { return /* binding */ isServer; }
/* harmony export */ });
const isServer = () => true;

/***/ })

};
;