import { Skeleton } from "antd"; // Import Ant Design Skeleton component

// Define a skeleton placeholder for an accordion header
const AccordionHeaderSkeleton = () => {
  return (
    <div
      style={{
        display: "flex", // Arrange elements in a row
        alignItems: "center", // Vertically align items to the center
        gap: "8px", // Space between elements
        padding: "12px 24px", // Add padding inside the container
        borderBottom: "1px solid #d9d9d9", // Add a bottom border for separation
      }}
    >
      {/* Skeleton placeholder for an avatar */}
      <Skeleton.Avatar size="small" shape="square" />
      {/* Skeleton placeholder for text input */}
      <Skeleton.Input size="small" block style={{ height: "22px" }} />
    </div>
  );
};

export default AccordionHeaderSkeleton; // Export the skeleton component
