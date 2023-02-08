export const skipRoute = (req: any) => (req.path === '/user/' && req.method) || req.path === '/login' ? true :false
