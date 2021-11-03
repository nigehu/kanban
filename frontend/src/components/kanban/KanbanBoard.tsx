import { Add } from "@mui/icons-material";
import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import { getBoard } from "../../api/board";
import { getUserList } from "../../api/user";
import {
  createPost,
  deletePost,
  patchPositions,
  updatePost,
} from "../../api/post";
import IBoard from "../../interfaces/IBoard";
import IColumn from "../../interfaces/IColumn";
import IPost, {
  IPostSubmission,
  IPostUpdate,
  IPostPositionUpdate,
} from "../../interfaces/IPost";
import IUser from "../../interfaces/IUser";
import AddPostDialog from "./AddPostDialog";
import KanbanPost from "./KanbanPost";
import KanbanColumn from "./KanbanColumn";
import { useDebouncedCallback } from "use-debounce/lib";

interface IParam {
  id?: string;
}

export default function KanbanBoard() {
  let { id } = useParams<IParam>();
  const [board, setBoard] = useState<IBoard | undefined>();
  const [users, setUsers] = useState<IUser[]>([]);
  const [column, setColumn] = useState<IColumn | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = new Promise(async () => {
      const responseBoard = await getBoard(id);
      setBoard(responseBoard);
    });
    const fetchUsers = new Promise(async () => {
      const responseUsers = await getUserList();
      setUsers(responseUsers);
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
    } as IPostPositionUpdate;
  }

  function onDragEnd({ destination, source }: DropResult) {
    if (destination) {
      const positionUpdate: IPostPositionUpdate[] = [];
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
            debugger;
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
      patchPositions(positionUpdate);
    }
  }

  const addNewPost = async (post: IPostSubmission) => {
    setLoading(true);
    const responsePost = await createPost(post);
    const newPostList = column.posts.map((p) => ({
      ...p,
      position: p.position + 1,
    }));
    newPostList.unshift(responsePost);
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
  };

  const handleColumnUpdate = (column: IColumn) => {
    setBoard({
      ...board,
      columns: board.columns.map((c) => {
        if (c.id === column.id) {
          return column;
        }
        return c;
      }),
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
                <Grid
                  item
                  sx={{
                    width: 300,
                  }}
                  key={col.id}
                >
                  <KanbanColumn
                    passedColumn={col}
                    users={users}
                    updateColumns={handleColumnUpdate}
                  />
                  {/* <Paper sx={{ backgroundColor: "green", p: 2 }}>
                    <TextField
                      sx={{ pb: 1 }}
                      value={col.name}
                      variant="standard"
                    />
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
                          sx={{
                            minHeight: 100,
                            pt: 1,
                            height: `calc(100vh - 318px)`,
                            overflow: "auto",
                          }}
                        >
                          {col.posts.map((post, index) => {
                            return (
                              <Draggable
                                key={post.id}
                                draggableId={post.id.toString()}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  const savePostEdits = async (
                                    postUpdate: IPost
                                  ) => {
                                    setLoading(true);
                                    const responsePost = await updatePost(
                                      postUpdate.id,
                                      {
                                        ...postUpdate,
                                        assigned: postUpdate.assigned
                                          ? postUpdate.assigned.id
                                          : null,
                                      }
                                    );
                                    const newPostList = col.posts.map((p) =>
                                      p.id === responsePost.id
                                        ? responsePost
                                        : p
                                    );
                                    setBoard({
                                      ...board,
                                      columns: board.columns.map((c) => {
                                        if (c.id === col.id) {
                                          return {
                                            ...col,
                                            posts: newPostList,
                                          };
                                        }
                                        return c;
                                      }),
                                    });
                                    setLoading(false);
                                  };

                                  const handleDeletePost = async () => {
                                    setLoading(true);
                                    await deletePost(post.id);
                                    const newPostList = col.posts.filter(
                                      (p) => p.id !== post.id
                                    );
                                    setBoard({
                                      ...board,
                                      columns: board.columns.map((c) => {
                                        if (c.id === col.id) {
                                          return { ...col, posts: newPostList };
                                        }
                                        return c;
                                      }),
                                    });
                                    setLoading(false);
                                  };

                                  return (
                                    <div
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      ref={provided.innerRef}
                                    >
                                      <KanbanPost
                                        post={post}
                                        users={users}
                                        savePostEdits={savePostEdits}
                                        deletePost={handleDeletePost}
                                      />
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </Box>
                      )}
                    </Droppable>
                  </Paper> */}
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
