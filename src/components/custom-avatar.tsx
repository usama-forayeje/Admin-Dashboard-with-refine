import { getNameInitials } from "@/utils";
import { Avatar as AntdAvatar } from "antd"

interface Props {
  name?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

function CustomAvatar({name, style, ...rest}: Props) {
  return (
    <AntdAvatar alt={name} size='small' style={{backgroundColor: '#87d068', display: 'flex' , alignItems: 'center', border: 'none', ...style}} {...rest}>
        {getNameInitials(name || "")}
    </AntdAvatar>
  )
}

export default CustomAvatar