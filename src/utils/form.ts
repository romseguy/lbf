export const handleError = (
  error: { message?: string; status?: number; data?: any },
  setError: (message: string, field?: string) => void
) => {
  if (error.message || error.data.message)
    return setError(error.message || error.data.message);

  if (error.status === 400 || error.status === 500) {
    const fields = Object.keys(error.data);

    if (!fields.length) {
      return setError(
        "Une erreur est survenue, veuillez contacter le développeur"
      );
    }

    fields.forEach((field) => {
      setError(error.data[field], field);
    });
  }
};
