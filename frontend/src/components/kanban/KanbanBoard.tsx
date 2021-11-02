import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import IBoard from "../../interfaces/IBoard";
import AddPostDialog from "./AddPostDialog";
import IColumn from "../../interfaces/IColumn";
import IPost, { IPostSubmission } from "../../interfaces/IPost";
import IUser from "../../interfaces/IUser";

interface IParam {
  id?: string;
}

interface IPositionUpdate {
  id: number;
  position: number;
  column: number;
}

export default function KanbanBoard() {
  let { id } = useParams<IParam>();
  const [board, setBoard] = useState<IBoard | undefined>();
  const [users, setUsers] = useState<IUser[]>([]);
  const [column, setColumn] = useState<IColumn | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = new Promise(async () => {
      fetch(`/api/board/${id}`).then(async (response) => {
        if (response.status === 401 || response.status === 204) {
          return;
        }
        try {
          const data: IBoard | undefined = await response.json();
          if (response.ok && data) {
            setBoard(data);
            Promise.resolve();
          } else {
            return Promise.reject(data);
          }
        } catch (err) {
          console.error(err);
          if (response.ok) {
            Promise.resolve();
          }
        }
      });
    });
    const fetchUsers = new Promise(async () => {
      fetch(`/api/user`).then(async (response) => {
        if (response.status === 401 || response.status === 204) {
          return;
        }
        try {
          const data: IUser[] | undefined = await response.json();
          if (response.ok && data) {
            setUsers(data);
            Promise.resolve();
          } else {
            return Promise.reject(data);
          }
        } catch (err) {
          console.error(err);
          if (response.ok) {
            Promise.resolve();
          }
        }
      });
    });

    Promise.all([fetchBoard, fetchUsers]).then(() => {
      setLoading(false);
    });
  }, []);

  function getPositionUpdate(post: IPost) {
    return {
      id: post.id,
      position: post.position,
      column: post.column,
    } as IPositionUpdate;
  }

  async function updatePositions(updates: IPositionUpdate[]) {
    console.log(updates);
    fetch(`/api/post/positions/`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ posts: updates }),
    }).then(async (response) => {
      if (response.status === 204) {
        console.log("Success!");
        return;
      }
    });
  }

  function onDragEnd({ destination, source }: DropResult) {
    if (destination) {
      const positionUpdate: IPositionUpdate[] = [];
      const destId = parseInt(destination.droppableId);
      const srcId = parseInt(source.droppableId);
      if (destId === srcId) {
        if (destination.index !== source.index) {
          const column = board.columns.find((c) => c.id === destId)!;
          const oldIndex = source.index;
          const newIndex = destination.index;
          const isAscending = source.index < destination.index;
          const newList = column.posts.map((post) => {
            // return unaffected posts
            if (
              post.position < Math.min(oldIndex, newIndex) ||
              post.position > Math.max(oldIndex, newIndex)
            )
              return post;

            let newPost: IPost = { ...post };
            if (post.position === source.index) {
              newPost.position = destination.index;
            } else if (isAscending) {
              newPost.position = post.position - 1;
            } else {
              newPost.position = post.position + 1;
            }

            positionUpdate.push(getPositionUpdate(newPost));
            return newPost;
          });
          const sortedPosts = newList.sort((a, b) => a.position - b.position);
          const newColumns = board.columns.map((col) => {
            if (col.id === destId) {
              return { ...col, posts: sortedPosts };
            } else {
              return col;
            }
          });
          setBoard({ ...board, columns: newColumns });
        }
      } else {
        const sourceColumn = board.columns.find((c) => c.id === srcId)!;
        const destinationColumn = board.columns.find((c) => c.id === destId)!;
        const newDestinationPosts = destinationColumn.posts.map((p) => {
          if (p.position >= destination.index) {
            let newPost = { ...p, position: p.position + 1 };

            positionUpdate.push(getPositionUpdate(newPost));
            return newPost;
          } else {
            return p;
          }
        });
        const sourcePost = sourceColumn.posts.find(
          (p) => p.position === source.index
        )!;
        const newSourcePost = {
          ...sourcePost,
          position: destination.index,
          column: destId,
        };
        positionUpdate.push(getPositionUpdate(newSourcePost));
        newDestinationPosts.push(newSourcePost);
        const sortedDestinationPosts = newDestinationPosts.sort(
          (a, b) => a.position - b.position
        );
        const newSourcePosts = sourceColumn.posts
          .filter((p) => p.position !== source.index)
          .map((p) => {
            if (p.position >= source.index) {
              let newPost = { ...p, position: p.position - 1 };

              positionUpdate.push(getPositionUpdate(newPost));
              return newPost;
            } else {
              return p;
            }
          });
        const newColumnList = board.columns.map((col) => {
          if (col.id === srcId) {
            return { ...sourceColumn, posts: newSourcePosts };
          } else if (col.id === destId) {
            return { ...destinationColumn, posts: sortedDestinationPosts };
          } else {
            return col;
          }
        });
        setBoard({ ...board, columns: newColumnList });
      }
      updatePositions(positionUpdate);
    }
  }

  const addNewPost = (post: IPostSubmission) => {
    setLoading(true);
    fetch(`/api/post/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    }).then(async (response) => {
      if (response.status === 401 || response.status === 204) {
        console.log("Success!");
        return;
      }
      try {
        const data: IPost | undefined = await response.json();
        if (response.ok && data) {
          // TODO: Update all positions
          // TODO: Add response to list
          const newPostList = column.posts.map((p) => ({
            ...p,
            position: p.position + 1,
          }));
          newPostList.unshift(data);
          setBoard({
            ...board,
            columns: board.columns.map((c) => {
              if (c.id === column.id) {
                return { ...column, posts: newPostList };
              }
              return c;
            }),
          });
          setColumn(null);
          setLoading(false);
        } else {
          setLoading(false);
          return Promise.reject(data);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
        if (response.ok) {
          return true;
        }
      }
    });
  };

  if (!board) return null;

  return (
    <>
      <h1>{board.name}</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={2}>
          {board.columns &&
            board.columns.map((col) => {
              return (
                <Grid item sx={{ width: 300 }} key={col.id}>
                  <Paper sx={{ backgroundColor: "green", p: 2 }}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      {col.name}
                    </Typography>
                    <Button
                      sx={{ width: "100%" }}
                      variant="outlined"
                      color="secondary"
                      startIcon={<Add />}
                      onClick={() => setColumn(col)}
                    >
                      Add
                    </Button>

                    <Droppable type="FIELD" droppableId={col.id.toString()}>
                      {(provided, _) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          sx={{ minHeight: 150, pt: 1 }}
                        >
                          {col.posts.map((post, index) => {
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
                                        {post.assigned
                                          ? `Assigned: ${post.assigned.first_name} ${post.assigned?.last_name}`
                                          : "Unassigned"}
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
                        </Box>
                      )}
                    </Droppable>
                  </Paper>
                </Grid>
              );
            })}
        </Grid>
      </DragDropContext>
      {column && (
        <AddPostDialog column={column} users={users} savePost={addNewPost} />
      )}
    </>
  );
}
