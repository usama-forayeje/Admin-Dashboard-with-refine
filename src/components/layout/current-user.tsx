import { Button, Popover } from "antd"; // Ant Design components for button and popover
import CustomAvatar from "../custom-avatar"; // Custom avatar component
import { useGetIdentity } from "@refinedev/core"; // Hook to get the current user's identity

import type { User } from "@/graphql/schema.types"; // Type definition for user
import { Text } from "../text"; // Custom text component
import { SettingOutlined } from "@ant-design/icons"; // Setting icon
import { useState } from "react"; // React hook to manage state
import { AccountSettings } from "./account-settings"; // Account settings component

function CurrentUser() {
  // State to control the visibility of the account settings drawer
  const [isOpen, setIsOpen] = useState(false);

  // Get the current user's data
  const { data: user } = useGetIdentity<User>();

  // Content for the popover
  const content = (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* User name displayed in the popover */}
      <Text strong style={{ padding: "12px 20px" }}>
        {user?.name}
      </Text>
      {/* Button to open account settings */}
      <div
        style={{
          borderTop: "1px solid #d9d9d9",
          padding: "4px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <Button
          style={{ textAlign: "left" }}
          icon={<SettingOutlined />} // Icon for account settings
          type="text"
          block // Button takes full width
          onClick={() => setIsOpen(true)} // Opens the account settings drawer
        >
          Account Settings
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Popover component */}
      <Popover
        placement="bottomRight" // Popover appears at the bottom-right
        trigger="click" // Popover opens on click
        overlayInnerStyle={{ padding: 0 }} // Removes extra padding in the popover
        overlayStyle={{ zIndex: 999 }} // Ensures popover is above other elements
        content={content} // Popover content
      >
        {/* Avatar for the current user */}
        <CustomAvatar
          name={user?.name} // Displays user's initials or name
          src={user?.avatarUrl} // Displays user's profile picture if available
          size="default"
          style={{ cursor: "pointer" }} // Cursor changes to pointer on hover
        />
      </Popover>

      {/* Account settings drawer */}
      {user && (
        <AccountSettings
          opened={isOpen} // Controls visibility of the drawer
          setOpened={setIsOpen} // Function to toggle the drawer's visibility
          userId={user?.id} // Passes the user's ID to the account settings component
        />
      )}
    </>
  );
}

export default CurrentUser; // Exporting the component
