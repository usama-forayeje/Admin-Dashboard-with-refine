import { Badge, List, Skeleton } from "antd";

// UpcomingEventsSkeleton component, used to display a loading skeleton for upcoming events
const UpcomingEventsSkeleton = () => {
  return (
    <List.Item>
      {/* List item meta data */}
      <List.Item.Meta
        avatar={<Badge color="transparent" />} // Placeholder for the avatar, using a transparent badge as a placeholder
        title={
          // Skeleton button as a placeholder for the event title
          <Skeleton.Button
            active // Adds animation to show it's loading
            style={{
              height: "14px", // Sets the height of the skeleton button
            }}
          />
        }
        description={
          // Skeleton button as a placeholder for the event description
          <Skeleton.Button
            active // Adds animation to show it's loading
            style={{
              width: "300px", // Sets the width of the skeleton button
              marginTop: "8px", // Adds margin on top to space out from the title
              height: "16px", // Sets the height of the skeleton button
            }}
          />
        }
      />
    </List.Item>
  );
};

export default UpcomingEventsSkeleton;
