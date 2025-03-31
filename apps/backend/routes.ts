/**
 * An Array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ["/"];
/**
 * An Array of routes that are accessible to the public
 * These routes will redirect loggedIn user to settings
 * @type {string[]}
 */
export const authRoutes = ["/admin/login"];
/**
 * The Prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purpose
 * @type {string}
 */
export const apiAuthPrefix = "/api/";
/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/admin/blog";
