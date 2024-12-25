import { useForm } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import { GetFields, GetVariables } from "@refinedev/nestjs-query";

import MDEditor from "@uiw/react-md-editor";
import { Button, Form, Space } from "antd";

import { Task } from "@/graphql/schema.types";
import {
  UpdateTaskMutation,
  UpdateTaskMutationVariables,
} from "@/graphql/types";

import { UPDATE_TASK_MUTATION } from "@/graphql/mutations";

type Props = {
  initialValues: {
    description?: Task["description"]; // Initial values for the form, with an optional description
  };
  cancelForm: () => void; // Function to call when canceling the form
};

export const DescriptionForm = ({ initialValues, cancelForm }: Props) => {
  // useForm hook is used to manage the form state and handle form submission
  // formProps contains the necessary props for the form (e.g., initialValues, onSubmit)
  // saveButtonProps contains the props for the save button (e.g., onClick handler, disabled state)
  const { formProps, saveButtonProps } = useForm< 
    GetFields<UpdateTaskMutation>, // Specifies the data type returned by the mutation (task fields)
    HttpError, // Type of error that can occur (HttpError)
    Pick<GetVariables<UpdateTaskMutationVariables>, "description"> // Pick the "description" property from the mutation variables
  >({
    queryOptions: {
      enabled: false, // Disables the query on component mount, so no data is fetched initially
    },
    redirect: false, // Prevents automatic redirection after mutation success
    onMutationSuccess: () => {
      cancelForm(); // Calls cancelForm when the mutation (task update) is successful
    },
    meta: {
      gqlMutation: UPDATE_TASK_MUTATION, // Specifies the GraphQL mutation to update the task
    },
  });

  return (
    <>
      {/* Form component for managing the description field */}
      <Form {...formProps} initialValues={initialValues}>
        <Form.Item noStyle name="description">
          {/* MDEditor is used to edit markdown content */}
          <MDEditor preview="edit" data-color-mode="light" height={250} />
        </Form.Item>
      </Form>

      {/* Footer section with Cancel and Save buttons */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end", // Aligns the buttons to the right
          marginTop: "12px", // Adds margin to the top
        }}
      >
        <Space>
          {/* Cancel button, calls cancelForm when clicked */}
          <Button type="default" onClick={cancelForm}>
            Cancel
          </Button>

          {/* Save button, triggers the form submission when clicked */}
          <Button {...saveButtonProps} type="primary">
            Save
          </Button>
        </Space>
      </div>
    </>
  );
};
