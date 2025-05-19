"use client";
import * as React from "react";

import { Input } from "@/components/ui/input";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import ProfileParser from "../profile-parser";
import { CurrentBindFilter, Filters } from "./filters";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  inputData: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  inputData,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [data, setData] = React.useState<TData[]>(inputData);
  const [currentBindFilter, setCurrentBindFilter] =
    React.useState<CurrentBindFilter>("all");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div>
      <div className="sticky top-2 z-40 flex items-center">
        <Input
          placeholder="Search..."
          value={(table.getColumn("action")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("action")?.setFilterValue(event.target.value)
          }
          className="max-w-sm my-5 bg-black"
        />
        <div className="pl-2">
          <Filters
            updateHandler={setData}
            inputData={inputData}
            currentBindFilter={currentBindFilter}
            setCurrentBindFilter={setCurrentBindFilter}
          ></Filters>
        </div>
        <div className="pl-6">
          <ProfileParser
            keybinds={inputData}
            updateHandler={setData}
          ></ProfileParser>
        </div>
      </div>

      <div className="rounded-md border h-[calc(100vh-200px)] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 min-w-80 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
