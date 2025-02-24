"use client";

import { useState } from "react";
import { Trash, Loader2 } from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

interface DeleteProps {
    item: string;
    id: string;
}

const Delete: React.FC<DeleteProps> = ({ item, id }) => {
    const [loading, setLoading] = useState(false);

    const onDelete = async () => {
        try {
            setLoading(true);
            const itemType = item === "product" ? "products" : "collections";
            const res = await fetch(`/api/${itemType}/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success(`${item} deleted`);
                window.location.href = `/${itemType}`;
            } else {
                throw new Error("Failed to delete item.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong! Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="bg-red-1 text-white" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white text-grey-1">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-1">
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your {item}.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="btn-primary">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="btn-primary bg-red-1 text-white"
                        onClick={onDelete}
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default Delete;
