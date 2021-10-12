import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";

interface IItem {
  id: number;
  text: string;
  position: number;
}

export default function KanbanBoard() {
  const [list, setList] = useState<IItem[]>([
    { id: 6, text: "Id 6", position: 0 },
    { id: 1, text: "Id 1", position: 1 },
    { id: 2, text: "Id 2", position: 2 },
    { id: 3, text: "Id 3", position: 3 },
    { id: 4, text: "Id 4", position: 4 },
    { id: 5, text: "Id 5", position: 5 },
  ]);

  function onDragEnd({ destination, source }: DropResult) {
    if (destination && destination.index !== source.index) {
      const oldIndex = source.index;
      const newIndex = destination.index;
      const isAscending = source.index < destination.index;
      const newList = list.map((item) => {
        // return unaffected items
        if (
          item.position < Math.min(oldIndex, newIndex) ||
          item.position > Math.max(oldIndex, newIndex)
        )
          return item;

        if (item.position === source.index) {
          return {
            ...item,
            position: destination.index,
          };
        }

        if (isAscending) {
          return {
            ...item,
            position: item.position - 1,
          };
        } else {
          return {
            ...item,
            position: item.position + 1,
          };
        }
      });
      const newListSorted = newList.sort((a, b) => a.position - b.position);
      setList(newListSorted);
    }
  }

  return (
    <div>
      <h1>KANBAN!</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable type="FIELD" droppableId="FIELD">
          {(provided, _) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {list.map((item, index) => {
                return (
                  <Draggable
                    key={item.id}
                    draggableId={item.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        <Box
                          sx={{
                            width: 200,
                            height: 30,
                            p: 1,
                            m: 1,
                            backgroundColor: "pink",
                            border: "solid grey 1px",
                          }}
                        >
                          <Typography>{item.text}</Typography>
                        </Box>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
function userState(): [any, any] {
  throw new Error("Function not implemented.");
}
