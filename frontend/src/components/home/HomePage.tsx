import { Visibility } from "@mui/icons-material";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import IBoard from "../../interfaces/IBoard";
import { useHistory } from "react-router-dom";
import BoardTable from "./BoardTable";

export default function HomePage() {
  const history = useHistory();
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      fetch(`/api/board`).then(async (response) => {
        if (response.status === 401 || response.status === 204) {
          return;
        }
        try {
          const data: IBoard[] | undefined = await response.json();
          if (response.ok && data) {
            setBoards(data);
            const myBoards = data.filter((b) => b.user.id === 1);
            const otherBoards = data.filter((b) => b.user.id === 2);
            setLoading(false);
          } else {
            return Promise.reject(data);
          }
        } catch (err) {
          console.error(err);
          if (response.ok) {
            return true;
          }
        }
      });
    };

    fetchData();
  }, []);

  const handleBoardClick = (id: number) => {
    history.push(`kanban/${id}`);
  };

  return (
    <>
      <BoardTable boards={boards} title="My Tables" />
      <BoardTable boards={[]} title="Other Tables" />
      {/* <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {boards.map((b) => (
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
          ))}
        </TableBody>
      </Table> */}
    </>
  );
}
