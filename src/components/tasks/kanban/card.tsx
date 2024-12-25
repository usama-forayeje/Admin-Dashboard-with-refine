import CustomAvatar from '@/components/custom-avatar' // Custom avatar component for user images
import { Text } from '@/components/text' // Text component to render text with formatting options
import { TextIcon } from '@/components/text-icon' // Component to render text with icons
import { User } from '@/graphql/schema.types' // User type from GraphQL schema
import { getDateColor } from '@/utils' // Utility function to get the color for a date tag
import { ClockCircleOutlined, DeleteOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons' // Ant Design icons
import { useDelete, useNavigation } from '@refinedev/core' // Custom hooks from Refine library
import { Button, Card, ConfigProvider, Dropdown, MenuProps, Space, Tag, Tooltip, theme } from 'antd' // Ant Design components
import dayjs from 'dayjs' // Date utility for formatting and parsing dates
import React, { memo, useMemo } from 'react' // React hooks and utilities

type ProjectCardProps = {
  id: string, // Project card ID
  title: string, // Project title
  updatedAt: string, // Last update timestamp
  dueDate?: string, // Due date of the task (optional)
  users?: { // Array of users assigned to the project (optional)
    id: string,
    name: string,
    avatarUrl?: User['avatarUrl'] // URL for the user's avatar (optional)
  }[]
}

// The ProjectCard component renders an individual project card with task details.
const ProjectCard = ({ id, title, dueDate, users }: ProjectCardProps) => {
  const { token } = theme.useToken(); // Extract theme tokens for styling

  const { edit } = useNavigation(); // Hook to navigate to the project detail page
  const { mutate } = useDelete(); // Hook to delete the task

  // Memoized dropdown items to avoid re-rendering them unnecessarily
  const dropdownItems = useMemo(() => {
    const dropdownItems: MenuProps['items'] = [
      {
        label: 'View card',
        key: '1',
        icon: <EyeOutlined />,
        onClick: () => {
          edit('tasks', id, 'replace') // Navigate to the task detail page
        }
      },
      {
        danger: true,
        label: 'Delete card',
        key: '2',
        icon: <DeleteOutlined />,
        onClick: () => {
          mutate({
            resource: 'tasks', // Delete the task from 'tasks' resource
            id,
            meta: {
              operation: 'task' // Specify the operation type for deletion
            }
          })
        }
      }
    ]

    return dropdownItems
  }, []) // Dependency array is empty, meaning this will be calculated once and never re-calculated

  // Memoized logic for handling due date (if it exists)
  const dueDateOptions = useMemo(() => {
    if(!dueDate) return null; // Return null if there's no due date

    const date = dayjs(dueDate); // Parse the due date with dayjs

    return {
      color: getDateColor({ date: dueDate}) as string, // Get the color for the due date tag
      text: date.format('MMM DD') // Format the due date in 'MMM DD' format
    }
  }, [dueDate]); // Recalculate only when dueDate changes
  
  return (
    // ConfigProvider to customize the theme for specific Ant Design components
    <ConfigProvider
      theme={{
        components: {
          Tag: {
            colorText: token.colorTextSecondary, // Set color for text inside tags
          },
          Card: {
            headerBg: 'transparent', // Make card header background transparent
          }
        }
      }}
    >
      <Card
        size="small"
        title={<Text ellipsis={{tooltip: title}}>{title}</Text>} // Title with ellipsis and tooltip for overflowed text
        onClick={() => edit('tasks', id, 'replace')} // Navigate to task details on card click
        extra={ // Render the dropdown menu in the card header
          <Dropdown
            trigger={["click"]}
            menu={{
              items: dropdownItems,
              onPointerDown: (e) => {
                e.stopPropagation() // Prevent event propagation
              },
              onClick: (e) => {
                e.domEvent.stopPropagation() // Prevent event propagation for clicks
              }
            }}
            placement='bottom'
            arrow={{ pointAtCenter: true }} // Center the arrow of the dropdown
          >
            <Button 
              type="text"
              shape="circle"
              icon={
                <MoreOutlined
                  style={{
                    transform: 'rotate(90deg)' // Rotate the icon to the right
                  }}
                />
              }
              onPointerDown={(e) => {
                e.stopPropagation() // Prevent pointer down event propagation
              }}
              onClick={(e) => {
                e.stopPropagation() // Prevent click event propagation
              }}
            />
          </Dropdown>
        }
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <TextIcon style={{marginRight: '4px'}} /> {/* Render the TextIcon component */}
          {dueDateOptions && ( // Render due date tag if there's a due date
            <Tag
              icon={
                <ClockCircleOutlined style={{fontSize: '12px'}} />
              }
              style={{
                padding: '0 4px',
                marginInlineEnd: '0',
                backgroundColor: dueDateOptions.color === 'default' ? 'transparent' : 'unset',
              }}
              color={dueDateOptions.color} // Apply color to the tag based on due date status
              bordered={dueDateOptions.color !== 'default'} // Border only if color is not default
            >
              {dueDateOptions.text} {/* Display the formatted due date */}
            </Tag>
          )}
          {!!users?.length && ( // Render user avatars if users exist
            <Space
              size={4}
              wrap
              direction='horizontal'
              align="center"
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginLeft: 'auto',
                marginRight: 0,
              }}
            >
              {users.map((user) => ( // Map through the users array
                <Tooltip key={user.id} title={user.name}> {/* Tooltip with user name */}
                  <CustomAvatar name={user.name} src={user.avatarUrl} /> {/* Display user's avatar */}
                </Tooltip>
              ))}
            </Space>
          )}
        </div>
      </Card>
    </ConfigProvider>
  )
}

export default ProjectCard

// Memoize the component to prevent unnecessary re-renders
export const ProjectCardMemo = memo(ProjectCard, (prev, next) => {
  return (
    prev.id === next.id &&
    prev.title === next.title &&
    prev.dueDate === next.dueDate &&
    prev.users?.length === next.users?.length &&
    prev.updatedAt === next.updatedAt // Only re-render if props have changed
  )
})
