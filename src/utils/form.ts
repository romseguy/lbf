export const handleError = (
  error: { message?: string; status?: number; data?: any },
  setError: (message: string, field?: string) => void
) => {
  const setFieldsErrors = (fields: any) => {
    const keys = Object.keys(fields);
    if (!keys.length) {
      return setError("Une erreur inconnue est survenue");
    }
    keys.forEach((key) => {
      setError(fields[key], key);
    });
  };

  if (error.status === 400 || error.status === 500) {
    if (error.data) {
      setFieldsErrors(error.data);
    } else if (error.message) {
      setError(error.message);
    } else {
      setFieldsErrors(error);
    }
  } else {
    if (error.data) {
      setFieldsErrors(error.data);
    } else if (error.message) {
      setError(error.message);
    } else {
      setFieldsErrors(error);
    }
  }
};
