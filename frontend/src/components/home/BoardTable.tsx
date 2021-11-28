import { Visibility } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { useHistory } from "react-router-dom";
import IBoard from "../../interfaces/IBoard";

interface IBoardTable {
  boards: IBoard[];
  title: string;
}

export default function BoardTable({ boards, title }: IBoardTable) {
  const history = useHistory();
  const handleBoardClick = (id: number) => {
    history.push(`kanban/${id}`);
  };

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h5">{title}</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {boards.length > 0 ? (
            boards.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.name}</TableCell>
                <TableCell>
                  {b.user.first_name} {b.user.last_name}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleBoardClick(b.id)}>
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3}>No Boards Exist</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
}
