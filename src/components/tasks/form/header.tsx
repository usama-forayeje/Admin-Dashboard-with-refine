import { MarkdownField } from "@refinedev/antd";
import { Typography, Space, Tag } from "antd";
import dayjs from "dayjs";

import { Text, UserTag } from "@/components";
import { Task } from "@/graphql/schema.types";
import { getDateColor } from "@/utils";

type DescriptionProps = {
  description?: Task["description"]; // Optional description of the task
};

type DueDateProps = {
  dueData?: Task["dueDate"]; // Optional due date of the task
};

type UserProps = {
  users?: Task["users"]; // Optional list of users assigned to the task
};

// Display the task's description if it exists, otherwise show a link to add one
export const DescriptionHeader = ({ description }: DescriptionProps) => {
  if (description) {
    return (
      <Typography.Paragraph ellipsis={{ rows: 8 }}>
        <MarkdownField value={description} />
      </Typography.Paragraph>
    );
  }

  // If the task doesn't have a description, display a link to add one
  return <Typography.Link>Add task description</Typography.Link>;
};

// Display the task's due date if it exists, otherwise show a link to add one
export const DueDateHeader = ({ dueData }: DueDateProps) => {
  if (dueData) {
    // Get the color for the due date tag based on its proximity
    const color = getDateColor({
      date: dueData,
      defaultColor: "processing", // Default color if no condition matches
    });

    // Function to return appropriate tag text based on the due date color
    const getTagText = () => {
      switch (color) {
        case "error":
          return "Overdue"; // Overdue task
        case "warning":
          return "Due soon"; // Task due soon
        default:
          return "Processing"; // Task in progress
      }
    };

    return (
      <Space size={[0, 8]}>
        <Tag color={color}>{getTagText()}</Tag>
        <Text>{dayjs(dueData).format("MMMM D, YYYY - h:ma")}</Text> {/* Format and display the due date */}
      </Space>
    );
  }

  // If the task doesn't have a due date, display a link to add one
  return <Typography.Link>Add due date</Typography.Link>;
};

// Display the task's assigned users if they exist, otherwise show a link to add one
export const UsersHeader = ({ users = [] }: UserProps) => {
  if (users.length > 0) {
    return (
      <Space size={[0, 8]} wrap>
        {users.map((user) => (
          <UserTag key={user.id} user={user} /> 
        ))}
      </Space>
    );
  }

  // If no users are assigned, display a link to assign users
  return <Typography.Link>Assign to users</Typography.Link>;
};
