import React from "react";

import { useForm } from "@refinedev/antd"; // useForm hook is used to manage the form's state and actions
import { HttpError, useInvalidate } from "@refinedev/core"; // HttpError and useInvalidate hooks for error handling and cache invalidation
import { GetFields, GetVariables } from "@refinedev/nestjs-query"; // Types for fields and variables

import { Form, Skeleton } from "antd"; // Form and Skeleton components from Ant Design

import { Text } from "@/components"; // Custom Text component to display task title
import { Task } from "@/graphql/schema.types"; // Task type from GraphQL schema
import {
  UpdateTaskMutation,
  UpdateTaskMutationVariables,
} from "@/graphql/types"; // Mutation types for updating the task

import { UPDATE_TASK_MUTATION } from "@/graphql/mutations"; // GraphQL mutation to update the task

// TitleInput component to display and edit task title
const TitleInput = ({
  value,
  onChange,
}: {
  value?: string; // Task title
  onChange?: (value: string) => void; // Callback to handle title changes
}) => {
  const onTitleChange = (newTitle: string) => {
    onChange?.(newTitle); // Call the onChange function when the title changes
  };

  return (
    <Text
      editable={{
        onChange: onTitleChange, // Function to handle title change
      }}
      style={{ width: "98%" }}
    >
      {value} {/* Display the current task title */}
    </Text>
  );
};

type Props = {
  initialValues: {
    title?: Task["title"]; // Initial task title
  };
  isLoading?: boolean; // Loading state
};

// TitleForm component that allows editing and saving the task title
export const TitleForm = ({ initialValues, isLoading }: Props) => {
  /**
   * useInvalidate hook is used to refresh the task list after a mutation is successful.
   */
  const invalidate = useInvalidate();

  // useForm hook is used to manage the form's state and actions, including mutation handling
  const { formProps } = useForm<
    GetFields<UpdateTaskMutation>, // Type for mutation result fields
    HttpError, // Type for error handling
    Pick<GetVariables<UpdateTaskMutationVariables>, "title"> // Pick only the 'title' field for updating
  >({
    queryOptions: {
      enabled: false, // Disable query fetching on component mount
    },
    redirect: false, // Disable redirect after mutation
    warnWhenUnsavedChanges: false, // Disable warning for unsaved changes
    /**
     * autoSave option saves the form data automatically when changed
     */
    autoSave: {
      enabled: true, // Enable auto-save
    },
    // Refresh task list after the mutation is successful
    onMutationSuccess: () => {
      invalidate({ invalidates: ["list"], resource: "tasks" }); // Refresh the task list
    },
    meta: {
      gqlMutation: UPDATE_TASK_MUTATION, // Mutation to update the task
    },
  });

  // When initialValues changes, update the form's value
  React.useEffect(() => {
    formProps.form?.setFieldsValue(initialValues); // Set form values based on initialValues
  }, [initialValues.title]);

  // Show a skeleton loader while loading data
  if (isLoading) {
    return (
      <Skeleton.Input
        size="small"
        style={{ width: "95%", height: "22px" }}
        block
      />
    );
  }

  // Render the form with the title input field
  return (
    <Form {...formProps} initialValues={initialValues}>
      <Form.Item noStyle name="title">
        <TitleInput />
      </Form.Item>
    </Form>
  );
};
