import { Text } from '@/components/text' // Custom Text component for displaying text
import { PlusOutlined } from '@ant-design/icons' // Ant Design icon for the "add" button
import { UseDroppableArguments, useDroppable } from '@dnd-kit/core' // Hooks for drag-and-drop functionality
import { Badge, Button, Space } from 'antd' // Ant Design components for UI layout

type Props = {
  id: string, // Column ID (unique identifier for the column)
  title: string, // Title of the column
  description?: React.ReactNode, // Optional description for the column
  count: number, // The count of items in the column
  data?: UseDroppableArguments['data'], // Data for the droppable zone (used in drag-and-drop)
  onAddClick?: (args: { id: string }) => void, // Callback when the "Add" button is clicked
}

const KanbanColumn = ({
  children, // Child elements to be rendered inside the column (e.g., task cards)
  id,
  title,
  description,
  count,
  data,
  onAddClick // Function to handle the "Add" button click
}: React.PropsWithChildren<Props>) => {
  // Hook to enable the column as a droppable area for drag-and-drop functionality
  const { isOver, setNodeRef, active } = useDroppable({ id, data })

  // Handler function for the "Add" button click
  const onAddClickHandler = () => {
    onAddClick?.({ id }) // Call the onAddClick function with the column's ID
  }

  return (
    <div
      ref={setNodeRef} // Set the ref for the droppable area
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '0 16px'
      }}
    >
      <div style={{ padding: '12px' }}>
        {/* Header section of the column */}
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          {/* Left side: Column title and item count */}
          <Space>
            <Text 
              ellipsis={{ tooltip: title }} // Show title with ellipsis and tooltip if it's too long
              size="xs"
              strong
              style={{ 
                textTransform: 'uppercase', // Make title uppercase
                whiteSpace: 'nowrap', // Prevent title from wrapping to multiple lines
              }}
            >
              {title}
            </Text>
            {/* Show item count as a badge, only if count is greater than zero */}
            {!!count && <Badge count={count} color="cyan" />}
          </Space>
          {/* Right side: "Add" button to add new items to the column */}
          <Button 
            shape="circle"
            icon={<PlusOutlined />}
            onClick={onAddClickHandler} // Handle click event to add an item
          />
        </Space>
        {/* Column description (if provided) */}
        {description}
      </div>
      
      {/* Droppable area for tasks/items */}
      <div
        style={{
          flex: 1,
          overflowY: active ? 'unset' : 'auto', // Show overflow scroll if not dragging
          border: '2px dashed transparent', // Border for the column when not hovering
          borderColor: isOver ? '#000040' : 'transparent', // Change border color when hovering over
          borderRadius: '4px' // Rounded corners
        }}
      >
        {/* Inner section for rendering child elements (task cards, etc.) */}
        <div
          style={{
            marginTop: "12px",
            display: 'flex',
            flexDirection: 'column',
            gap: '8px' // Spacing between child items
          }}
        >
          {children} {/* Render child components (tasks/cards) here */}
        </div>
      </div>
    </div>
  )
}

export default KanbanColumn
