import React from "react";

import { PlusSquareOutlined } from "@ant-design/icons"; // Import icon for the button
import { Button } from "antd"; // Import Button component from Ant Design
import { Text } from "@/components/text"; // Import Text component for the button label

interface Props {
  onClick: () => void; // Function to call when the button is clicked
}

/**
 * Render a button that allows you to add a new card to a column.
 *
 * @param onClick - a function that is called when the button is clicked.
 * @returns a button that allows you to add a new card to a column.
 */
export const KanbanAddCardButton = ({
  children, // Children for custom text inside the button
  onClick, // Function to handle button click
}: React.PropsWithChildren<Props>) => {
  return (
    <Button
      size="large" // Set the button size to large
      icon={<PlusSquareOutlined className="md" />} // Add an icon inside the button
      style={{
        margin: "16px", // Set margin around the button
        backgroundColor: "white", // Set the background color to white
      }}
      onClick={onClick} // Attach the click handler function
    >
      {children ?? ( // If no children are passed, use the default text
        <Text size="md" type="secondary">
          Add new card
        </Text>
      )}
    </Button>
  );
};
