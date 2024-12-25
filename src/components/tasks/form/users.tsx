import { useForm, useSelect } from "@refinedev/antd"; // useForm and useSelect hooks from Refine library
import { HttpError } from "@refinedev/core"; // HttpError for error handling
import {
  GetFields,
  GetFieldsFromList,
  GetVariables,
} from "@refinedev/nestjs-query"; // Types for fetching fields and variables

import { Button, Form, Select, Space } from "antd"; // Ant Design components for the form

import {
  UpdateTaskMutation,
  UpdateTaskMutationVariables,
  UsersSelectQuery,
} from "@/graphql/types"; // GraphQL types for mutations and queries

import { USERS_SELECT_QUERY } from "@/graphql/queries"; // Query to fetch users
import { UPDATE_TASK_MUTATION } from "@/graphql/mutations"; // Mutation to update the task

type Props = {
  initialValues: {
    userIds?: { label: string; value: string }[]; // List of selected user IDs
  };
  cancelForm: () => void; // Function to cancel the form
};

export const UsersForm = ({ initialValues, cancelForm }: Props) => {
  // use the useForm hook to manage the form for assigning users to a task
  const { formProps, saveButtonProps } = useForm< 
    GetFields<UpdateTaskMutation>, // Type for mutation result fields
    HttpError, // Type for error handling
    Pick<GetVariables<UpdateTaskMutationVariables>, "userIds"> // Pick only the 'userIds' field for updating
  >({
    queryOptions: {
      enabled: false, // Disable query fetching on mount
    },
    redirect: false, // Disable redirection after mutation
    onMutationSuccess: () => {
      // Close the form on successful mutation
      cancelForm();
    },
    meta: {
      gqlMutation: UPDATE_TASK_MUTATION, // GraphQL mutation for updating the task
    },
  });

  // use the useSelect hook to fetch the list of users and display them in a select component
  const { selectProps } = useSelect<GetFieldsFromList<UsersSelectQuery>>({
    resource: "users", // Specify the resource to fetch (users)
    meta: {
      gqlQuery: USERS_SELECT_QUERY, // GraphQL query for fetching users
    },
    optionLabel: "name", // Label to display for each user in the select dropdown
  });

  return (
    <div
      style={{
        display: "flex", // Flexbox layout for the form
        alignItems: "end", // Align items at the bottom
        justifyContent: "space-between", // Space items evenly
        gap: "12px", // Add space between elements
      }}
    >
      <Form
        {...formProps}
        style={{ width: "100%" }}
        initialValues={initialValues}
      >
        <Form.Item noStyle name="userIds">
          <Select
            {...selectProps}
            className="kanban-users-form-select"
            dropdownStyle={{ padding: "0px" }}
            style={{ width: "100%" }}
            mode="multiple" // Allow multiple selections
          />
        </Form.Item>
      </Form>
      <Space>
        {/* Buttons for canceling and saving the form */}
        <Button type="default" onClick={cancelForm}>
          Cancel
        </Button>
        <Button {...saveButtonProps} type="primary">
          Save
        </Button>
      </Space>
    </div>
  );
};
