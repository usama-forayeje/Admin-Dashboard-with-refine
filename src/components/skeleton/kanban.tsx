import { Button, Skeleton, Space } from "antd";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";

// KanbanColumnSkeleton component, used to display a loading skeleton for a kanban column
const KanbanColumnSkeleton = ({ children }: React.PropsWithChildren) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column", // Aligns content in a vertical column
        padding: "0 16px", // Adds horizontal padding
      }}
    >
      <div
        style={{
          padding: "12px", // Adds padding around the header section
        }}
      >
        <Space
          style={{
            width: "100%", // Takes up full width
            justifyContent: "space-between", // Distributes elements with space between them
          }}
        >
          <Skeleton.Button size="small" style={{ width: "125px" }} /> {/* Skeleton button for loading state */}
          
          {/* Button for More options, currently disabled */}
          <Button
            disabled
            type="text"
            shape="circle"
            icon={
              <MoreOutlined
                style={{
                  transform: "rotate(90deg)", // Rotates the icon to make it horizontal
                }}
              />
            }
          />

          {/* Button for adding new items, currently disabled */}
          <Button disabled shape="circle" icon={<PlusOutlined />} />
        </Space>
      </div>

      <div
        style={{
          flex: 1, // Takes up remaining space
          border: "2px dashed transparent", // Dashed border for visual effect
          borderRadius: "4px", // Rounded corners for the border
        }}
      >
        <div
          style={{
            marginTop: "12px", // Adds margin on top
            display: "flex", // Flexbox layout for items inside
            flexDirection: "column", // Aligns items in a column
            gap: "8px", // Adds gap between each child element
          }}
        >
          {children} {/* Renders any child elements passed to this component */}
        </div>
      </div>
    </div>
  );
};

export default KanbanColumnSkeleton;
