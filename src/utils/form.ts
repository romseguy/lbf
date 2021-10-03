export const handleError = (
  error: any,
  setError: (message: string, field?: string) => void
) => {
  console.error(error);

  const setFieldsErrors = (fields: any) => {
    const keys = Object.keys(fields);
    if (!keys.length) {
      return setError("Une erreur inconnue est survenue");
    }

    for (const key of keys) {
      if (key === "message") {
        setError(fields[key]);
      } else {
        const message = fields[key].message ? fields[key].message : fields[key];
        setError(message, key);
      }
    }
  };

  if (error.status === 400 || error.status === 500) {
    if (error.data) {
      const keys = Object.keys(error.data);

      if (keys.length) {
        setFieldsErrors(error.data);
      } else {
        if (error.data.message) {
          setError(error.data.message);
        } else {
          setFieldsErrors(error.data);
        }
      }
    } else if (error.message) {
      setError(error.message);
    } else {
      setFieldsErrors(error);
    }
  } else {
    if (error.data) {
      if (error.data.message) {
        setError(error.data.message);
      } else {
        setFieldsErrors(error.data);
      }
    } else if (error.message) {
      setError(error.message);
    } else {
      setFieldsErrors(error);
    }
  }
};
