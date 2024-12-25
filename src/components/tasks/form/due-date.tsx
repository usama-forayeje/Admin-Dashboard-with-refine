import { useForm } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import { GetFields, GetVariables } from "@refinedev/nestjs-query";

import { Button, DatePicker, Form, Space } from "antd";
import dayjs from "dayjs";

import { Task } from "@/graphql/schema.types";
import {
  UpdateTaskMutation,
  UpdateTaskMutationVariables,
} from "@/graphql/types";

import { UPDATE_TASK_MUTATION } from "@/graphql/mutations";

type Props = {
  initialValues: {
    dueDate?: Task["dueDate"]; // Initial values for the form, with an optional dueDate
  };
  cancelForm: () => void; // Function to call when canceling the form
};

export const DueDateForm = ({ initialValues, cancelForm }: Props) => {
  // useForm hook to manage the form's state and handle form submission
  // formProps contains the necessary props for the form (e.g., initialValues, onSubmit)
  // saveButtonProps contains the props for the save button (e.g., onClick handler, disabled state)
  const { formProps, saveButtonProps } = useForm<
    GetFields<UpdateTaskMutation>, // Specifies the fields returned by the mutation (task fields)
    HttpError, // Type of error that can occur (HttpError)
    Pick<GetVariables<UpdateTaskMutationVariables>, "dueDate"> // Picks the "dueDate" property from the mutation variables
  >({
    queryOptions: {
      enabled: false, // Disables query on component mount, so no data is fetched initially
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
    <div
      style={{
        display: "flex", // Displays the form and buttons in a row
        alignItems: "center", // Centers the items vertically
        justifyContent: "space-between", // Spaces the form and buttons apart
      }}
    >
      <Form {...formProps} initialValues={initialValues}>
        <Form.Item
          noStyle
          name="dueDate" // Binds the DatePicker to the "dueDate" field in the form
          getValueProps={(value) => {
            // Converts the value to dayjs format when it is non-null
            if (!value) return { value: undefined };
            return { value: dayjs(value) }; // Converts the date to dayjs format
          }}
        >
          <DatePicker
            format="YYYY-MM-DD HH:mm" // Date format for the DatePicker
            showTime={{
              showSecond: false, // Hides the seconds part of the time
              format: "HH:mm", // Displays time in HH:mm format
            }}
            style={{ backgroundColor: "#fff" }} // Custom style for the DatePicker
          />
        </Form.Item>
      </Form>
      
      {/* Cancel and Save buttons */}
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
  );
};
