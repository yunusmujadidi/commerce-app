"use client";
import { Size } from "@prisma/client";
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

import { createSize, deleteSizes, editSizes } from "@/actions/size-action";

interface SizeFormProps {
  initialData: Size | null;
}

export const sizeFormSchema = z.object({
  value: z.string(),
  name: z.string().min(3, "size must be 3 characters or more"),
  storeId: z.string(),
});

export const SizeForm = ({ initialData }: SizeFormProps) => {
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const router = useRouter();
  const params = useParams();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this size."
  );

  const storeId = params.storeId as string;
  const sizeId = params.sizeId as string;
  const title = initialData ? "Edit size" : "Create size";
  const description = initialData ? "Edit a size" : "Add a new size";
  const action = initialData ? "Save changes" : "Create size";

  const form = useForm<z.infer<typeof sizeFormSchema>>({
    defaultValues: initialData || {
      name: "",
      storeId: storeId,
      value: "",
    },
    resolver: zodResolver(sizeFormSchema),
  });

  const onSubmit = (values: z.infer<typeof sizeFormSchema>) => {
    if (initialData) {
      onEditSubmit(values);
    } else {
      onCreateSubmit(values);
    }
  };

  const onCreateSubmit = async (values: z.infer<typeof sizeFormSchema>) => {
    setLoading1(true);
    const result = await createSize(values);
    if (result.success) {
      router.refresh();
      router.push(`/dashboard/${storeId}/sizes`);
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.error);
    }
    setLoading1(false);
  };

  const onEditSubmit = async (values: z.infer<typeof sizeFormSchema>) => {
    setLoading1(true);
    const result = await editSizes({ ...values, id: sizeId });
    if (result) {
      router.refresh();
      router.push(`/dashboard/${storeId}/sizes`);
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
      const result = await deleteSizes({ id: sizeId, storeId });

      if (result) {
        toast.success(result.message);
        router.push(`/dashboard/${storeId}/sizes`);
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
                      placeholder="Size name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading1}
                      placeholder="Value name"
                      {...field}
                    />
                  </FormControl>
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
