import { useState, useEffect, type FormEvent } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import type { Task } from "../../types";

interface TaskFormProps {
  task?: Task;
  onSubmit: (values: { title: string; description: string }) => Promise<boolean>;
  onCancel: () => void;
}

interface FormErrors {
  title?: string;
  description?: string;
}

export default function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setErrors({});
  }, [task]);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!title.trim()) next.title = "Title is required";
    else if (title.trim().length < 3) next.title = "Title must be at least 3 characters";
    if (description.trim().length > 300)
      next.description = "Description must be under 300 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const success = await onSubmit({ title: title.trim(), description: description.trim() });
    setLoading(false);
    if (success) {
      setTitle("");
      setDescription("");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input
        label="Title"
        placeholder="e.g. Design landing page"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        autoFocus
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-300">
          Description
          <span className="ml-2 text-zinc-600 font-normal text-xs">
            ({description.length}/300)
          </span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional — add more context about this task"
          rows={3}
          className={`
            w-full rounded-lg border bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100
            placeholder:text-zinc-600 resize-none
            focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
            transition-all duration-200
            ${errors.description ? "border-red-500" : "border-zinc-700 hover:border-zinc-600"}
          `}
        />
        {errors.description && (
          <p className="text-xs text-red-400">{errors.description}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-1">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {task ? "Save Changes" : "Create Task"}
        </Button>
      </div>
    </form>
  );
}
