"use client";
import { Store } from "@prisma/client";
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
import { deleteStores, editStore } from "@/actions/store-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";

interface SettingFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(3, "Store must be 3 characters or more"),
});

export const SettingsForm = ({ initialData }: SettingFormProps) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this store."
  );
  const router = useRouter();
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: initialData,
    resolver: zodResolver(formSchema),
  });

  const onEditSubmit = async ({ name }: { name: string }) => {
    setLoading1(true);
    const result = await editStore({
      storeId: initialData.id,
      name: name,
    });
    if (result) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error("Something went wrong");
    }
    setLoading1(false);
  };
  const onDeleteSubmit = async ({ storeId }: { storeId: string }) => {
    setLoading2(true);
    const ok = await confirm();
    if (ok) {
      const result = await deleteStores({ storeId });

      if (result) {
        toast.success(result.message);
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
        <Heading title="Settings" description="Manage store prefrences" />
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDeleteSubmit({ storeId: initialData.id })}
          disabled={loading2}
        >
          <Trash size="size-4 " />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          className="space-y-8 w-full"
          onSubmit={form.handleSubmit(onEditSubmit)}
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      className="w-auto md:w-full"
                      disabled={loading1}
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading1} className="ml-auto" type="submit">
            Save changes
            {loading1 && <Loader2 className="mr-2 size-4 animate-spin" />}
          </Button>
        </form>
      </Form>
    </>
  );
};
