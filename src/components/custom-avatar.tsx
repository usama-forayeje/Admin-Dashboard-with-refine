import { getNameInitials } from "@/utils";  // Utility function to get initials from name
import { Avatar as AntdAvatar } from "antd"; // Ant Design Avatar component

interface Props {
  name?: string;            // The name used to generate initials (optional)
  style?: React.CSSProperties;  // Optional custom styles for the avatar
  [key: string]: any;      // Spread additional props for the Antd Avatar component
}

function CustomAvatar({name, style, ...rest}: Props) {
  return (
    <AntdAvatar 
      alt={name} 
      size='small'  // Set the avatar size to small
      style={{
        backgroundColor: '#87d068', // Light green background color
        display: 'flex', 
        alignItems: 'center', // Align initials inside the avatar
        border: 'none',       // No border
        ...style              // Spread additional styles passed via the `style` prop
      }} 
      {...rest}  // Pass down all other props to the Antd Avatar component
    >
      {getNameInitials(name || "")}  // Render initials from the `name` or fallback to an empty string
    </AntdAvatar>
  );
}

export default CustomAvatar;
