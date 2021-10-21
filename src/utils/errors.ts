export interface ServerError {
  status: number;
  data: {
    message: string;
  };
}

export const databaseErrorCodes = {
  DUPLICATE_KEY: 11000
};

export const duplicateError: Error & { code?: number } = new Error();
duplicateError.code = databaseErrorCodes.DUPLICATE_KEY;

export const databaseErrorMessages: { [key: number]: any } = {
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
export const createValidationError = (error: any) => {
  if (error.errors) {
    const errors: { [key: string]: string } = {};
    Object.keys(error.errors).map((key) => {
      errors[key] = error.errors[key].message;
    });
    return errors;
  }
  return { [error.errors.name.path]: error.errors.name.message };
};

/**
 * Make server (api, database) errors friendly to the client
 * @param {Error} error
 * @returns {
 *   "message": error.message
 * }
 */
export const createServerError = (error: any) => {
  if (error.name === "ValidationError") return createValidationError(error);

  if (error.code && databaseErrorMessages[error.code]) {
    return {
      message:
        databaseErrorMessages[error.code][Object.keys(error.keyPattern)[0]] +
        "."
    };
  }

  return { message: error.message + "." };
};
