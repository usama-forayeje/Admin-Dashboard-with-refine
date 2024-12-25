import { useSearchParams } from "react-router"; // Hook to access URL search parameters
import { useModalForm } from "@refinedev/antd"; // Hook to manage modal forms in Refine
import { useNavigation } from "@refinedev/core"; // Hook to handle page navigation in Refine
import { Form, Input, Modal } from "antd"; // Ant Design components for form and modal

import { CREATE_TASK_MUTATION } from "@/graphql/mutations"; // GraphQL mutation for creating a task

const TasksCreatePage = () => {
  // Get search params from the URL using useSearchParams hook
  const [searchParams] = useSearchParams();

  /**
   * useNavigation is a hook by Refine that allows you to navigate to a page.
   * The `list` method will navigate to the list page of the tasks resource.
   */
  const { list } = useNavigation();

  /**
   * useModalForm is a hook by Refine that helps manage the form inside a modal.
   * It uses the formProps and modalProps to control the form and modal behavior.
   * It also handles form submission and mutation.
   */
  const { formProps, modalProps, close } = useModalForm({
    action: "create", // Action type (create or edit), here it's 'create' to add a new task
    defaultVisible: true, // Modal is visible by default when the page loads
    meta: {
      gqlMutation: CREATE_TASK_MUTATION, // The GraphQL mutation for task creation
    },
  });

  return (
    <Modal
      {...modalProps} // Pass modalProps for managing modal state and actions
      onCancel={() => {
        // onCancel: Close the modal and navigate back to the list of tasks
        close(); // Close the modal
        list("tasks", "replace"); // Navigate to the tasks list page
      }}
      title="Add new card" // Modal title
      width={512} // Set modal width
    >
      <Form
        {...formProps} // Spread formProps to link the form with useModalForm
        layout="vertical" // Layout of the form (vertical stacking of form fields)
        onFinish={(values) => {
          // onFinish: Handle form submission and trigger mutation
          formProps?.onFinish?.({
            ...values, // Spread form values
            stageId: searchParams.get("stageId") // Get stageId from URL params (if exists)
              ? Number(searchParams.get("stageId")) // Convert stageId to number if available
              : null, // Default to null if stageId is not present
            userIds: [], // Empty array for userIds (could be modified later for user selection)
          });
        }}
      >
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          {/* Form input for the task title */}
          <Input /> {/* Ant Design Input component */}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TasksCreatePage;
