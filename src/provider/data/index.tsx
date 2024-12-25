// Import the necessary modules
// - graphqlDataProvider: To interact with the GraphQL API.
// - GraphQLClient: For making GraphQL queries and mutations.
// - liveProvider: For handling real-time data (subscriptions) using WebSocket.
// - fetchWrapper: A utility function to handle network requests and error handling.
import graphqlDataProvider, { GraphQLClient, liveProvider as graphqlLiveProvider } from "@refinedev/nestjs-query";
import { fetchWrapper } from './fetch-wrapper';
import { createClient } from "graphql-ws";

// Define the API URL for the GraphQL client
export const API_BASE_URL = "https://api.crm.refine.dev"; // The base URL of the API
export const API_URL = `${API_BASE_URL}/graphql`; // The full GraphQL API endpoint URL for queries and mutations

// Define the WebSocket URL for real-time updates (GraphQL subscriptions)
export const WS_URL = "wss://api.crm.refine.dev/graphql"; // WebSocket URL for real-time data handling

// Create an instance of the GraphQLClient to interact with the GraphQL API
// Configure it to use a custom fetch function (fetchWrapper) to handle requests
export const client = new GraphQLClient(API_URL, {
    fetch: (url: string, options: RequestInit) => { // Custom fetch function for handling requests
        try {
            // Call the fetchWrapper to make the network request and handle errors
            return fetchWrapper(url, options);
        } catch (error) {
            // If an error occurs, reject the promise with the error
            return Promise.reject(error as Error);
        }
    },
});

// Create a WebSocket client for real-time updates
// This client is only created on the client-side (browser), hence the check for `window`
// The connectionParams function adds the Authorization token from localStorage to the WebSocket headers
export const wsClient = typeof window !== 'undefined'  // Check if the code is running in the browser
  ? createClient({
      url: WS_URL, // WebSocket URL to connect to the GraphQL server
      connectionParams: () => {
          // Retrieve the access token from localStorage to authenticate the WebSocket connection
          const accessToken = localStorage.getItem("access_token");
          return {
              headers: {
                  Authorization: `Bearer ${accessToken}`, // Attach the token to the Authorization header
              }
          };
      }
  })
  : undefined; // If not in the browser, `wsClient` is undefined

// Initialize the GraphQL data provider that will handle queries and mutations
export const dataProvider = graphqlDataProvider(client);

// Initialize the GraphQL live provider that will handle subscriptions (real-time updates) through WebSocket
// If `wsClient` is available (i.e., running in the browser), the live provider is initialized with the WebSocket client
export const liveProvider = wsClient
  ? graphqlLiveProvider(wsClient) // If WebSocket client is available, use it for live updates
  : undefined; // If not, live provider is undefined
