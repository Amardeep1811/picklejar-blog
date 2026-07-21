export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    res.status(400);
    const messages = error.issues ? error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ') : error.message;
    next(new Error(messages));
  }
};
