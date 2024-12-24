// Import necessary modules and types
import { GraphQLClient } from "@refinedev/nestjs-query";
import { GraphQLFormattedError } from "graphql";

// API endpoint for the GraphQL client
export const API_URL = "https://api.crm.refine.dev";

// Initialize GraphQL client with a custom fetch function
export const client = new GraphQLClient(API_URL, {
    fetch: (url: string, options: RequestInit) => {
        try {
            // Use the fetchWrapper for enhanced error handling
            return fetchWrapper(url, options);
        } catch (error) {
            // Reject the promise with an error if something goes wrong
            return Promise.reject(error as Error);
        }
    },
});

// Define a type for GraphQL errors
// This includes the error message and status code
type GraphQLError = {
    message: string;
    statusCode: string | number;
};

// A custom fetch function that adds authentication headers to requests
const customFetch = async (url: string, options: RequestInit) => {
    // Retrieve the access token from local storage
    const accessToken = localStorage.getItem("access_token");

    // Cast options.headers to a record of string key-value pairs
    const headers = options.headers as Record<string, string>;

    return fetch(url, {
        ...options, // Spread existing options
        headers: {
            ...headers, // Include existing headers
            Authorization: headers?.Authorization || `Bearer ${accessToken}`, // Add the Authorization header
            "Content-Type": "application/json", // Ensure content type is JSON
            "Apollo-Require-Preflight": "true", // Apollo-specific header for preflight checks
        },
    });
};

// Function to parse GraphQL errors from the response body
const getGraphQLError = (
    body: Record<string, any> // The response body containing potential GraphQL errors
): GraphQLError | null => {
    if (!body) {
        // Return a generic error if the body is undefined or null
        return {
            message: "Unknown error",
            statusCode: "Internal Server Error",
        };
    }

    if ("errors" in body) {
        // Extract the errors array from the response body
        const errors = body.errors as GraphQLFormattedError[] | undefined;
        
        // Combine all error messages into a single string
        const messages = errors?.map((error) => error.message).join(" ");
        
        // Extract the status code from the first error, if available
        const code = errors?.[0]?.extensions?.code;

        return {
            message: messages || JSON.stringify(errors),
            statusCode: code || 500, // Default to 500 if no code is provided
        };
    }

    // Return null if no errors are present
    return null;
};

// Wrapper around customFetch to handle errors and parse responses
export const fetchWrapper = async (url: string, options: RequestInit) => {
    // Perform the fetch request with customFetch
    const response = await customFetch(url, options);
    
    // Clone the response to safely read its body
    const responseClone = response.clone();
    
    // Parse the JSON body of the response
    const body = await responseClone.json();
    
    // Check for GraphQL errors in the response body
    const error = getGraphQLError(body);

    if (error) {
        // Throw an error if GraphQL errors are found
        throw error;
    }

    // Return the original response if no errors are present
    return response;
};
