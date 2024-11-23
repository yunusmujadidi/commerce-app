"use client";
import { Color } from "@prisma/client";
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

import { createColor, deleteColors, editColors } from "@/actions/color-action";

interface ColorFormProps {
  initialData: Color | null;
}

export const colorFormSchema = z.object({
  name: z.string().min(3, "Color name must be 3 characters or more"),
  value: z.string().min(4).regex(/^#/, "String must be a valid hex code"),
  storeId: z.string(),
});

export const ColorForm = ({ initialData }: ColorFormProps) => {
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const router = useRouter();
  const params = useParams();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this color."
  );

  const storeId = params.storeId as string;
  const colorId = params.colorId as string;
  const title = initialData ? "Edit color" : "Create color";
  const description = initialData ? "Edit a color" : "Add a new color";
  const action = initialData ? "Save changes" : "Create color";

  const form = useForm<z.infer<typeof colorFormSchema>>({
    defaultValues: initialData || {
      name: "",
      storeId: storeId,
      value: "",
    },
    resolver: zodResolver(colorFormSchema),
  });

  const onSubmit = (values: z.infer<typeof colorFormSchema>) => {
    console.log(values);
    if (initialData) {
      onEditSubmit(values);
    } else {
      onCreateSubmit(values);
    }
  };

  const onCreateSubmit = async (values: z.infer<typeof colorFormSchema>) => {
    console.log("craeting color");
    setLoading1(true);
    const result = await createColor(values);
    if (result.success) {
      router.refresh();
      router.push(`/dashboard/${storeId}/colors`);
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.error);
    }
    setLoading1(false);
    console.log("craeting color", result?.result);
  };

  const onEditSubmit = async (values: z.infer<typeof colorFormSchema>) => {
    setLoading1(true);
    const result = await editColors({ ...values, id: colorId });
    if (result) {
      router.refresh();
      router.push(`/dashboard/${storeId}/colors`);
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
      const result = await deleteColors({ id: colorId, storeId });

      if (result) {
        toast.success(result.message);
        router.push(`/dashboard/${storeId}/colors`);
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
            color="sm"
            onClick={() => onDeleteSubmit()}
            disabled={loading2}
          >
            <Trash color="color-4 " />
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
                      placeholder="Color name"
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
                    <div className="flex items-center gap-y-4">
                      <Input
                        disabled={loading1}
                        placeholder="Value hex code (#FFFF)"
                        {...field}
                      />
                      <div
                        className="ml-4 border p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading1} className="ml-auto" type="submit">
            {loading1 && <Loader2 className="mr-2 color-4 animate-spin" />}
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
