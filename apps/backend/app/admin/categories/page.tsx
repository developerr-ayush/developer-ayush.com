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
import { Loader2, Plus, Save, X, Settings2 } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Categories
              </h1>
              <p className="mt-1 text-gray-500">Organize your blog content</p>
            </div>
            <Settings2 className="h-6 w-6 text-gray-400" />
          </div>

          {/* Create Category Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Add New Category
              </h2>
              <div className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label
                    htmlFor="categoryName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Category Name
                  </Label>
                  <Input
                    id="categoryName"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter category name"
                    className="h-12 px-4 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <Button
                  onClick={handleCreateCategory}
                  disabled={isCreating}
                  className="h-12 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-5 w-5" />
                      Create Category
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Categories List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">
                Existing Categories
              </h2>
            </div>
            <div className="divide-y divide-gray-50">
              {isLoading ? (
                <div className="p-12 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                </div>
              ) : categories.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-gray-500 text-lg">No categories found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Create one to get started
                  </p>
                </div>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="px-8 py-6 hover:bg-gray-50/50 transition-colors"
                  >
                    {editingCategory?.id === category.id ? (
                      <div className="flex items-center gap-6">
                        <Input
                          value={editingCategory.name}
                          onChange={(e) =>
                            setEditingCategory({
                              ...editingCategory,
                              name: e.target.value,
                            })
                          }
                          className="h-10 max-w-xs border-gray-200"
                        />
                        <div className="flex items-center gap-3">
                          <Label
                            htmlFor={`showInHome-${category.id}`}
                            className="text-sm font-medium text-gray-600"
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
                        <div className="flex items-center gap-2 ml-auto">
                          <Button
                            onClick={() => handleEditCategory(editingCategory)}
                            variant="outline"
                            size="sm"
                            className="h-10 px-4 border-gray-200 hover:border-purple-500 hover:text-purple-600"
                          >
                            <Save className="mr-2 h-4 w-4" />
                            Save
                          </Button>
                          <Button
                            onClick={() => setEditingCategory(null)}
                            variant="ghost"
                            size="sm"
                            className="h-10 px-4 text-gray-500 hover:text-gray-700"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="text-lg font-medium text-gray-900">
                          {category.name}
                        </span>
                        <div className="flex items-center gap-3 ml-8">
                          <Label
                            htmlFor={`showInHome-${category.id}`}
                            className="text-sm font-medium text-gray-600"
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
                        <Button
                          onClick={() => setEditingCategory(category)}
                          variant="outline"
                          size="sm"
                          className="ml-auto h-10 px-4 border-gray-200 hover:border-purple-500 hover:text-purple-600"
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
      </div>
    </div>
  );
}
