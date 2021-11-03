import { Box, Button, Paper, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { updatePost, deletePost, createPost } from "../../api/post";
import IPost, { IPostSubmission } from "../../interfaces/IPost";
import IColumn from "../../interfaces/IColumn";
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

interface IKanbanColumn {
  passedColumn: IColumn;
  users: IUser[];
  updateColumns: (column: IColumn) => void;
}

export default function KanbanColumn({
  passedColumn,
  users,
  updateColumns,
}: IKanbanColumn) {
  const [open, setOpen] = useState<boolean>(false);
  const [column, setColumn] = useState<IColumn | null>(null);

  useEffect(() => {
    if (passedColumn) {
      setColumn(passedColumn);
    }
  }, [passedColumn]);

  const debouncedChangeSearchString = useDebouncedCallback(
    async (s: string) => {
      // send request
      console.log("update column");
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
    updateColumns({ ...column, posts: newPostList });
  };

  if (!column) return null;

  return (
    <Paper sx={{ backgroundColor: "green", p: 2 }}>
      <TextField
        sx={{ pb: 1 }}
        value={column.name}
        onChange={(e) => handleChangeName(e.target.value)}
        variant="standard"
      />
      <Button
        sx={{ width: "100%" }}
        variant="outlined"
        color="secondary"
        startIcon={<Add />}
        onClick={() => setOpen(true)}
      >
        Add
      </Button>

      <Droppable type="FIELD" droppableId={column.id.toString()}>
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
                      updateColumns({ ...column, posts: newPostList });
                    };

                    const handleDeletePost = async () => {
                      await deletePost(post.id);
                      const newPostList = column.posts.filter(
                        (p) => p.id !== post.id
                      );
                      updateColumns({ ...column, posts: newPostList });
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

      {open && (
        <AddPostDialog column={column} users={users} savePost={addNewPost} />
      )}
    </Paper>
  );
}
