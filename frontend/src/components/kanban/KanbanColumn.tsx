import { Box, Button, IconButton, Paper, TextField } from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { updatePost, deletePost, createPost } from "../../api/post";
import IPost, {
  IPostPositionUpdate,
  IPostSubmission,
} from "../../interfaces/IPost";
import IColumn, { IColumnUpdate } from "../../interfaces/IColumn";

import KanbanPost from "./KanbanPost";
import AddPostDialog from "./AddPostDialog";
import IUser from "../../interfaces/IUser";
import IDropResult from "../../interfaces/IDropResult";
import { useDebouncedCallback } from "use-debounce";
import { updateColumn, deleteColumn } from "../../api/column";
import DeleteColumnDialog from "./DeleteColumnDialog";
import { Container, Draggable } from "react-smooth-dnd";

interface IKanbanColumn {
  passedColumn: IColumn;
  users: IUser[];
  updatePosition: (positionUpdate: IPostPositionUpdate) => void;
  deleteFromColumnList: (id: number) => void;
}

export default function KanbanColumn({
  passedColumn,
  users,
  updatePosition,
  deleteFromColumnList,
}: IKanbanColumn) {
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
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

  function getPositionUpdate(post: IPost) {
    return {
      id: post.id,
      position: post.position,
      column: post.column,
    } as IPostPositionUpdate;
  }

  function updatePosts(newPostList: IPost[]) {
    const sortedPosts = newPostList.sort((a, b) => a.position - b.position);
    setColumn({ ...column, posts: sortedPosts });
  }

  function moveInsideColumn(removedIndex: number, addedIndex: number) {
    const isAscending = removedIndex < addedIndex;
    const newPostList = column.posts.map((post, i) => {
      // return unaffected posts
      if (
        i < Math.min(removedIndex, addedIndex) ||
        i > Math.max(removedIndex, addedIndex)
      )
        return post;

      let newPost: IPost = { ...post };
      if (i === removedIndex) {
        newPost.position = addedIndex;
      } else if (isAscending) {
        newPost.position = post.position - 1;
      } else {
        newPost.position = post.position + 1;
      }
      updatePosition(getPositionUpdate(newPost));
      return newPost;
    });
    updatePosts(newPostList);
  }

  function removeFromColumn(index: number) {
    const newPostList = column.posts
      .filter((p, i) => i !== index)
      .map((p, i) => {
        if (i >= index) {
          let newPost = { ...p, position: p.position - 1 };

          updatePosition(getPositionUpdate(newPost));
          return newPost;
        } else {
          return p;
        }
      });
    updatePosts(newPostList);
  }

  function addToColumn(post: IPost, index: number) {
    const newPostList = column.posts.map((p, i) => {
      if (i >= index) {
        let newPost = { ...p, position: p.position + 1 };

        updatePosition(getPositionUpdate(newPost));
        return newPost;
      } else {
        return p;
      }
    });
    post.position = index;
    post.column = column.id;

    updatePosition(getPositionUpdate(post));
    newPostList.push(post);
    updatePosts(newPostList);
  }
  const handleOnDrop = ({ addedIndex, removedIndex, payload }: IDropResult) => {
    if (removedIndex !== null && addedIndex !== null) {
      moveInsideColumn(removedIndex, addedIndex);
    } else if (removedIndex !== null) {
      removeFromColumn(removedIndex);
    } else if (addedIndex !== null) {
      addToColumn(payload, addedIndex);
    }
  };

  const addNewPost = async (post: IPostSubmission) => {
    const responsePost = await createPost(post);
    const newPostList = column.posts.map((p) => ({
      ...p,
      position: p.position + 1,
    }));
    newPostList.unshift(responsePost);
    setColumn({ ...column, posts: newPostList });
    setAddDialogOpen(false);
  };

  const confirmEmptyColumn = () => {
    if (column.posts.length > 0) {
      setDeleteDialogOpen(true);
    } else {
      handleDeleteColumn();
    }
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
        <Box sx={{ position: "relative" }}>
          <IconButton
            sx={{
              position: "absolute",
              transform: "translate(240px,-95px)",
              opacity: isHovering ? "100%" : "0%",
              transition: "opacity 375ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            }}
            onClick={() => isHovering && confirmEmptyColumn()}
          >
            <Close />
          </IconButton>
        </Box>
      </Box>
      <Container
        groupName="column"
        onDrop={(result) => handleOnDrop(result as IDropResult)}
        getChildPayload={(index) => column.posts[index]}
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: "drop-preview",
        }}
        render={(ref) => (
          <Box
            ref={ref}
            sx={{
              minHeight: 100,
              pr: "12px",
              mr: "4px",
              height: `calc(100vh - 310px)`,
              overflow: "auto",
            }}
          >
            {column.posts.map((post) => {
              const savePostEdits = async (postUpdate: IPost) => {
                const responsePost = await updatePost(postUpdate.id, {
                  ...postUpdate,
                  assigned: postUpdate.assigned ? postUpdate.assigned.id : null,
                });
                const newPostList = column.posts.map((p) =>
                  p.id === responsePost.id ? responsePost : p
                );
                setColumn({ ...column, posts: newPostList });
              };

              const handleDeletePost = async () => {
                await deletePost(post.id);
                const newPostList = column.posts.filter(
                  (p) => p.id !== post.id
                );
                setColumn({ ...column, posts: newPostList });
              };

              return (
                <Draggable key={post.id}>
                  <KanbanPost
                    post={post}
                    users={users}
                    savePostEdits={savePostEdits}
                    deletePost={handleDeletePost}
                  />
                </Draggable>
              );
            })}
          </Box>
        )}
      />

      {addDialogOpen && (
        <AddPostDialog
          column={column}
          users={users}
          savePost={addNewPost}
          handleCancel={() => setAddDialogOpen(false)}
        />
      )}

      {deleteDialogOpen && (
        <DeleteColumnDialog
          column={column}
          handleDeleteColumn={handleDeleteColumn}
          handleCancel={() => setDeleteDialogOpen(false)}
        />
      )}
    </Paper>
  );
}
