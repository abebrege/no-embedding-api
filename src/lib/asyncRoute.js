// Wrap an async route handler so any thrown/rejected error reaches the
// Express error middleware instead of crashing the process.
const asyncRoute = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

export default asyncRoute;
