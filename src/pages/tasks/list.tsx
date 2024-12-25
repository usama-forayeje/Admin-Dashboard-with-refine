import { KanbanColumnSkeleton, ProjectCardSkeleton } from '@/components'; // Skeleton components for loading state
import { KanbanAddCardButton } from '@/components/tasks/kanban/add-card-button'; // Button to add a new card
import { KanbanBoard, KanbanBoardContainer } from '@/components/tasks/kanban/board'; // Board container and main board
import { ProjectCardMemo } from '@/components/tasks/kanban/card'; // Component to render individual task cards
import KanbanColumn from '@/components/tasks/kanban/column'; // Column component for Kanban board
import KanbanItem from '@/components/tasks/kanban/item'; // Item component representing a single task in the Kanban board
import { UPDATE_TASK_STAGE_MUTATION } from '@/graphql/mutations'; // GraphQL mutation to update task stage
import { TASKS_QUERY, TASK_STAGES_QUERY } from '@/graphql/queries'; // Queries to fetch tasks and task stages
import { TaskStagesQuery, TasksQuery } from '@/graphql/types'; // Types for tasks and task stages
import { DragEndEvent } from '@dnd-kit/core'; // Drag-and-drop event types
import { useList, useNavigation, useUpdate } from '@refinedev/core'; // Refine hooks for data fetching, navigation, and updates
import { GetFieldsFromList } from '@refinedev/nestjs-query'; // Utility to extract fields from list query response
import React from 'react'; // React library import

// Defining the Task and TaskStage types using the queries' types
type Task = GetFieldsFromList<TasksQuery>;
type TaskStage = GetFieldsFromList<TaskStagesQuery> & { tasks: Task[] };

// Main List component rendering the Kanban board and tasks
const List = ({ children }: React.PropsWithChildren) => {
  const { replace } = useNavigation(); // Hook to handle navigation between pages

  // Fetch task stages and tasks using the useList hook from Refine
  const { data: stages, isLoading: isLoadingStages } = useList<TaskStage>({
    resource: 'taskStages',
    filters: [
      {
        field: 'title',
        operator: 'in',
        value: ['TODO', 'IN PROGRESS', 'IN REVIEW', 'DONE'], // Filtering task stages by specific titles
      }
    ],
    sorters: [
      {
        field: 'createdAt', // Sorting task stages by creation date
        order: 'asc'
      }
    ],
    meta: {
      gqlQuery: TASK_STAGES_QUERY, // Specifying the GraphQL query for fetching task stages
    }
  });

  // Fetch tasks based on the stages
  const { data: tasks, isLoading: isLoadingTasks } = useList<GetFieldsFromList<TasksQuery>>({
    resource: 'tasks',
    sorters: [
      {
        field: 'dueDate', // Sorting tasks by due date
        order: 'asc',
      }
    ],
    queryOptions: {
      enabled: !!stages, // Ensures tasks are fetched only after task stages are loaded
    },
    pagination: {
      mode: 'off' // No pagination for tasks
    },
    meta: {
      gqlQuery: TASKS_QUERY, // Specifying the GraphQL query for fetching tasks
    }
  });

  // Using the useUpdate hook for task update mutation
  const { mutate: updateTask } = useUpdate();

  // Memoizing the task stages and organizing tasks by their stage
  const taskStages = React.useMemo(() => {
    if (!tasks?.data || !stages?.data) {
      return {
        unassignedStage: [], // Empty array for unassigned tasks
        stages: []
      };
    }

    const unassignedStage = tasks.data.filter((task) => task.stageId === null); // Filter unassigned tasks

    // Group tasks by their respective stages
    const grouped: TaskStage[] = stages.data.map((stage) => ({
      ...stage,
      tasks: tasks.data.filter((task) => task.stageId?.toString() === stage.id)
    }));

    return {
      unassignedStage, // Tasks not assigned to any stage
      columns: grouped // Grouped tasks for each stage
    };
  }, [stages, tasks]); // Recompute when tasks or stages change

  // Handle adding a new card to a specific stage
  const handleAddCard = (args: { stageId: string }) => {
    const path = args.stageId === 'unassigned' 
      ? '/tasks/new' // Path for creating a new task without assigning a stage
      : `/tasks/new?stageId=${args.stageId}`; // Path for creating a new task in a specific stage

    replace(path); // Navigate to the new task creation page
  };

  // Handle drag-and-drop events to update task stage
  const handleOnDragEnd = (event: DragEndEvent) => {
    let stageId = event.over?.id as undefined | string | null; // Get the target stage ID
    const taskId = event.active.id as string; // Get the dragged task ID
    const taskStageId = event.active.data.current?.stageId; // Get the current stage ID of the dragged task

    if (taskStageId === stageId) return; // No update if the stage is the same

    if (stageId === 'unassigned') {
      stageId = null; // If the task is dropped in 'unassigned' stage, set stageId to null
    }

    // Update the task's stage using the mutation
    updateTask({
      resource: 'tasks',
      id: taskId,
      values: {
        stageId: stageId,
      },
      successNotification: false, // Disable success notification
      mutationMode: 'optimistic', // Optimistic updates for better UX
      meta: {
        gqlMutation: UPDATE_TASK_STAGE_MUTATION, // GraphQL mutation to update task stage
      }
    });
  };

  // Check if tasks or stages are still loading
  const isLoading = isLoadingStages || isLoadingTasks;

  if (isLoading) return <PageSkeleton />; // Render loading skeleton while data is being fetched

  return (
    <>
      <KanbanBoardContainer>
        <KanbanBoard onDragEnd={handleOnDragEnd}> {/* Kanban board container */}
          {/* Unassigned tasks column */}
          <KanbanColumn
            id="unassigned"
            title={"unassigned"}
            count={taskStages.unassignedStage.length || 0} // Display the count of unassigned tasks
            onAddClick={() => handleAddCard({ stageId: 'unassigned' })} // Add a task to unassigned stage
          >
            {/* Map over unassigned tasks and render each task */}
            {taskStages.unassignedStage.map((task) => (
              <KanbanItem key={task.id} id={task.id} data={{ ...task, stageId: 'unassigned' }}>
                <ProjectCardMemo {...task} dueDate={task.dueDate || undefined} />
              </KanbanItem>
            ))}
            
            {/* Show 'Add Card' button if there are no tasks */}
            {!taskStages.unassignedStage.length && (
              <KanbanAddCardButton onClick={() => handleAddCard({ stageId: 'unassigned' })} />
            )}
          </KanbanColumn>

          {/* Render columns for each task stage */}
          {taskStages.columns?.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              count={column.tasks.length}
              onAddClick={() => handleAddCard({ stageId: column.id })} // Add a task to this stage
            >
              {/* Map over tasks for each stage */}
              {!isLoading && column.tasks.map((task) => (
                <KanbanItem key={task.id} id={task.id} data={task}>
                  <ProjectCardMemo {...task} dueDate={task.dueDate || undefined} />
                </KanbanItem>
              ))}
              {/* Show 'Add Card' button if there are no tasks */}
              {!column.tasks.length && (
                <KanbanAddCardButton onClick={() => handleAddCard({ stageId: column.id })} />
              )}
            </KanbanColumn>
          ))}
        </KanbanBoard>
      </KanbanBoardContainer>
      {children} {/* Render children components if any */}
    </>
  );
};

export default List;

// Page skeleton component for loading state
const PageSkeleton = () => {
  const columnCount = 6; // Number of columns
  const itemCount = 4; // Number of items in each column

  return (
    <KanbanBoardContainer>
      {/* Render skeleton columns with skeleton items */}
      {Array.from({ length: columnCount }).map((_, index) => (
        <KanbanColumnSkeleton key={index}>
          {Array.from({length: itemCount}).map((_, index) => (
           <ProjectCardSkeleton key={index} />
          ))}
        </KanbanColumnSkeleton>
      ))}
    </KanbanBoardContainer>
  );
};
