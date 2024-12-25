import React from "react";

import {
  CheckCircleOutlined,
  MinusCircleOutlined,
  PlayCircleFilled,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { Tag, TagProps } from "antd";

import { ContactStatus } from "@/graphql/schema.types";

type Props = {
  status: ContactStatus; // The contact status passed as a prop
};

/**
 * Renders a tag component representing the contact status.
 * @param status - The contact status.
 */
export const ContactStatusTag = ({ status }: Props) => {
  let icon: React.ReactNode = null; // Variable to hold the icon for the tag
  let color: TagProps["color"] = undefined; // Variable to hold the tag color

  // Switch case to determine the icon and color based on the contact status
  switch (status) {
    case "NEW":
    case "CONTACTED":
    case "INTERESTED":
      icon = <PlayCircleOutlined />; // Icon for statuses like NEW, CONTACTED, INTERESTED
      color = "cyan"; // Color for these statuses
      break;

    case "UNQUALIFIED":
      icon = <PlayCircleOutlined />; // Icon for UNQUALIFIED status
      color = "red"; // Color for UNQUALIFIED status
      break;

    case "QUALIFIED":
    case "NEGOTIATION":
      icon = <PlayCircleFilled />; // Icon for QUALIFIED or NEGOTIATION statuses
      color = "green"; // Color for these statuses
      break;

    case "LOST":
      icon = <PlayCircleFilled />; // Icon for LOST status
      color = "red"; // Color for LOST status
      break;

    case "WON":
      icon = <CheckCircleOutlined />; // Icon for WON status
      color = "green"; // Color for WON status
      break;

    case "CHURNED":
      icon = <MinusCircleOutlined />; // Icon for CHURNED status
      color = "red"; // Color for CHURNED status
      break;

    default:
      break; // Default case, no icon or color is assigned
  }

  return (
    // Renders a Tag component with the determined icon and color
    <Tag color={color} style={{ textTransform: "capitalize" }}>
      {icon} {status.toLowerCase()} {/* Displays the icon and the status in lowercase */}
    </Tag>
  );
};
