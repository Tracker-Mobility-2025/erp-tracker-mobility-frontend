/**
 * Sign In Response
 * @summary
 * Represents a sign-in response
 */
export class SignInResponse {
    /**
     * Constructor
     * @param {string} userId - The user id
     * @param {string} username - The username
     * @param {string} token - The authentication token
     * @param {string[]} roles - The user roles (array)
     */
    constructor(userId, username, token, roles) {
        this.userId = userId;
        this.username = username;
        this.token = token;
        this.roles = roles || []; // Array de roles
    }

}