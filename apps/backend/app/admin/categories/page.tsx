"use client";

import { useState, useEffect } from "react";
import {
  createCategory,
  editCategory,
  getCategories,
} from "@/actions/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Plus, Save, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  showInHome: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    const result = await getCategories();
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setCategories(result.categories || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsCreating(true);
    const result = await createCategory(newCategory);
    setIsCreating(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Category created successfully");
    setNewCategory("");
    fetchCategories();
  };

  const handleEditCategory = async (category: Category) => {
    const result = await editCategory({
      id: category.id,
      name: category.name,
      showInHome: category.showInHome,
    });

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Category updated successfully");
    setEditingCategory(null);
    fetchCategories();
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-500">Manage your blog categories</p>
      </div>

      {/* Create Category Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Add New Category
        </h2>
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="categoryName" className="text-gray-700">
              Category Name
            </Label>
            <Input
              id="categoryName"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              className="mt-1"
            />
          </div>
          <Button
            onClick={handleCreateCategory}
            disabled={isCreating}
            className="mt-6"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Category
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            Existing Categories
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <div className="p-6 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : categories.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No categories found. Create one to get started.
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                {editingCategory?.id === category.id ? (
                  <div className="flex items-center gap-4">
                    <Input
                      value={editingCategory.name}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          name: e.target.value,
                        })
                      }
                      className="max-w-xs"
                    />
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor={`showInHome-${category.id}`}
                        className="text-gray-700"
                      >
                        Show in Home
                      </Label>
                      <Switch
                        id={`showInHome-${category.id}`}
                        checked={editingCategory.showInHome}
                        onCheckedChange={(checked) =>
                          setEditingCategory({
                            ...editingCategory,
                            showInHome: checked,
                          })
                        }
                      />
                    </div>
                    <Button
                      onClick={() => handleEditCategory(editingCategory)}
                      variant="outline"
                      size="sm"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditingCategory(null)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-gray-900">
                        {category.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={`showInHome-${category.id}`}
                          className="text-gray-700"
                        >
                          Show in Home
                        </Label>
                        <Switch
                          id={`showInHome-${category.id}`}
                          checked={category.showInHome}
                          onCheckedChange={(checked) =>
                            handleEditCategory({
                              ...category,
                              showInHome: checked,
                            })
                          }
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => setEditingCategory(category)}
                      variant="outline"
                      size="sm"
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
