"use client";
import { Billboard, Category } from "@prisma/client";
import { Heading } from "../heading";
import { Button } from "../ui/button";
import { Loader2, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Separator } from "../ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import {
  createCategory,
  deleteCategories,
  editCategory,
} from "@/actions/category-action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface CategoryForm {
  initialData: Category | null;
  billboards: Billboard[];
}

export const categoryFormSchema = z.object({
  name: z.string().min(3, "Category must be 3 characters or more"),
  storeId: z.string(),
  billboardId: z.string(),
});

export const CategoryForm = ({ initialData, billboards }: CategoryForm) => {
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const router = useRouter();
  const params = useParams();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this category."
  );

  const storeId = params.storeId as string;
  const categoryId = params.categoryId as string;
  const title = initialData ? "Edit category" : "Create category";
  const description = initialData ? "Edit a category" : "Add a new category";
  const action = initialData ? "Save changes" : "Create category";
  console.log("store params =", storeId);
  console.log("category params =", categoryId);
  console.log("initial data =", initialData);

  const form = useForm<z.infer<typeof categoryFormSchema>>({
    defaultValues: initialData || {
      name: "",
      storeId: storeId,
      billboardId: "",
    },
    resolver: zodResolver(categoryFormSchema),
  });

  const onSubmit = (values: z.infer<typeof categoryFormSchema>) => {
    console.log(values);
    if (initialData) {
      onEditSubmit(values);
    } else {
      onCreateSubmit(values);
    }
  };

  const onCreateSubmit = async (values: z.infer<typeof categoryFormSchema>) => {
    console.log("craeting category");
    setLoading1(true);
    const result = await createCategory(values);
    if (result.success) {
      router.refresh();
      router.push(`/dashboard/${storeId}/categories`);
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.error);
    }
    setLoading1(false);
    console.log("craeting category", result?.result);
  };

  const onEditSubmit = async (values: z.infer<typeof categoryFormSchema>) => {
    setLoading1(true);
    const result = await editCategory({ ...values, id: categoryId });
    if (result) {
      router.refresh();
      router.push(`/dashboard/${storeId}/categories`);
      toast.success(result.message);
    } else {
      toast.error("Something went wrong");
    }
    setLoading1(false);
  };
  const onDeleteSubmit = async () => {
    setLoading2(true);
    const ok = await confirm();
    if (ok) {
      const result = await deleteCategories({ id: categoryId, storeId });

      if (result) {
        toast.success(result.message);
        router.push(`/dashboard/${storeId}/categories`);
        router.refresh();
      } else {
        toast.error("Something went wrong");
      }
    }
    setLoading2(false);
  };

  return (
    <>
      <ConfirmDialog />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDeleteSubmit()}
            disabled={loading2}
          >
            <Trash size="size-4 " />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form className="space-y-8 " onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-col-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading1}
                      placeholder="Category name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <Select
                    disabled={loading2}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a billboard"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.length !== 0
                        ? billboards.map((item) => (
                            <SelectItem value={item.id} key={item.id}>
                              {item.label}
                            </SelectItem>
                          ))
                        : "No Billboard Found"}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading1} className="ml-auto" type="submit">
            {loading1 && <Loader2 className="mr-2 size-4 animate-spin" />}
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
