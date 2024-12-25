import React from "react";
import CurrentUser from "./current-user"; // Import the CurrentUser component
import { Layout, Space, theme } from "antd"; // Ant Design components and theming utilities
const { useToken } = theme; // Hook to access theme tokens

// Header component definition
const Header = () => {
  // Accessing Ant Design theme tokens
  const { token } = useToken();

  // CSS styles for the header
  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated, // Sets the background color from theme tokens
    display: "flex", // Makes the header a flex container
    justifyContent: "flex-end", // Aligns items to the right
    alignItems: "center", // Centers items vertically
    padding: "0px 24px", // Adds padding to the left and right
    height: "64px", // Fixed height for the header
    position: "sticky", // Makes the header sticky at the top
    top: 0, // Positions the sticky header at the very top
    zIndex: 999, // Ensures the header is above other elements
  };

  return (
    // Ant Design Layout.Header component styled with custom CSS
    <Layout.Header style={headerStyles}>
      <Space align="center" size="middle">
        {/* CurrentUser component to display the logged-in user's avatar */}
        <CurrentUser />
      </Space>
    </Layout.Header>
  );
};

export default Header; // Exporting the Header component
