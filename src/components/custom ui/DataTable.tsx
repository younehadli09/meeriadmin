"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, X } from "lucide-react";
import {
    ColumnDef,
    ColumnFiltersState,
    getFilteredRowModel,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DataWithId {
    _id: string;
    [key: string]: unknown;
}

interface DataTableProps<TData extends DataWithId, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchKey: string;
    editLinkBase: string;
    onDeleteAction: (id: string) => void;
}


export function DataTable<TData extends DataWithId, TValue>({
    columns,
    data,
    searchKey,
    editLinkBase,
    onDeleteAction, // Correct
}: DataTableProps<TData, TValue>) {

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [selectedRow, setSelectedRow] = useState<TData | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<TData | null>(null);

    const handleDeleteClick = (product: TData) => {
        setSelectedProduct(product);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (deletePassword === "younes@") {
            onDeleteAction(selectedProduct?._id as string);
            setSelectedProduct(null);
            setIsDeleteDialogOpen(false);
            setDeletePassword("");
        } else {
            alert("Incorrect password. Please try again.");
        }
    };


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: { columnFilters },
    });

    return (
        <div className="py-5 px-4 md:px-6">
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                        <h1 className="text-lg font-semibold">
                            Do you really want to delete ?
                        </h1>
                        <Input
                            type="password"
                            placeholder="Enter your password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            className="mt-4"
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button className="bg-red-600 text-white" onClick={confirmDelete}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="flex items-center py-4">
                <Input
                    placeholder="Search..."
                    value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
                    className="w-full max-w-xs md:max-w-sm"
                />
            </div>

            <div className="overflow-x-auto">
                <Table className="w-full min-w-[600px]">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="cursor-pointer hover:bg-gray-100"
                                    onClick={() => setSelectedRow(row.original)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="break-words max-w-[150px]">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                    <TableCell className="flex space-x-2">
                                        <Link href={`${editLinkBase}/${row.original._id}`} onClick={(e) => e.stopPropagation()}>
                                            <Pencil className="w-5 h-5" />
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick(row.original);
                                            }}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end space-x-2 py-4">
                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    Next
                </Button>
            </div>

            {selectedRow && (
                <Dialog open={true} onOpenChange={() => setSelectedRow(null)}>
                    <DialogContent className="bg-white m-auto rounded-xl shadow-lg w-full max-w-[90%] sm:max-w-lg max-h-[80vh] overflow-y-auto flex flex-col justify-center">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Details</DialogTitle>
                        </DialogHeader>
                        <div className="p-4 space-y-4 overflow-y-auto">
                            {Object.entries(selectedRow).map(([key, value]) =>
                                key !== "_id" && (
                                    <div key={key} className="flex flex-col py-2">
                                        <span className="text-sm font-semibold capitalize break-words">
                                            {key.replace(/_/g, " ")}
                                        </span>
                                        <div className="text-sm text-gray-800 break-words">
                                            {typeof value === "object" && value !== null ? (
                                                Array.isArray(value) ? value.join(", ") : JSON.stringify(value)
                                            ) : (
                                                value as string
                                            )}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-end gap-2 p-4">
                            <Link href={`${editLinkBase}/${selectedRow._id}`}>
                                <Button className="w-full sm:w-auto bg-blue-600 text-white">Edit</Button>
                            </Link>
                            <Button variant="destructive" onClick={confirmDelete}>
                                Delete
                            </Button>

                            <Button className="w-full sm:w-auto bg-gray-100 text-gray-700" onClick={() => setSelectedRow(null)}>
                                <X className="h-5 w-5 text-gray-600" />
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
