"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    ChevronDown,
    RefreshCw,
    X,
    CircleDot,
    UserCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                         }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [statusFilter, setStatusFilter] = React.useState<string[]>([])
    const [assignedToFilter, setAssignedToFilter] = React.useState<string[]>([])
    const [showQueued, setShowQueued] = React.useState(false)

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    const handleReset = () => {
        table.getColumn("name")?.setFilterValue("")
        setStatusFilter([])
        setAssignedToFilter([])
        setShowQueued(false)
    }

    const selectedRowCount = table.getFilteredSelectedRowModel().rows.length

    return (
        <div className="w-full space-y-4 p-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-1">
                    {/* Name Filter Input */}
                    <Input
                        placeholder="Filter by name..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="max-w-xs h-9"
                    />

                    {/* Status Filter Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-9 gap-2">
                                <CircleDot className="h-4 w-4" />
                                Status
                                {statusFilter.length > 0 && (
                                    <Badge variant="secondary" className="ml-1 rounded-sm px-1 font-normal">
                                        {statusFilter.length}
                                    </Badge>
                                )}
                                <ChevronDown className="h-4 w-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[200px]">
                            <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {["Active", "Pending", "Completed", "Archived"].map((status) => (
                                <DropdownMenuCheckboxItem
                                    key={status}
                                    checked={statusFilter.includes(status)}
                                    onCheckedChange={(checked) => {
                                        setStatusFilter(
                                            checked
                                                ? [...statusFilter, status]
                                                : statusFilter.filter((s) => s !== status)
                                        )
                                    }}
                                >
                                    {status}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Assigned To Filter Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-9 gap-2">
                                <UserCircle className="h-4 w-4" />
                                Assigned To
                                {assignedToFilter.length > 0 && (
                                    <Badge variant="secondary" className="ml-1 rounded-sm px-1 font-normal">
                                        {assignedToFilter.length}
                                    </Badge>
                                )}
                                <ChevronDown className="h-4 w-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[200px]">
                            <DropdownMenuLabel>Filter by assignee</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {["Asen Levov", "Edryo Shiderski", "Stoil Bonchev", "Georgi Dimitrov"].map((assignee) => (
                                <DropdownMenuCheckboxItem
                                    key={assignee}
                                    checked={assignedToFilter.includes(assignee)}
                                    onCheckedChange={(checked) => {
                                        setAssignedToFilter(
                                            checked
                                                ? [...assignedToFilter, assignee]
                                                : assignedToFilter.filter((a) => a !== assignee)
                                        )
                                    }}
                                >
                                    {assignee}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Show Queued Toggle */}
                    <Button
                        variant={showQueued ? "secondary" : "outline"}
                        className="h-9"
                        onClick={() => setShowQueued(!showQueued)}
                    >
                        Show Queued
                    </Button>

                    {/* Reset Button */}
                    <Button
                        variant="ghost"
                        className="h-9 px-2"
                        onClick={handleReset}
                    >
                        Reset
                    </Button>

                    {/* Active Filters Display */}
                    {(statusFilter.length > 0 || assignedToFilter.length > 0) && (
                        <div className="flex items-center gap-2">
                            {statusFilter.map((status) => (
                                <Badge key={status} variant="secondary" className="gap-1">
                                    {status}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => setStatusFilter(statusFilter.filter((s) => s !== status))}
                                    />
                                </Badge>
                            ))}
                            {assignedToFilter.map((assignee) => (
                                <Badge key={assignee} variant="secondary" className="gap-1">
                                    {assignee}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => setAssignedToFilter(assignedToFilter.filter((a) => a !== assignee))}
                                    />
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Refresh Button */}
                    <Button variant="outline" size="icon" className="h-9 w-9">
                        <RefreshCw className="h-4 w-4" />
                    </Button>

                    {/* Columns Visibility Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-9">
                                Columns <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Selection Counter */}
            {selectedRowCount > 0 && (
                <div className="flex items-center justify-between rounded-md border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900 px-4 py-2">
                    <p className="text-sm font-medium">
                        {selectedRowCount} of {table.getFilteredRowModel().rows.length} row(s) selected.
                    </p>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => table.resetRowSelection()}
                    >
                        Clear selection
                    </Button>
                </div>
            )}

            {/* Table */}
            <div className="rounded-lg border border-border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="h-12">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
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
                                    className="hover:bg-muted/50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-4">
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
                                    className="h-32 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <p className="text-muted-foreground">No results found.</p>
                                        <Button variant="link" onClick={handleReset}>
                                            Clear filters
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    {selectedRowCount > 0 ? (
                        <span>{selectedRowCount} of {table.getFilteredRowModel().rows.length} row(s) selected.</span>
                    ) : (
                        <span>0 of {table.getFilteredRowModel().rows.length} row(s) selected.</span>
                    )}
                </div>

                <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium whitespace-nowrap">
                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to first page</span>
                                {"<<"}
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to previous page</span>
                                {"<"}
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to next page</span>
                                {">"}
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to last page</span>
                                {">>"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
