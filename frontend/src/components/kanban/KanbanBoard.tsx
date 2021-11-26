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
import React, { useEffect, useState, useReducer } from "react";
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
import { useDebouncedCallback } from "use-debounce";
import { createColumn } from "../../api/column";
import { Container } from "react-smooth-dnd";
import IDropResult from "../../interfaces/IDropResult";

interface IParam {
  id?: string;
}

function reducer(
  updates: IPostPositionUpdate[],
  action: {
    type: "add" | "clear";
    newPosition?: IPostPositionUpdate;
  }
) {
  switch (action.type) {
    case "add":
      return action.newPosition ? [...updates, action.newPosition] : updates;
    case "clear":
      return [];
    default:
      throw new Error();
  }
}

export default function KanbanBoard() {
  let { id } = useParams<IParam>();
  const [board, setBoard] = useState<IBoard | undefined>();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggingOverNewColumn, setDraggingOverNewColumn] = useState(true);
  const [postPositionUpdates, dispatch] = useReducer(reducer, []);

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

  const debouncedUpdatePositions = useDebouncedCallback(
    async (updates: IPostPositionUpdate[]) => {
      patchPositions(updates);
      dispatch({ type: "clear" });
    },
    100
  );

  useEffect(() => {
    if (postPositionUpdates.length > 0)
      debouncedUpdatePositions(postPositionUpdates);
  }, [postPositionUpdates]);

  const handleColumnDelete = (id: number) => {
    setBoard({
      ...board,
      columns: board.columns.filter((c) => c.id !== id),
    });
  };

  const handleCreateNewColumn = async (post?: IPost) => {
    const newColumn = {
      name: "Untitled Column",
      position: board.columns.length,
      board: board.id,
    } as IColumnSubmission;
    const responseColumn = await createColumn(newColumn);

    if (post) {
      post.column = responseColumn.id;
      post.position = 0;
      responseColumn.posts.push(post);
      dispatch({
        type: "add",
        newPosition: {
          id: post.id,
          position: post.position,
          column: post.column,
        },
      });
    }

    setBoard({
      ...board,
      columns: [...board.columns, responseColumn],
    });
  };

  if (!board) return null;

  return (
    <>
      <Typography variant="h4" sx={{ mb: 1 }}>
        {board.name}
      </Typography>
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
                      updatePosition={(position) =>
                        dispatch({ type: "add", newPosition: position })
                      }
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
                onClick={() => handleCreateNewColumn()}
              >
                <Container
                  groupName="column"
                  onDrop={(result) => {
                    if (result.addedIndex)
                      handleCreateNewColumn(result.payload);
                  }}
                  onDragEnter={() => setDraggingOverNewColumn(true)}
                  onDragLeave={() => setDraggingOverNewColumn(false)}
                  render={(ref) => (
                    <Paper
                      ref={ref}
                      sx={{
                        backgroundColor: draggingOverNewColumn
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
                />
              </ButtonBase>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
