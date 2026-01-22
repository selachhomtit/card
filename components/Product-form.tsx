"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useState, useRef, useEffect } from "react"

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_FILES = 10
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]

/* ---------------- FIXED ZOD SCHEMA ---------------- */
const formSchema = z.object({
  images: z
    .custom<FileList>((v): v is FileList => v instanceof FileList, "Required")
    .refine((files) => files.length > 0, "At least one image is required")
    .refine((files) => files.length <= MAX_FILES, `Up to ${MAX_FILES} images allowed`)
    .refine(
      (files) =>
        Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
      "Each image must be 5MB or smaller"
    )
    .refine(
      (files) =>
        Array.from(files).every((file) =>
          ACCEPTED_IMAGE_TYPES.includes(file.type)
        ),
      "Only JPG, JPEG, PNG, WebP allowed"
    ),

  title: z.string().min(3, "Title must be at least 3 characters"),

  /* ✅ Zod v4-safe price validation */
  price: z.coerce
    .number()
    .refine((v) => !Number.isNaN(v), {
      message: "Must be a valid number",
    })
    .min(0.01, "Minimum price is 0.01 USD"),

  categoryId: z.string().min(1, "Please select a category"),

  description: z.string().min(20, "Description must be at least 20 characters"),
})

type FormValues = z.infer<typeof formSchema>

type FileWithPreview = {
  file: File
  preview: string
}

export default function ProductForm() {
  const [filesWithPreview, setFilesWithPreview] = useState<FileWithPreview[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  /* ---------------- FIXED useForm ---------------- */
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      images: undefined as unknown as FileList,
      title: "",
      price: "", // ✅ FIX (was undefined)
      categoryId: "",
      description: "",
    },
    mode: "onChange",
  })

  useEffect(() => {
    return () => {
      filesWithPreview.forEach(({ preview }) =>
        URL.revokeObjectURL(preview)
      )
    }
  }, [filesWithPreview])

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles) return

    const newFiles = Array.from(selectedFiles).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setFilesWithPreview((prev) => {
      const updated = [...prev, ...newFiles].slice(0, MAX_FILES)

      const dt = new DataTransfer()
      updated.forEach(({ file }) => dt.items.add(file))
      form.setValue("images", dt.files, { shouldValidate: true })

      return updated
    })
  }

  const removeFile = (index: number) => {
    setFilesWithPreview((prev) => {
      const removed = prev[index]
      URL.revokeObjectURL(removed.preview)

      const updated = prev.filter((_, i) => i !== index)

      const dt = new DataTransfer()
      updated.forEach(({ file }) => dt.items.add(file))
      form.setValue("images", dt.files, { shouldValidate: true })

      return updated
    })
  }

  const onSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData()

      Array.from(values.images).forEach((file) => {
        formData.append("images", file)
      })

      formData.append("title", values.title)
      formData.append("price", values.price.toString())
      formData.append("categoryId", values.categoryId)
      formData.append("description", values.description)

      console.log("Submitted:", values)

      toast.success("Product created!")

      form.reset()
      setFilesWithPreview([])

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to create product")
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 max-w-3xl mx-auto py-10"
    >
      {/* Images */}
      <Field>
        <FieldLabel htmlFor="images">Product Images *</FieldLabel>

        <div className="border-2 border-dashed rounded-lg p-6 text-center">
          <Input
            id="images"
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            multiple
            ref={fileInputRef}
            onChange={handleFiles}
            className="hidden"
          />

          <label htmlFor="images" className="cursor-pointer">
            <div className="text-4xl mb-2">☁️</div>
            <p className="font-medium">Click to upload or drag and drop</p>
          </label>
        </div>

        <FieldError>{form.formState.errors.images?.message}</FieldError>

        {filesWithPreview.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {filesWithPreview.map(({ preview }, idx) => (
              <div key={idx} className="relative">
                <img
                  src={preview}
                  className="w-full h-28 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </Field>

      {/* Title */}
      <Field>
        <FieldLabel htmlFor="title">Title *</FieldLabel>
        <Input {...form.register("title")} />
        <FieldError>{form.formState.errors.title?.message}</FieldError>
        <FieldDescription>Your public product title</FieldDescription>
      </Field>

      {/* Price + Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field>
          <FieldLabel htmlFor="price">Price *</FieldLabel>
          <Input type="number" step="0.01" {...form.register("price")} />
          <FieldError>{form.formState.errors.price?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Category *</FieldLabel>
          <Select
            onValueChange={(val) =>
              form.setValue("categoryId", val, { shouldValidate: true })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="laptops">Laptops</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
          <FieldError>{form.formState.errors.categoryId?.message}</FieldError>
        </Field>
      </div>

      {/* Description */}
      <Field>
        <FieldLabel>Description *</FieldLabel>
        <Textarea rows={6} {...form.register("description")} />
        <FieldError>{form.formState.errors.description?.message}</FieldError>
      </Field>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Creating..." : "Create Product"}
      </Button>
    </form>
  )
}
