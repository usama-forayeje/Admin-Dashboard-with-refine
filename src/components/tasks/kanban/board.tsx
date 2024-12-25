import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core' // Import drag-and-drop libraries from dnd-kit
import React from 'react'

// KanbanBoardContainer: This component wraps the children components and sets up the container's layout.
export const KanbanBoardContainer = ({ children }: React.PropsWithChildren) => {
  return (
    <div
      style={{
        width: 'calc(100% + 64px)', // Set width to extend beyond the normal container width
        height: 'calc(100vh - 64px)', // Set height to fill the screen minus 64px
        display: 'flex', // Use flexbox for layout
        justifyContent: 'column', // Align children vertically (this seems a typo since there is no "column" property)
        margin: '-32px', // Add negative margin to adjust positioning
      }}
    >
      <div
        style={{
          width: '100%', // Make inner container take up full width
          height: '100%', // Make inner container take up full height
          display: 'flex', // Use flexbox for the layout inside the inner container
          padding: '32px', // Add padding inside the container
          overflow: 'scroll', // Enable scrolling if content overflows
        }}
      >
        {children} {/* Render the children components */}
      </div>
    </div>
  )
}

// KanbanBoard: This component enables drag-and-drop functionality with DnD kit.
type Props = {
  onDragEnd: (event: DragEndEvent) => void; // Callback function when drag ends
}

export const KanbanBoard = ({ children, onDragEnd }: React.PropsWithChildren<Props>) => {
  // Set up mouse sensor for drag-and-drop interactions with mouse
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5, // Activate dragging when mouse moves 5px
    },
  })

  // Set up touch sensor for drag-and-drop interactions on touch devices
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      distance: 5, // Activate dragging when touch moves 5px
    }
  })

  // Combine the sensors for mouse and touch interactions
  const sensors = useSensors(mouseSensor, touchSensor)

  return (
    // Wrap children inside the DndContext to enable drag-and-drop functionality
    <DndContext onDragEnd={onDragEnd} sensors={sensors}>
      {children} {/* Render the children components */}
    </DndContext>
  )
}
