import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

export default function HomePage() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h3">Home Page</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Board #1</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}
