"use client";

import { useState } from "react";
import { DeleteUser } from "@/actions/users";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

export default function DeleteUserButton({ userId }: { userId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this user? Their blogs will be transferred to your account."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await DeleteUser(userId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(result.success);
      // Refresh the page to show updated user list
      window.location.reload();
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 transition-colors flex items-center"
    >
      {isDeleting ? (
        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4 mr-1" />
      )}
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
