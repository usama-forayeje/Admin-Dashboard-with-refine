import { List, Skeleton } from "antd";

// LatestActivitiesSkeleton component, used to display a loading skeleton for activity list items
const LatestActivitiesSkeleton = () => {
  return (
    <List.Item>
      {/* List item meta data */}
      <List.Item.Meta
        avatar={ 
          // Skeleton avatar as a placeholder for the user image
          <Skeleton.Avatar
            active // Adds animation to show it's loading
            size={48} // Avatar size
            shape="square" // Makes the avatar square
            style={{
              borderRadius: "4px", // Rounded corners for the avatar
            }}
          />
        }
        title={ 
          // Skeleton button as a placeholder for the title
          <Skeleton.Button
            active // Adds animation to show it's loading
            style={{
              height: "16px", // Sets the height of the skeleton button
            }}
          />
        }
        description={ 
          // Skeleton button as a placeholder for the description
          <Skeleton.Button
            active // Adds animation to show it's loading
            style={{
              width: "300px", // Sets the width of the skeleton button
              height: "16px", // Sets the height of the skeleton button
            }}
          />
        }
      />
    </List.Item>
  );
};

export default LatestActivitiesSkeleton;
