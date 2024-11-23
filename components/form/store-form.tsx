"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useStoreModal } from "@/hooks/use-store-modal";
import { createStore } from "@/actions/store-action";

const formSchema = z.object({
  name: z.string().min(3, "Use at least 3 character to name the store"),
});

export const StoreForm = () => {
  const [loading, setLoading] = useState(false);
  const { onClose } = useStoreModal();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: { name: string }) => {
    setLoading(true);
    const result = await createStore(values);
    if (result?.success) {
      setLoading(false);
      window.location.assign(`/dashboard/${result.result?.id}`);
      toast.success(result?.message);
    } else {
      toast.error(result.error);
    }
  };
  return (
    <div className="space-y-4 py-2 pb-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="E-Commerce" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end pt-6 space-x-2">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  Creating
                  <Loader2 className="size-4 animate-spin" />
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
