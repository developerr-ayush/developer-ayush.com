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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">Categories</h1>
          <p className="text-sm text-slate-400">Organise your blog content by topic</p>
        </div>
        <Settings2 className="h-5 w-5 text-slate-500" />
      </div>

      {/* Create Category Form */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white">Add New Category</h2>
        </div>
        <div className="p-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="categoryName" className="text-sm font-medium text-slate-400">
                Category Name
              </Label>
              <Input
                id="categoryName"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
                placeholder="e.g. TypeScript, System Design"
                className="h-11 bg-white/5 border-white/10 text-white placeholder-slate-600 focus:border-blue-500/50 focus:ring-blue-500/20"
              />
            </div>
            <Button
              onClick={handleCreateCategory}
              disabled={isCreating}
              className="h-11 px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all"
            >
              {isCreating ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>
              ) : (
                <><Plus className="mr-2 h-4 w-4" /> Create</>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white">Existing Categories</h2>
        </div>
        <div className="divide-y divide-white/5">
          {isLoading ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
            </div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-400">No categories yet</p>
              <p className="text-sm text-slate-600 mt-1">Create one above to get started</p>
            </div>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="px-6 py-4 hover:bg-white/[0.02] transition-colors">
                {editingCategory?.id === category.id ? (
                  <div className="flex items-center gap-4">
                    <Input
                      value={editingCategory.name}
                      onChange={(e) =>
                        setEditingCategory({ ...editingCategory, name: e.target.value })
                      }
                      className="h-9 max-w-xs bg-white/5 border-white/10 text-white"
                    />
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`showInHome-${category.id}`} className="text-xs text-slate-400">
                        Show in Home
                      </Label>
                      <Switch
                        id={`showInHome-${category.id}`}
                        checked={editingCategory.showInHome}
                        onCheckedChange={(checked) =>
                          setEditingCategory({ ...editingCategory, showInHome: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                      <Button
                        onClick={() => handleEditCategory(editingCategory)}
                        size="sm"
                        className="h-9 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
                      >
                        <Save className="mr-1.5 h-3.5 w-3.5" /> Save
                      </Button>
                      <Button
                        onClick={() => setEditingCategory(null)}
                        variant="ghost"
                        size="sm"
                        className="h-9 text-slate-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="font-medium text-white text-sm">{category.name}</span>
                    <div className="flex items-center gap-3 ml-6">
                      <Label htmlFor={`showInHome-view-${category.id}`} className="text-xs text-slate-500 cursor-pointer">
                        Show in Home
                      </Label>
                      <Switch
                        id={`showInHome-view-${category.id}`}
                        checked={category.showInHome}
                        onCheckedChange={(checked) =>
                          handleEditCategory({ ...category, showInHome: checked })
                        }
                      />
                    </div>
                    <Button
                      onClick={() => setEditingCategory(category)}
                      variant="outline"
                      size="sm"
                      className="ml-auto h-8 px-3 border-white/10 text-slate-400 hover:text-white hover:border-blue-500/50 bg-transparent rounded-lg text-xs"
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

