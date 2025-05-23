"use client";

import { ColumnDef } from "@tanstack/react-table";

export type DataColumn = {
  id?: string;
  actionId?: string;
  action?: string;
  category?: string;
  keyboard: any;
  mouse: any;
  joystick: any;
  gamepad: any;
  activationMode?: string;
  description?: string;
  rebinded?: boolean;
};

const renderCell = (
  value: string | undefined,
  isRebinded: boolean | undefined,
  subtext?: string
) => (
  <div>
    <p className={isRebinded ? "text-yellow-500" : ""}>{value}</p>
    {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
  </div>
);

const renderSimpleCell = (value: string, isRebinded: boolean | undefined) => (
  <div>
    <p className={isRebinded ? "text-yellow-500" : ""}>{value}</p>
  </div>
);

export const columns: ColumnDef<DataColumn>[] = [
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) =>
      renderCell(row.original.action, false, row.original.category),
  },
  {
    accessorKey: "keyboard",
    header: "Keyboard",
    cell: ({ row }) =>
      renderCell(
        row.original.keyboard,
        row.original.rebinded,
        row.original.keyboard ? row.original.activationMode : undefined
      ),
  },
  {
    accessorKey: "mouse",
    header: "Mouse",
    cell: ({ row }) =>
      renderSimpleCell(row.original.mouse, row.original.rebinded),
  },
  {
    accessorKey: "joystick",
    header: "Joystick",
    cell: ({ row }) =>
      renderSimpleCell(row.original.joystick, row.original.rebinded),
  },
  {
    accessorKey: "gamepad",
    header: "Gamepad",
    cell: ({ row }) =>
      renderSimpleCell(row.original.gamepad, row.original.rebinded),
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];
