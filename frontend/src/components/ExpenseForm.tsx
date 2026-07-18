/**
 * Form component for adding/editing expenses
 */

import React, { useState } from "react";
import { Category, ExpenseFormData } from "../types";
import { TextField, SelectBox, Button, Modal } from "../vibes";
import { useExpenseForm } from "../hooks/useExpenseForm";

interface ExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  categories: Category[];
  categoriesLoading?: boolean;
  onCategoryCreate: (name: string) => Promise<Category>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function ExpenseForm({
  initialData,
  categories,
  categoriesLoading = false,
  onCategoryCreate,
  onSubmit,
  onCancel,
  submitLabel = "Add Expense",
}: ExpenseFormProps) {
  const { formData, errors, isSubmitting, handleChange, handleSubmit } =
    useExpenseForm({
      initialData,
      onSubmit,
    });

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState<string>();
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
  };

  const categoryFieldStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.75rem",
    alignItems: "flex-end",
  };

  const categorySelectWrapperStyle: React.CSSProperties = {
    flex: 1,
  };

  const modalFormStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const categoryOptions = categories.map((category) => ({
    value: category.name,
    label: category.name,
  }));

  const handleCreateCategory = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedName = categoryName.trim();
    if (!trimmedName) {
      setCategoryError("Category name is required");
      return;
    }

    try {
      setIsCreatingCategory(true);
      setCategoryError(undefined);
      const category = await onCategoryCreate(trimmedName);
      handleChange("category", category.name);
      setCategoryName("");
      setIsCategoryModalOpen(false);
    } catch (error) {
      setCategoryError(
        error instanceof Error ? error.message : "Failed to create category",
      );
    } finally {
      setIsCreatingCategory(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={formStyle}>
        <TextField
          label="Amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={formData.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
          error={errors.amount}
          fullWidth
          required
        />

        <TextField
          label="Description"
          type="text"
          placeholder="Enter description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          error={errors.description}
          fullWidth
          required
        />

        <div style={categoryFieldStyle}>
          <div style={categorySelectWrapperStyle}>
            <SelectBox
              label="Category"
              options={categoryOptions}
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              error={errors.category}
              disabled={isSubmitting || categoriesLoading}
              fullWidth
              required
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={() => {
              setCategoryError(undefined);
              setIsCategoryModalOpen(true);
            }}
          >
            Add Category
          </Button>

        </div>

        <TextField
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          error={errors.date}
          fullWidth
          required
        />

        <div style={buttonGroupStyle}>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            fullWidth
          >
            {isSubmitting ? "Submitting..." : submitLabel}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          if (!isCreatingCategory) {
            setIsCategoryModalOpen(false);
            setCategoryName("");
            setCategoryError(undefined);
          }
        }}
        title="Add Category"
      >
        <form onSubmit={handleCreateCategory} style={modalFormStyle}>
          <TextField
            label="Category Name"
            type="text"
            placeholder="Enter category name"
            value={categoryName}
            onChange={(e) => {
              setCategoryName(e.target.value);
              if (categoryError) {
                setCategoryError(undefined);
              }
            }}
            error={categoryError}
            disabled={isCreatingCategory}
            fullWidth
            required
            autoFocus
          />
          <div style={buttonGroupStyle}>
            <Button type="submit" disabled={isCreatingCategory} fullWidth>
              {isCreatingCategory ? "Creating..." : "Create Category"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsCategoryModalOpen(false);
                setCategoryName("");
                setCategoryError(undefined);
              }}
              disabled={isCreatingCategory}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
