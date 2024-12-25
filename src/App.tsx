// Importing necessary components and libraries
import { Authenticated, GitHubBanner, Refine } from "@refinedev/core"; // Core components for Refine
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools"; // Developer tools for debugging
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar"; // KBar for managing keyboard shortcuts

import { useNotificationProvider } from "@refinedev/antd"; // Notification provider from Ant Design
import "@refinedev/antd/dist/reset.css"; // CSS reset for Ant Design components

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router"; // Router bindings for Refine with React Router

import { App as AntdApp } from "antd"; // Ant Design's App component for layout
import { createClient } from "graphql-ws"; // WebSocket client for real-time GraphQL updates
import { BrowserRouter, Outlet, Route, Routes } from "react-router"; // React Router components for routing
import { GraphQLClient } from "@refinedev/nestjs-query"; // GraphQL client for communication with GraphQL server
import { authProvider, dataProvider, liveProvider } from "./provider"; // Custom providers for authentication, data, and live updates
import { CompanyList, ForgotPassword, Home, Login, Register } from "./pages"; // Importing page components
import Layout from "./components/layout"; // Main layout component for authenticated users
import { resources } from "./config/resources"; // Configuration for resources in the application
import Create from "./pages/company/create"; // Page for creating a new company
import EditPage from "./pages/company/edit"; // Page for editing a company's details
import List from "./pages/tasks/list"; // Page for listing tasks
import TasksEditPage from "./pages/tasks/edit"; // Page for editing tasks
import TasksCreatePage from "./pages/tasks/create"; // Page for creating tasks

// Define the GraphQL API URL and WebSocket URL
const API_URL = "https://api.nestjs-query.refine.dev/graphql";
const WS_URL = "wss://api.nestjs-query.refine.dev/graphql";

// Initialize the GraphQL client and WebSocket client
const gqlClient = new GraphQLClient(API_URL);
const wsClient = createClient({ url: WS_URL });

function App() {
  return (
    <BrowserRouter> {/* BrowserRouter is used for client-side routing */}
      <RefineKbarProvider> {/* KBar Provider to handle keyboard shortcuts */}
        <AntdApp> {/* Wrapping the app with Ant Design's App component for proper layout */}
          <DevtoolsProvider> {/* Developer tools for debugging */}
            <Refine
              dataProvider={dataProvider} // The custom data provider for handling GraphQL data
              liveProvider={liveProvider} // Live updates provider (using WebSocket)
              notificationProvider={useNotificationProvider} // Ant Design notification provider
              routerProvider={routerBindings} // Router bindings for handling routes
              authProvider={authProvider} // The custom authentication provider
              resources={resources} // Resources configuration for the app (defines which resources can be managed)
              options={{
                syncWithLocation: true, // Keep the URL in sync with the app's location
                warnWhenUnsavedChanges: true, // Warn users about unsaved changes
                useNewQueryKeys: true, // Use new query keys to fetch data
                projectId: "Dd98Ba-7aj8Iu-ZacDR5", // Project ID (for analytics and reporting)
                liveMode: "auto", // Enable live mode for real-time updates
              }}
            >
              {/* Defining routes for the app */}
              <Routes>
                <Route path="/register" element={<Register />} /> {/* Register page */}
                <Route path="login" element={<Login />} /> {/* Login page */}
                <Route path="forgot-password" element={<ForgotPassword />} /> {/* Forgot Password page */}
                
                {/* Main authenticated routes */}
                <Route
                  element={
                    <Authenticated
                      key="authenticated-layout"
                      fallback={<CatchAllNavigate to="/login" />} // If the user is not authenticated, redirect to login
                    >
                      <Layout> {/* Layout for authenticated users */}
                        <Outlet /> {/* Outlet renders child routes */}
                      </Layout>
                    </Authenticated>
                  }
                >
                  <Route index element={<Home />} /> {/* Home page */}
                  <Route path="/companies">
                    <Route index element={<CompanyList />} /> {/* List of companies */}
                    <Route path="new" element={<Create />} /> {/* Create new company */}
                    <Route path="edit/:id" element={<EditPage />} /> {/* Edit company */}
                    <Route path="tasks/:id" element={<List />} /> {/* List tasks for a specific company */}
                  </Route>
                  
                  <Route
                    path="/tasks"
                    element={
                      <List> {/* List tasks page */}
                        <Outlet /> {/* Outlet renders task-related routes */}
                      </List>
                    }
                  >
                    <Route path="new" element={<TasksCreatePage />} /> {/* Create new task */}
                    <Route path="edit/:id" element={<TasksEditPage />} /> {/* Edit task */}
                  </Route>
                </Route>
              </Routes>

              {/* Additional components */}
              <RefineKbar /> {/* KBar for keyboard shortcuts */}
              <UnsavedChangesNotifier /> {/* Notify users of unsaved changes */}
              <DocumentTitleHandler /> {/* Update document title based on the current page */}
            </Refine>

            {/* Developer tools panel */}
            <DevtoolsPanel />
          </DevtoolsProvider>
        </AntdApp>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
