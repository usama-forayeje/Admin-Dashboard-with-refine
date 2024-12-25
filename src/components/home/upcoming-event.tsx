import { CalendarOutlined } from "@ant-design/icons"; // Import calendar icon
import { Badge, Card, List } from "antd"; // Import UI components from Ant Design
import { Text } from "../text"; // Custom Text component
import UpcomingEventsSkeleton from "../skeleton/upcoming-events"; // Skeleton loader for events
import { getDate } from "@/utils/helpers"; // Helper function to format dates
import { useList } from "@refinedev/core"; // Hook to fetch and manage list data
import { DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY } from "@/graphql/queries"; // GraphQL query for upcoming events
import dayjs from "dayjs"; // Library for handling dates

const UpcomingEvents = () => {
  // Fetch events from the server
  const { data, isLoading } = useList({
    resource: "events", // Resource name
    pagination: { pageSize: 5 }, // Show only 5 events
    sorters: [
      {
        field: "startDate", // Sort by start date
        order: "asc", // Ascending order
      },
    ],
    filters: [
      {
        field: "startDate", // Filter events
        operator: "gte", // Where start date is greater than or equal to
        value: dayjs().format("YYYY-MM-DD"), // Today's date
      },
    ],
    meta: {
      gqlQuery: DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY, // GraphQL query for events
    },
  });

  return (
    <Card
      style={{ height: "100%" }} // Full height card
      headStyle={{ padding: "8px 16px" }} // Header padding
      bodyStyle={{ padding: "0 1rem" }} // Body padding
      title={
        // Card header with an icon and title
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <CalendarOutlined />
          <Text size="sm" style={{ marginLeft: "0.7rem" }}>
            Upcoming Events
          </Text>
        </div>
      }
    >
      {/* Show a loading skeleton if data is being fetched */}
      {isLoading ? (
        <List
          itemLayout="horizontal"
          dataSource={Array.from({ length: 5 }).map((_, index) => ({
            id: index,
          }))}
          renderItem={() => <UpcomingEventsSkeleton />}
        />
      ) : (
        // Show the list of events when data is available
        <List
          itemLayout="horizontal"
          dataSource={data?.data || []} // Use fetched data or an empty array
          renderItem={(item) => {
            const renderDate = getDate(item.startDate, item.endDate); // Format start and end dates
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={<Badge color={item.color} />} // Badge with the event's color
                  title={<Text size="xs"> {renderDate}</Text>} // Render event date
                  description={
                    // Render event title with ellipsis
                    <Text ellipsis={{ tooltip: true }} strong>
                      {item.title}
                    </Text>
                  }
                />
              </List.Item>
            );
          }}
        />
      )}

      {/* Show a message if no events are available */}
      {!isLoading && data?.data.length === 0 && (
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "220px",
          }}
        >
          No upcoming events
        </span>
      )}
    </Card>
  );
};

export default UpcomingEvents;
