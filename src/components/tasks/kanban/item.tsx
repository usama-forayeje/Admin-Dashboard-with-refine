import { DragOverlay, UseDraggableArguments, useDraggable } from '@dnd-kit/core' // Import necessary hooks and components for drag-and-drop functionality

interface Props {
  id: string; // The unique identifier for the item
  data?: UseDraggableArguments['data']; // Additional data associated with the item (optional)
}

const KanbanItem = ({ children, id, data }: React.PropsWithChildren<Props>) => {
  // Use the useDraggable hook to enable drag-and-drop functionality for the item
  const { attributes, listeners, setNodeRef, active } = useDraggable({
    id, // The unique identifier of the draggable item
    data, // Optional additional data for the draggable item
  })

  return (
    <div style={{ position: 'relative' }}> {/* Container for the draggable item */}
      
      {/* Draggable item itself */}
      <div
        ref={setNodeRef} // Associate the item with the draggable node
        {...attributes} // Spread the necessary attributes to make the item draggable
        {...listeners} // Spread the event listeners (e.g., onMouseDown, onTouchStart)
        style={{
          opacity: active ? (active.id === id ? 1 : 0.5) : 1, // Set opacity to highlight the active (dragged) item
          borderRadius: '8px', // Rounded corners for the item
          position: 'relative', // Positioning relative to its container
          cursor: 'grab', // Change the cursor to a "grab" symbol when hovering over the item
        }}
      >
        
        {/* Drag overlay displayed only when the item is actively being dragged */}
        {active?.id === id && (
          <DragOverlay zIndex={1000}> {/* The overlay will appear on top of other elements */}
            <div style={{
              borderRadius: '8px',
              boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px', // Light shadow for the dragged item
              cursor: 'grabbing', // Change the cursor to "grabbing" while the item is being dragged
            }}>
              {children} {/* Render the draggable content (child components) */}
            </div>
          </DragOverlay>
        )}

        {/* Regular item rendering (not dragged) */}
        {children} {/* Render the regular content of the Kanban item */}
      </div>
    </div>
  )
}

export default KanbanItem
