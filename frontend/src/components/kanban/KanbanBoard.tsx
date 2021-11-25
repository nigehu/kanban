import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonBase,
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
import { getBoard } from "../../api/board";
import { getUserList } from "../../api/user";
import {
  createPost,
  deletePost,
  patchPositions,
  updatePost,
} from "../../api/post";
import IBoard from "../../interfaces/IBoard";
import IColumn, { IColumnSubmission } from "../../interfaces/IColumn";
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
import { createColumn } from "../../api/column";

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

  async function onDragEnd({ destination, source }: DropResult) {
    if (destination) {
      const positionUpdate: IPostPositionUpdate[] = [];
      const srcId = parseInt(source.droppableId);
      const destId = parseInt(destination.droppableId);
      if (destination.droppableId === "newColumn") {
        const sourceColumn = board.columns.find((c) => c.id === srcId)!;
        const sourcePost = sourceColumn.posts.find(
          (p) => p.position === source.index
        )!;
        const newColumn = {
          name: "Untitled Column",
          position: board.columns.length,
          board: board.id,
        } as IColumnSubmission;
        const responseColumn = await createColumn(newColumn);
        responseColumn.posts.push({
          ...sourcePost,
          column: responseColumn.id,
          position: 0,
        });
        positionUpdate.push(getPositionUpdate(responseColumn.posts[0]));

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
          } else {
            return col;
          }
        });
        newColumnList.push(responseColumn);
        setBoard({ ...board, columns: newColumnList });
      } else if (destId === srcId) {
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

  const handleColumnDelete = (id: number) => {
    setBoard({
      ...board,
      columns: board.columns.filter((c) => c.id !== id),
    });
  };

  if (!board) return null;

  return (
    <>
      <Typography variant="h4" sx={{ mb: 1 }}>
        {board.name}
      </Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            p: 1,
            pb: 0,
            backgroundColor: "grey.200",
            borderRadius: 1,
          }}
        >
          <Box
            sx={{
              pb: 2,
              backgroundColor: "grey.200",
              width: "calc(100vw - 64px)",
              overflow: "auto",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridAutoFlow: "column",
                gridGap: 8,
                // width: board.columns.length * 300,
                // overflow: "auto",
                // whiteSpace: "nowrap",
                // "& > div": {
                //   display: "inline-block",
                // },
              }}
            >
              {board.columns &&
                board.columns.map((col) => {
                  return (
                    <Box
                      sx={{
                        width: 300,
                      }}
                      key={col.id}
                    >
                      <KanbanColumn
                        passedColumn={col}
                        users={users}
                        updateColumnList={handleColumnUpdate}
                        deleteFromColumnList={handleColumnDelete}
                      />
                    </Box>
                  );
                })}
              <Box sx={{ width: 300 }}>
                <ButtonBase
                  sx={{
                    width: 284,
                  }}
                >
                  <Droppable type="FIELD" droppableId="newColumn">
                    {(provided, snapshot) => (
                      <Paper
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          backgroundColor: snapshot.isDraggingOver
                            ? "LightCyan"
                            : "white",
                          p: 2,
                          height: `calc(100vh - 188px)`,
                          minHeight: 221.75,
                          width: "100%",
                          display: "grid",
                          opacity: "50%",
                          transition:
                            "opacity 275ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                          "&:hover": {
                            opacity: "90%",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            justifySelf: "center",
                            alignSelf: "center",
                            display: "flex",
                          }}
                        >
                          <Add /> <Typography>New Column</Typography>
                        </Box>
                      </Paper>
                    )}
                  </Droppable>
                </ButtonBase>
              </Box>
            </Box>
          </Box>
        </Box>
      </DragDropContext>
      {column && (
        <AddPostDialog
          column={column}
          users={users}
          savePost={addNewPost}
          handleCancel={() => setColumn(null)}
        />
      )}
    </>
  );
}
