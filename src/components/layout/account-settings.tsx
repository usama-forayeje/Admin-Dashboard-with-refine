import { SaveButton, useForm } from "@refinedev/antd"; // Import form handling and save button
import { HttpError } from "@refinedev/core"; // Error type for HTTP errors
import { GetFields, GetVariables } from "@refinedev/nestjs-query"; // Utility for handling GraphQL queries

import { CloseOutlined } from "@ant-design/icons"; // Close icon
import { Button, Card, Drawer, Form, Input, Spin } from "antd"; // Ant Design components

import { getNameInitials } from "../../utils/get-name-initial"; // Utility to get name initials
import { UPDATE_USER_MUTATION } from "@/graphql/mutations"; // GraphQL mutation for updating user info

import { Text } from "../text"; // Custom Text component
import CustomAvatar from "../custom-avatar"; // Custom Avatar component

import {
  UpdateUserMutation,
  UpdateUserMutationVariables,
} from "@/graphql/types"; // GraphQL types

// Props for the component
type Props = {
  opened: boolean; // Whether the drawer is open
  setOpened: (opened: boolean) => void; // Function to toggle drawer state
  userId: string; // ID of the user being edited
};

export const AccountSettings = ({ opened, setOpened, userId }: Props) => {
  /**
   * `useForm` hook manages the form state and actions
   * - saveButtonProps: Props for the save button (loading, disabled, etc.)
   * - formProps: Props for the form (onFinish, validation, etc.)
   * - queryResult: Contains data, loading state, and errors from the query
   */
  const { saveButtonProps, formProps, queryResult } = useForm<
    GetFields<UpdateUserMutation>, // Fields of the update mutation
    HttpError, // Type of error returned
    GetVariables<UpdateUserMutationVariables> // Variables needed for the mutation
  >({
    mutationMode: "optimistic", // Immediately updates the UI as if mutation succeeded
    resource: "users", // Resource name
    action: "edit", // Edit action triggers the `useOne` hook to fetch data
    id: userId, // ID of the user being edited
    meta: {
      gqlMutation: UPDATE_USER_MUTATION, // GraphQL mutation to update user
    },
  });

  const { avatarUrl, name } = queryResult?.data?.data || {}; // Get user data from the query

  // Function to close the drawer
  const closeModal = () => {
    setOpened(false);
  };

  // Show a loading spinner while data is being fetched
  if (queryResult?.isLoading) {
    return (
      <Drawer
        open={opened}
        width={756} // Drawer width
        styles={{
          body: {
            background: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <Spin /> {/* Loading spinner */}
      </Drawer>
    );
  }

  return (
    <Drawer
      onClose={closeModal} // Close drawer on close
      open={opened}
      width={756}
      styles={{
        body: { background: "#f5f5f5", padding: 0 },
        header: { display: "none" }, // Hide header
      }}
    >
      {/* Header section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          backgroundColor: "#fff",
        }}
      >
        <Text strong>Account Settings</Text> {/* Header title */}
        <Button
          type="text"
          icon={<CloseOutlined />} // Close icon
          onClick={() => closeModal()} // Close drawer on click
        />
      </div>

      {/* Form section */}
      <div
        style={{
          padding: "16px",
        }}
      >
        <Card>
          <Form {...formProps} layout="vertical"> {/* Form layout */}
            <CustomAvatar
              shape="square" // Avatar shape
              src={avatarUrl} // User's avatar URL
              name={getNameInitials(name || "")} // User's initials
              style={{
                width: 96,
                height: 96,
                marginBottom: "24px",
              }}
            />
            {/* Input fields for user details */}
            <Form.Item label="Name" name="name">
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item label="Job title" name="jobTitle">
              <Input placeholder="Job Title" />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
              <Input placeholder="Phone" />
            </Form.Item>
          </Form>
          {/* Save button */}
          <SaveButton
            {...saveButtonProps} // Save button props
            style={{
              display: "block",
              marginLeft: "auto", // Align button to the right
            }}
          />
        </Card>
      </div>
    </Drawer>
  );
};
