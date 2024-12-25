import CustomAvatar from "./custom-avatar";  // Custom avatar component
import { Text } from "./text";  // Custom text component

type Props = {
  name: string;  // Name of the user to display
  avatarUrl?: string;  // Optional avatar image URL
  shape?: 'circle' | 'square';  // Optional shape of the avatar ('circle' or 'square')
}

const SelectOptionWithAvatar = ({ avatarUrl, name, shape }: Props) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',  // Space between the avatar and the name
      }}
    >
      {/* Custom avatar component that takes in shape, name, and avatarUrl */}
      <CustomAvatar shape={shape} name={name} src={avatarUrl} />
      {/* Text component to display the name */}
      <Text>{name}</Text>
    </div>
  );
}

export default SelectOptionWithAvatar;
