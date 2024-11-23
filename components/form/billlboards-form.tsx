"use client";
import { Billboard } from "@prisma/client";
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
  createBillboard,
  deleteBillboards,
  editBillboard,
} from "@/actions/billboard-action";
import { ImageUpload } from "../image-upload";

interface BillboardsForm {
  initialData: Billboard | null;
}

export const billboardFormSchema = z.object({
  label: z.string().min(3, "Billboard must be 3 characters or more"),
  imageUrl: z.string().url("Need image to submit"),
  storeId: z.string(),
});

export const BillboardsForm = ({ initialData }: BillboardsForm) => {
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const router = useRouter();
  const params = useParams();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this billboard."
  );

  const storeId = params.storeId as string;
  const billboardId = params.billboardId as string;
  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData ? "Edit a billboard" : "Add a new billboard";
  const action = initialData ? "Save changes" : "Create billboard";

  const form = useForm<z.infer<typeof billboardFormSchema>>({
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
      storeId: storeId,
    },
    resolver: zodResolver(billboardFormSchema),
  });

  const onSubmit = (values: z.infer<typeof billboardFormSchema>) => {
    console.log(values);
    if (initialData) {
      onEditSubmit(values);
    } else {
      onCreateSubmit(values);
    }
  };

  const onCreateSubmit = async (
    values: z.infer<typeof billboardFormSchema>
  ) => {
    console.log("craeting billboard");
    setLoading1(true);
    const result = await createBillboard(values);
    if (result.success) {
      router.refresh();
      router.push(`/dashboard/${storeId}/billboards`);
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.error);
    }
    setLoading1(false);
    console.log("craeting billboard", result?.result);
  };

  const onEditSubmit = async (values: z.infer<typeof billboardFormSchema>) => {
    setLoading1(true);
    const result = await editBillboard({ ...values, id: billboardId });
    if (result) {
      router.refresh();
      router.push(`/dashboard/${storeId}/billboards`);
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
      const result = await deleteBillboards({ id: billboardId, storeId });

      if (result) {
        toast.success(result.message);
        router.push(`/dashboard/${storeId}/billboards`);
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
          <div className="grid grid-row-3 gap-8">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      disabled={loading1}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      className="w-auto "
                      disabled={loading1}
                      placeholder="Billboard label"
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
