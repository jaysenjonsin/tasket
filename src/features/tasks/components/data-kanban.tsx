import React, { useCallback, useEffect, useState } from 'react';
import { Task, TaskStatus } from '../types';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { KanbanColumnHeader } from './kanban-column-header';
import { KanbanCard } from './kanban-card';

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

type TasksState = {
  [key in TaskStatus]: Task[];
};

interface DataKanbanProps {
  data: Task[];
}

export const DataKanban = ({ data }: DataKanbanProps) => {
  const [tasks, setTasks] = useState<TasksState>(() => {
    const initialTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    //push each task into appropriate column based on status
    data.forEach((task) => {
      initialTasks[task.status].push(task);
    });

    //sort tasks within each column based on position
    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as TaskStatus].sort(
        (a, b) => a.position - b.position
      );
    });

    return initialTasks;
  });

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    const sourceStatus = source.droppableId as TaskStatus;
    const destStatus = destination.droppableId as TaskStatus;

    let updatesPayload: {
      $id: string;
      status: TaskStatus;
      position: number;
    }[] = [];

    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };

      //remove task from source column
      const sourceColumn = [...newTasks[sourceStatus]];
      const [movedTask] = sourceColumn.splice(source.index, 1);

      //if no moved task, return previous (this should never happen)
      if (!movedTask) {
        console.error('no task found at source index');
        return prevTasks;
      }

      //create new task w/ potentially updated status
      const updatedMovedTask =
        //did we change status or are we just moving it up/down in the same column
        sourceStatus !== destStatus
          ? { ...movedTask, status: destStatus } //update status
          : movedTask; //keeps same status just reordered in the same column

      //update source column
      //ex. if we moved task from TODO to IN_PROGRESS, we need to update the task in TODO
      newTasks[sourceStatus] = sourceColumn;

      //add task to destination column
      //ex. if we moved task from TODO to IN_PROGRESS, we need to add the task to IN_PROGRESS
      const destColumn = [...newTasks[destStatus]];
      destColumn.splice(destination.index, 0, updatedMovedTask);
      newTasks[destStatus] = destColumn;

      //prepare minimal update payloads
      updatesPayload = [];

      //update the moved task
      //ex. if we moved task from TODO to IN_PROGRESS, we need to update the task in IN_PROGRESS
      updatesPayload.push({
        $id: movedTask.$id,
        status: destStatus,
        position: Math.min((destination.index + 1) * 1000, 1000000),
      });

      //update positions for affected tasks in the destination column
      //ex. if we moved task from TODO to IN_PROGRESS, we need to update positions of all tasks in IN_PROGRESS
      newTasks[destStatus].forEach((task, index) => {
        if (task && task.$id !== updatedMovedTask.$id) {
          const newPosition = Math.min((index + 1) * 1000, 1000000);
          if (task.position !== newPosition) {
            updatesPayload.push({
              $id: task.$id,
              status: destStatus,
              position: newPosition,
            });
          }
        }
      });

      //if task moved between columns, update positions in the source column
      //ex. if we moved task from TODO to IN_PROGRESS, we need to update positions of all tasks in TODO
      if (sourceStatus !== destStatus) {
        newTasks[sourceStatus].forEach((task, index) => {
          if (task && task.$id !== updatedMovedTask.$id) {
            const newPosition = Math.min((index + 1) * 1000, 1000000);
            if (task.position !== newPosition) {
              updatesPayload.push({
                $id: task.$id,
                status: sourceStatus,
                position: newPosition,
              });
            }
          }
        });
      }

      return newTasks;
    });
  }, []);

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className='flex overflow-x-auto'>
        {boards.map((board) => {
          return (
            <div
              key={board}
              className='flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]'
            >
              <KanbanColumnHeader
                board={board}
                taskCount={tasks[board].length}
              />
              <Droppable droppableId={board}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className='min-h-[200px] py-1.5'
                  >
                    {tasks[board].map((task, index) => (
                      <Draggable
                        key={task.$id}
                        draggableId={task.$id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className='mb-1.5'
                          >
                            <KanbanCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {/* This is a placeholder for the draggable items */}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
