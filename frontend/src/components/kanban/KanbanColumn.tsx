import { Box, Button, IconButton, Paper, TextField } from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { updatePost, deletePost, createPost } from "../../api/post";
import IPost, { IPostSubmission } from "../../interfaces/IPost";
import IColumn, { IColumnUpdate } from "../../interfaces/IColumn";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

import KanbanPost from "./KanbanPost";
import AddPostDialog from "./AddPostDialog";
import IUser from "../../interfaces/IUser";
import { useDebouncedCallback } from "use-debounce";
import { updateColumn, deleteColumn } from "../../api/column";

interface IKanbanColumn {
  passedColumn: IColumn;
  users: IUser[];
  updateColumnList: (column: IColumn) => void;
  deleteFromColumnList: (id: number) => void;
}

export default function KanbanColumn({
  passedColumn,
  users,
  updateColumnList,
  deleteFromColumnList,
}: IKanbanColumn) {
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [column, setColumn] = useState<IColumn | null>(null);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  useEffect(() => {
    if (passedColumn) {
      setColumn(passedColumn);
    }
  }, [passedColumn]);

  const debouncedChangeSearchString = useDebouncedCallback(
    async (s: string) => {
      const columnUpdate = {
        ...column,
        posts: undefined,
      } as IColumnUpdate;
      updateColumn(column.id, columnUpdate);
    },
    600
  );

  const handleChangeName = (text: string) => {
    setColumn({ ...column, name: text });
    debouncedChangeSearchString(text);
  };

  const addNewPost = async (post: IPostSubmission) => {
    const responsePost = await createPost(post);
    const newPostList = column.posts.map((p) => ({
      ...p,
      position: p.position + 1,
    }));
    newPostList.unshift(responsePost);
    updateColumnList({ ...column, posts: newPostList });
  };

  const handleDeleteColumn = () => {
    deleteColumn(column!.id);
    deleteFromColumnList(column!.id);
  };

  if (!column) return null;

  return (
    <Paper
      sx={{ py: 2, pl: 2, pr: 0 }}
      onMouseEnter={(e) => setIsHovering(true)}
      onMouseLeave={(e) => setIsHovering(false)}
    >
      <Box sx={{ width: "100%", mb: 1, pr: 2 }}>
        <TextField
          sx={{ pb: 1 }}
          value={column.name}
          onChange={(e) => handleChangeName(e.target.value)}
          variant="standard"
          fullWidth
          inputProps={{ style: { fontSize: 20, paddingRight: "24px" } }}
        />
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => setAddDialogOpen(true)}
          fullWidth
        >
          Add Item
        </Button>
        <IconButton
          sx={{
            position: "absolute",
            transform: "translate(-30px,-60px)",
            opacity: isHovering ? "100%" : "0%",
            transition: "opacity 375ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          }}
          onClick={() => isHovering && handleDeleteColumn()}
        >
          <Close />
        </IconButton>
      </Box>

      <Droppable type="FIELD" droppableId={column.id.toString()}>
        {(provided, _) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              minHeight: 100,
              pr: "12px",
              mr: "4px",
              height: `calc(100vh - 310px)`,
              overflow: "auto",
            }}
          >
            {column.posts.map((post, index) => {
              return (
                <Draggable
                  key={post.id}
                  draggableId={post.id.toString()}
                  index={index}
                >
                  {(provided, snapshot) => {
                    const savePostEdits = async (postUpdate: IPost) => {
                      const responsePost = await updatePost(postUpdate.id, {
                        ...postUpdate,
                        assigned: postUpdate.assigned
                          ? postUpdate.assigned.id
                          : null,
                      });
                      const newPostList = column.posts.map((p) =>
                        p.id === responsePost.id ? responsePost : p
                      );
                      updateColumnList({ ...column, posts: newPostList });
                    };

                    const handleDeletePost = async () => {
                      await deletePost(post.id);
                      const newPostList = column.posts.filter(
                        (p) => p.id !== post.id
                      );
                      updateColumnList({ ...column, posts: newPostList });
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

      {addDialogOpen && (
        <AddPostDialog column={column} users={users} savePost={addNewPost} />
      )}
    </Paper>
  );
}
