import { useState } from "react";
import { IoClose, IoCheckmarkCircle, IoWarning } from "react-icons/io5";
import { submitSlangTerm } from "@/lib/slang-api";

interface SubmitSlangFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  categories: string[];
}

export const SubmitSlangForm: React.FC<SubmitSlangFormProps> = ({
  onClose,
  onSuccess,
  categories,
}) => {
  const [formData, setFormData] = useState({
    term: "",
    meaning: "",
    example: "",
    category: "",
    submittedBy: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.term.trim() || !formData.meaning.trim()) {
      setSubmitStatus({
        type: "error",
        message: "Term and meaning are required fields.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const result = await submitSlangTerm({
        term: formData.term.trim(),
        meaning: formData.meaning.trim(),
        example: formData.example.trim() || undefined,
        category: formData.category || "General",
        submittedBy: formData.submittedBy.trim() || undefined,
      });

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message: result.message,
        });

        // Reset form
        setFormData({
          term: "",
          meaning: "",
          example: "",
          category: "",
          submittedBy: "",
        });

        // Call success callback and close after delay
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 2000);
      } else {
        setSubmitStatus({
          type: "error",
          message: result.message,
        });
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error status when user starts typing
    if (submitStatus.type === "error") {
      setSubmitStatus({ type: null, message: "" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            Add New Slang 🔥
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <IoClose className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Status Messages */}
        {submitStatus.type && (
          <div
            className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
              submitStatus.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
            }`}
          >
            {submitStatus.type === "success" ? (
              <IoCheckmarkCircle className="h-5 w-5 flex-shrink-0" />
            ) : (
              <IoWarning className="h-5 w-5 flex-shrink-0" />
            )}
            <p className="text-sm">{submitStatus.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Slang Term *
            </label>
            <input
              type="text"
              value={formData.term}
              onChange={(e) => handleInputChange("term", e.target.value)}
              placeholder="e.g., Vibes"
              maxLength={50}
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.term.length}/50 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meaning *
            </label>
            <textarea
              value={formData.meaning}
              onChange={(e) => handleInputChange("meaning", e.target.value)}
              placeholder="e.g., A feeling or atmosphere"
              rows={3}
              maxLength={300}
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.meaning.length}/300 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Example (optional)
            </label>
            <input
              type="text"
              value={formData.example}
              onChange={(e) => handleInputChange("example", e.target.value)}
              placeholder="e.g., This place has good vibes"
              maxLength={200}
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.example.length}/200 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Name/Handle (optional)
            </label>
            <input
              type="text"
              value={formData.submittedBy}
              onChange={(e) => handleInputChange("submittedBy", e.target.value)}
              placeholder="e.g., @username or Anonymous"
              maxLength={50}
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional - for credit if approved
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.term.trim() ||
                !formData.meaning.trim()
              }
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit for Review"
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            💡 <strong>Tip:</strong> Your submission will be reviewed by our
            team before being published. We&apos;ll make sure it follows
            community guidelines and isn&apos;t already in our dictionary!
          </p>
        </div>
      </div>
    </div>
  );
};
