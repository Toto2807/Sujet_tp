export function notFound(req, res, next) {
  return res.status(404).json({ message: 'Route introuvable' });
}

export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const body = { message: err.message || 'Erreur serveur' };
  if (process.env.NODE_ENV !== 'production' && err.stack) body.stack = err.stack;
  return res.status(status).json(body);
}
