import { useState } from "react"; // Hook to manage state in functional components

import { DeleteButton, useModalForm } from "@refinedev/antd"; // Refine hooks for modal and delete functionality
import { useNavigation } from "@refinedev/core"; // Refine hook for navigation

import {
  AlignLeftOutlined, // Ant Design icon for text alignment
  FieldTimeOutlined, // Ant Design icon for time-related content
  UsergroupAddOutlined, // Ant Design icon for user-related actions
} from "@ant-design/icons"; // Ant Design icons

import { Modal } from "antd"; // Ant Design Modal component

import {
  Accordion, // Custom Accordion component to toggle sections
  DescriptionForm, // Custom form to edit task description
  DescriptionHeader, // Custom header for description section
  DueDateForm, // Custom form to edit task due date
  DueDateHeader, // Custom header for due date section
  StageForm, // Custom form to edit task stage
  TitleForm, // Custom form to edit task title
  UsersForm, // Custom form to assign users to task
  UsersHeader, // Custom header for users section
} from "@/components"; // Import components from the local project

import { Task } from "@/graphql/schema.types"; // Type definition for Task

import { UPDATE_TASK_MUTATION } from "@/graphql/mutations"; // GraphQL mutation for updating a task

const TasksEditPage = () => {
  const [activeKey, setActiveKey] = useState<string | undefined>(); // State to control active accordion key

  // use the list method to navigate to the list page of the tasks resource from the navigation hook
  const { list } = useNavigation();

  // create a modal form to edit a task using the useModalForm hook
  // modalProps -> It manages the modal state and actions like onOk, onCancel
  // close -> Function to close the modal
  // queryResult -> Contains the task data fetched by the query
  const { modalProps, close, queryResult } = useModalForm<Task>({
    action: "edit", // Define action as "edit" for task update
    defaultVisible: true, // Modal should be visible by default
    meta: {
      gqlMutation: UPDATE_TASK_MUTATION, // GraphQL mutation for updating task
    },
  });

  // Destructure task properties from queryResult data (title, description, dueDate, users)
  const { description, dueDate, users, title } = queryResult?.data?.data ?? {};
  
  const isLoading = queryResult?.isLoading ?? true; // Loading state from the query

  return (
    <Modal
      {...modalProps} // Spread modalProps to manage modal behavior
      className="kanban-update-modal" // Custom class for styling
      onCancel={() => {
        close(); // Close the modal
        list("tasks", "replace"); // Navigate back to the tasks list page
      }}
      title={<TitleForm initialValues={{ title }} isLoading={isLoading} />} // Render TitleForm with initial title
      width={586} // Set the modal width
      footer={
        <DeleteButton // Render a delete button to remove the task
          type="link" 
          onSuccess={() => {
            list("tasks", "replace"); // Navigate to tasks list after successful deletion
          }}
        >
          Delete card
        </DeleteButton>
      }
    >
      {/* Render StageForm to edit task stage */}
      <StageForm isLoading={isLoading} />

      {/* Render the Description section inside an Accordion */}
      <Accordion
        accordionKey="description" // Unique key for this accordion section
        activeKey={activeKey} // Active section state
        setActive={setActiveKey} // Function to toggle the active section
        fallback={<DescriptionHeader description={description} />} // Display description header as fallback
        isLoading={isLoading} // Pass loading state
        icon={<AlignLeftOutlined />} // Icon for this section
        label="Description" // Label of the section
      >
        <DescriptionForm // Render DescriptionForm for editing description
          initialValues={{ description }}
          cancelForm={() => setActiveKey(undefined)} // Close the section when canceling
        />
      </Accordion>

      {/* Render the Due Date section inside an Accordion */}
      <Accordion
        accordionKey="due-date" // Unique key for this accordion section
        activeKey={activeKey}
        setActive={setActiveKey}
        fallback={<DueDateHeader dueData={dueDate} />} // Fallback: Display current due date header
        isLoading={isLoading}
        icon={<FieldTimeOutlined />} // Icon for this section
        label="Due date"
      >
        <DueDateForm // Render DueDateForm for editing due date
          initialValues={{ dueDate: dueDate ?? undefined }}
          cancelForm={() => setActiveKey(undefined)} // Close the section when canceling
        />
      </Accordion>

      {/* Render the Users section inside an Accordion */}
      <Accordion
        accordionKey="users" // Unique key for this accordion section
        activeKey={activeKey}
        setActive={setActiveKey}
        fallback={<UsersHeader users={users} />} // Fallback: Display users currently assigned
        isLoading={isLoading}
        icon={<UsergroupAddOutlined />} // Icon for this section
        label="Users"
      >
        <UsersForm // Render UsersForm for assigning/removing users from the task
          initialValues={{
            userIds: users?.map((user) => ({
              label: user.name,
              value: user.id,
            })),
          }}
          cancelForm={() => setActiveKey(undefined)} // Close the section when canceling
        />
      </Accordion>
    </Modal>
  );
};

export default TasksEditPage;
