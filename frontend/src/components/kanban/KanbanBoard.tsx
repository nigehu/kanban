import { Typography, Paper } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import IBoard from "../../interfaces/IBoard";

interface IItem {
  id: number;
  text: string;
  position: number;
}

interface IParam {
  id?: string;
}

const testList: IItem[] = [
  { id: 6, text: "Id 6", position: 0 },
  { id: 1, text: "Id 1", position: 1 },
  { id: 2, text: "Id 2", position: 2 },
  { id: 3, text: "Id 3", position: 3 },
  { id: 4, text: "Id 4", position: 4 },
  { id: 5, text: "Id 5", position: 5 },
];

export default function KanbanBoard() {
  let { id } = useParams<IParam>();
  const [list, setList] = useState<IItem[]>(testList);
  const [board, setBoard] = useState<IBoard | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      fetch(`/api/board/${id}`).then(async (response) => {
        if (response.status === 401 || response.status === 204) {
          return;
        }
        try {
          const data: IBoard | undefined = await response.json();
          if (response.ok && data) {
            setBoard(data);
            setLoading(false);
          } else {
            return Promise.reject(data);
          }
        } catch (err) {
          console.error(err);
          if (response.ok) {
            return true;
          }
        }
      });
    };

    fetchData();
  }, []);

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

  if (!board) return null;

  return (
    <>
      <h1>{board.name}</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        {board.columns &&
          board.columns.map((column) => {
            return (
              <>
                <Typography>{column.name}</Typography>
                <Droppable type="FIELD" droppableId="FIELD">
                  {(provided, _) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {column.posts.map((post, index) => {
                        return (
                          <Draggable
                            key={post.id}
                            draggableId={post.id.toString()}
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
                                    p: 1,
                                    m: 1,
                                    backgroundColor: "pink",
                                    border: "solid grey 1px",
                                  }}
                                >
                                  <Typography variant="subtitle1">
                                    {post.title}
                                  </Typography>
                                  <Typography>
                                    Assigned:
                                    {` ${post.assigned.first_name} ${post.assigned.last_name}`}
                                  </Typography>
                                  <Box
                                    sx={{
                                      width: "100%",
                                      position: "relative",
                                      height: "3.6em",
                                      overflow: "hidden",
                                      "&:after": {
                                        content: '""',
                                        textAlign: "right",
                                        position: "absolute",
                                        bottom: 0,
                                        right: 0,
                                        width: "80%",
                                        height: "1.2em",
                                        background:
                                          "linear-gradient(to right, rgba(255, 192, 203, 0), rgba(255, 192, 203, 1) 85%)",
                                      },
                                    }}
                                  >
                                    <Typography variant="body2">
                                      {post.description}
                                    </Typography>
                                  </Box>
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
              </>
            );
          })}
      </DragDropContext>
    </>
  );
}
function userState(): [any, any] {
  throw new Error("Function not implemented.");
}
