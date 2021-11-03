import { Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import IPost from "../../interfaces/IPost";
import IUser from "../../interfaces/IUser";
import EditPostDialog from "./EditPostDialog";

interface IKanbanPost {
  post: IPost;
  users: IUser[];
  savePostEdits: (post: IPost) => void;
}

export default function KanbanPost({
  post,
  users,
  savePostEdits,
}: IKanbanPost) {
  const [open, setOpen] = useState<boolean>(false);

  const handleSavePost = (postUpdates: IPost) => {
    setOpen(false);
    savePostEdits(postUpdates);
  };

  return (
    <>
      <Grid
        container
        direction="column"
        spacing={1}
        sx={{
          my: 1,
          mx: 0,
          pr: 1,
          pb: 1,
          backgroundColor: "pink",
          border: "solid grey 1px",
          width: "100%",
        }}
      >
        <Grid item>
          <Box display="flex" justifyContent="space-between" sx={{ pr: 1 }}>
            <Box display="grid" alignSelf="center">
              <Typography variant="h6">{post.title}</Typography>
            </Box>
            <Box display="grid" alignSelf="center">
              <IconButton onClick={() => setOpen(true)}>
                <Edit />
              </IconButton>
            </Box>
          </Box>
        </Grid>
        <Grid item>
          <Typography>
            {post.assigned
              ? `Assigned: ${post.assigned.first_name} ${post.assigned?.last_name}`
              : "Unassigned"}
          </Typography>
        </Grid>
        <Grid item>
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
            <Typography variant="body2">{post.description}</Typography>
          </Box>
        </Grid>
      </Grid>
      {open && (
        <EditPostDialog
          passedPost={post}
          users={users}
          savePostEdits={handleSavePost}
          cancelPostEdits={() => setOpen(false)}
        />
      )}
    </>
  );
}
