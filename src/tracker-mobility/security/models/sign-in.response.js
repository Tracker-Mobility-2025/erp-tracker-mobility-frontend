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
     * @param {string} role - The user role
     */
    constructor(userId, username, token, role) {
        this.userId = userId;
        this.username = username;
        this.token = token;
        this.role = role;
    }

}