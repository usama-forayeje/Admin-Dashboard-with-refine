// Importing necessary types and modules
import type { AuthProvider } from "@refinedev/core"; // AuthProvider type from refine
import type { User } from "@/graphql/schema.types"; // User type definition
import { API_URL, dataProvider } from "./data"; // Importing the API URL and dataProvider for GraphQL queries

/**
 * For demo purposes and to make it easier to test the app, you can use the following credentials:
 * These are default credentials provided for easy access during testing.
 */
export const authCredentials = {
  email: "michael.scott@dundermifflin.com", // Default email used for login
  password: "demodemo", // Default password used for login
};

/**
 * The authProvider is used by Refine to handle authentication-related logic
 * such as login, logout, checking authentication status, error handling, etc.
 */
export const authProvider: AuthProvider = {
  /**
   * Login function handles the user login by taking the email as an argument.
   * It uses a GraphQL mutation to authenticate the user and get an access token.
   */
  login: async ({ email }) => {
    try {
      // Perform a custom GraphQL request to log in and get the access token
      const { data } = await dataProvider.custom({
        url: API_URL, // The API URL for the GraphQL server
        method: "post", // POST method to submit the login mutation
        headers: {}, // Optional headers (none in this case)
        meta: {
          variables: { email }, // Pass the email as a variable in the GraphQL query
          rawQuery: `
                mutation Login($email: String!) {
                    login(loginInput: {
                      email: $email
                    }) {
                      accessToken, // We get the access token from the response
                    }
                  }
                `, // The GraphQL mutation query for login
        },
      });

      // Store the access token in localStorage for use in future requests
      localStorage.setItem("access_token", data.login.accessToken);

      // Return success response and redirect to the home page
      return {
        success: true,
        redirectTo: "/",
      };
    } catch (e) {
      // Handle any errors that occur during login
      const error = e as Error;

      // Return failure response with error details
      return {
        success: false,
        error: {
          message: "message" in error ? error.message : "Login failed", // Default message if error doesn't provide one
          name: "name" in error ? error.name : "Invalid email or password", // Default error name if error doesn't provide one
        },
      };
    }
  },

  /**
   * Logout function removes the access token from localStorage and redirects to the login page.
   */
  logout: async () => {
    // Remove the access token from localStorage to log the user out
    localStorage.removeItem("access_token");

    // Return success and redirect to the login page
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  /**
   * onError function handles authentication errors (like unauthenticated access).
   * If the error status is 'UNAUTHENTICATED', it logs the user out.
   */
  onError: async (error) => {
    // If the error status code indicates unauthenticated access, log out the user
    if (error.statusCode === "UNAUTHENTICATED") {
      return {
        logout: true, // Trigger the logout action
      };
    }

    // Otherwise, return the error for further handling
    return { error };
  },

  /**
   * Check function verifies if the user is authenticated by making a GraphQL query.
   * If authenticated, it redirects to the home page, else to the login page.
   */
  check: async () => {
    try {
      // Perform a custom GraphQL query to check if the user is authenticated
      await dataProvider.custom({
        url: API_URL, // The GraphQL API URL
        method: "post", // POST method to make the request
        headers: {}, // No headers are required for this query
        meta: {
          rawQuery: `
                    query Me {
                        me {
                          name // We just check if the 'me' query returns data
                        }
                      }
                `,
        },
      });

      // If successful, return authenticated status and redirect to home
      return {
        authenticated: true,
        redirectTo: "/",
      };
    } catch (error) {
      // If an error occurs (e.g., unauthenticated), return not authenticated and redirect to login
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }
  },

  /**
   * getIdentity function fetches the user's details from the API using the stored access token.
   * It includes details like the user's name, email, phone, job title, and avatar URL.
   */
  getIdentity: async () => {
    // Retrieve the access token from localStorage
    const accessToken = localStorage.getItem("access_token");

    try {
      // Perform a custom GraphQL query to fetch user details
      const { data } = await dataProvider.custom<{ me: User }>({
        url: API_URL, // The GraphQL API URL
        method: "post", // POST method for the query
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`, // Add the access token in the Authorization header
            }
          : {}, // If no token, no headers are sent
        meta: {
          rawQuery: `
                    query Me {
                        me {
                            id, // User's unique ID
                            name, // User's name
                            email, // User's email
                            phone, // User's phone number
                            jobTitle, // User's job title
                            timezone, // User's timezone
                            avatarUrl // User's avatar URL
                        }
                      }
                `,
        },
      });

      // Return the user details fetched from the query
      return data.me;
    } catch (error) {
      // If an error occurs (e.g., invalid token), return undefined
      return undefined;
    }
  },
};
