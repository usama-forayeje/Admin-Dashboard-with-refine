import { Card, Skeleton } from "antd"; // Import Card and Skeleton from Ant Design
import { Text } from "../text"; // Custom Text component
import { Area, AreaConfig } from "@ant-design/plots"; // Area chart component
import { totalCountVariants } from "@/constant"; // Data configuration based on resource type

// Define the props (inputs) for the component
type Props = {
  resource: "companies" | "contacts" | "deals"; // Type of resource
  isLoading: boolean; // Whether data is still loading
  totalCount?: number; // Total count to display
};

const DashboardTotalCountCard = ({ resource, isLoading, totalCount }: Props) => {
  // Get color, icon, and title based on the resource type
  const { primaryColor, secondaryColor, icon, title } = totalCountVariants[resource];

  // Configuration for the area chart
  const config: AreaConfig = {
    data: totalCountVariants[resource].data, // Chart data for the resource
    xField: "index", // Field for the x-axis
    yField: "value", // Field for the y-axis
    appendPadding: [1, 0, 0, 0], // Extra padding for the chart
    padding: 0, // No internal padding
    syncViewPadding: true, // Synchronize chart padding
    autoFit: true, // Make the chart fit its container
    tooltip: false, // Disable tooltips
    animation: false, // Turn off animations
    xAxis: false, // Hide the x-axis
    yAxis: {
      tickCount: 12, // Number of ticks (labels) on the y-axis
      label: {
        style: {
          stroke: "transparent", // Make labels invisible
        },
      },
      grid: {
        line: {
          style: {
            stroke: "transparent", // Make grid lines invisible
          },
        },
      },
    },
    smooth: true, // Smooth out the chart lines
    line: {
      color: primaryColor, // Line color based on resource type
    },
    areaStyle: () => {
      return {
        fill: `l(270) 0:#fff 0.2:${secondaryColor} 1:${primaryColor}`, // Gradient fill for the area
      };
    },
  };

  return (
    <Card
      style={{ height: "96px", padding: 0 }} // Card height and padding
      bodyStyle={{ padding: "8px 8px 8px 12px" }}
      size="small"
    >
      {/* Header of the card */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}>
        {icon}
        <Text size="md" className="secondary" style={{ marginLeft: "8px" }}>
          {title} {/* Title based on the resource type */}
        </Text>
      </div>

      {/* Body of the card */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Text
          size="xxxl"
          strong
          style={{
            flex: 1, // Text takes up available space
            whiteSpace: "nowrap", // Prevent text wrapping
            flexShrink: 0, // Prevent shrinking of the text
            textAlign: "start", // Align text to the start (left)
            marginLeft: "48px", // Add space from the left
            fontVariantNumeric: "tabular-nums", // Use tabular (even-spaced) numbers
          }}
        >
          {isLoading ? (
            // Show a skeleton loader if data is loading
            <Skeleton.Button
              style={{
                marginTop: "8px",
                width: "74px", // Width of the skeleton
              }}
            />
          ) : (
            totalCount // Display the total count when data is loaded
          )}
        </Text>

        {/* Area chart */}
        <Area {...config} style={{ width: "50%" }} />
      </div>
    </Card>
  );
};

export default DashboardTotalCountCard;
