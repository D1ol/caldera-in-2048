import React, { useMemo } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  useMaterialReactTable
} from "material-react-table";

interface LeaderboardEntry {
  name: string;
  score: number;
  time: string;
  seconds: number;
}


const LeaderboardTable: React.FC<{ data: LeaderboardEntry[] }> = ({ data }) => {
  const columns = useMemo<MRT_ColumnDef<LeaderboardEntry>[]>(() => [
    {
      accessorKey: "name",
      header: "Name",
      muiTableHeadCellProps: { style: { color: "green" } },
      enableHiding: false,
    },
    {
      accessorFn: (originalRow) => originalRow.score,
      id: "score",
      header: "S",
      Cell: ({ cell }) => <i>{cell.getValue<number>().toLocaleString()}</i>,
    },
    {
      accessorKey: "time",
      header: "Time",
      Cell: ({ cell }) => <span>{cell.getValue<number>()}</span>,

    },
    {
      accessorKey: "seconds",
      header: "Seconds",
      Cell: ({ cell }) => <span>{cell.getValue<number>()} seconds</span>,
    }
  ], []);

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: false,
    enableColumnOrdering: true,
    enableColumnResizing: true,
    enableGlobalFilter: false,
    initialState: {
      sorting: [
        {
          id: 'seconds',
          desc: false,
        },
        {
          id: 'score',
          desc: true,
        },
      ],
    },
  });

  return <MaterialReactTable table={table} />;
};

export default LeaderboardTable;
