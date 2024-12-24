// Import the GraphQLClient from refine's nestjs-query and the fetchWrapper utility function
import  graphqlDataProvider,{ GraphQLClient ,liveProvider as graphqlLiveProvider} from "@refinedev/nestjs-query";
import { fetchWrapper } from './fetch-wrapper';
import { createClient } from "graphql-ws";

// Define the API URL for the GraphQL client
export const API_BASE_URL = "https://api.crm.refine.dev";
export const API_URL = `${API_BASE_URL}/graphql`;

export const WS_URL = "wss://api.crm.refine.dev/graphql";
// Create a GraphQL client instance and configure it with a custom fetch function
export const client = new GraphQLClient(API_URL, {
    // The custom fetch function handles network requests
    fetch: (url: string, options: RequestInit) => {
        try {
            // Use fetchWrapper for request execution and error handling
            return fetchWrapper(url, options);
        } catch (error) {
            // If an error occurs, reject the promise with the error
            return Promise.reject(error as Error);
        }
    },
});



export const wsClient = typeof window !== 'undefined'
? createClient({
    url: WS_URL,
    connectionParams: () => {
        const accessToken = localStorage.getItem(access_Token)
        return{
            headers:{
                Authorization: `Bearer ${accessToken}`,
            }
        }
    }
})
: undefined

export const dataProvider = graphqlDataProvider(client);

export const liveProvider = wsClient
  ? graphqlLiveProvider(wsClient)
  : undefined;
