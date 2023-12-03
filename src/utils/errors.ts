export type FormFieldError = Error & { [key: string]: string };

export interface ServerError {
  status: number;
  data: {
    message: string;
  };
}

export const databaseErrorCodes = {
  DUPLICATE_KEY: 11000
};

type DuplicateError = Error & { code?: number; field?: string };

export const duplicateError = ({
  code = databaseErrorCodes.DUPLICATE_KEY,
  field
}: {
  code?: number;
  field?: string;
} = {}): DuplicateError => {
  const error: DuplicateError = new Error();
  if (code) error.code = code;
  if (field) error.field = field;
  return error;
};

export const databaseErrorMessages: { [key: number]: any } = {
  [databaseErrorCodes.DUPLICATE_KEY]: {
    email: "Cette adresse e-mail n'est pas disponible",
    orgUrl: "Ce nom d'organisation n'est pas disponible",
    eventUrl: "Ce nom d'événement n'est pas disponible",
    userName: "Ce nom d'utilisateur n'est pas disponible"
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
  console.log(
    "🚀 ~ file: errors.ts:63 ~ createServerError ~ error:",
    JSON.stringify(error)
  );
  if (error.name === "ValidationError") return createValidationError(error);

  if (error.code) {
    const fieldName = Object.keys(error.keyPattern)[0];
    const message = databaseErrorMessages[error.code][fieldName];

    if (message) {
      return {
        message: message + "."
      };
    }
  }

  if (error.message) return { message: error.message + "." };

  return error;
};
