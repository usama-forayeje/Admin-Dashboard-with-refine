import { Space, Tag } from "antd";

import { User } from "@/graphql/schema.types";
import CustomAvatar from "../custom-avatar";

type Props = {
  user: User; // The user object containing information about the user
};

// Displays a user's avatar and name in a tag
export const UserTag = ({ user }: Props) => {
  return (
    <Tag
      key={user.id} // Unique key for each tag based on the user ID
      style={{
        padding: 2, // Padding inside the tag
        paddingRight: 8, // Adds extra padding to the right side
        borderRadius: 24, // Makes the tag rounded
        lineHeight: "unset", // Removes line height styling for custom alignment
        marginRight: "unset", // Removes margin on the right side
      }}
    >
      <Space size={4}> {/* Aligns the avatar and name with a 4px gap */}
        <CustomAvatar
          src={user.avatarUrl} // Avatar image URL from the user object
          name={user.name} // Name of the user to display in the avatar
          style={{ display: "inline-flex" }} // Makes the avatar inline-flex for proper alignment
        />
        {user.name} {/* Displays the user's name */}
      </Space>
    </Tag>
  );
};
