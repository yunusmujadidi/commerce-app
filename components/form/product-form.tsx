"use client";
import { Category, Color, Image, Product, Size } from "@prisma/client";
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
  FormDescription,
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
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import {
  createProducts,
  deleteProducts,
  editProducts,
} from "@/actions/product-action";
import { ImageUpload } from "../image-upload";

interface ProductFormProps {
  initialData:
    | (Product & {
        images: Image[];
      })
    | null;
  SelectProps: {
    sizes: Size[];
    colors: Color[];
    categories: Category[];
  };
}

// TODO: fix the images array for not showing more than 1

export const productFormSchema = z.object({
  name: z.string().min(3, "Product name must be 3 characters or more"),
  price: z.coerce.number().min(1, "Price can't be 0"),
  isFeatured: z.boolean().default(false),
  isArchived: z.boolean().default(false),
  colorId: z.string().min(1, "Color is required"),
  sizeId: z.string().min(1, "Size is required"),
  categoryId: z.string().min(1, "Category is required"),
  storeId: z.string(),
  images: z.object({ url: z.string() }).array(),
});

export const ProductForm = ({ initialData, SelectProps }: ProductFormProps) => {
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const router = useRouter();
  const params = useParams();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this product."
  );

  const storeId = params.storeId as string;
  const productId = params.productId as string;
  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product" : "Add a new product";
  const action = initialData ? "Save changes" : "Create product";

  const form = useForm<z.infer<typeof productFormSchema>>({
    defaultValues: initialData || {
      name: "",
      images: [],
      price: 0,
      isFeatured: false,
      isArchived: false,
      colorId: "",
      sizeId: "",
      categoryId: "",
      storeId: storeId,
    },
    resolver: zodResolver(productFormSchema),
  });

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const onSubmit = (values: z.infer<typeof productFormSchema>) => {
    console.log("Form values with images:", values.images);
    if (initialData) {
      onEditSubmit(values);
    } else {
      onCreateSubmit(values);
    }
  };
  const onCreateSubmit = async (values: z.infer<typeof productFormSchema>) => {
    try {
      console.log("Creating product with values:", values);
      console.log("Number of images:", values.images.length);
      console.log(
        "Image URLs:",
        values.images.map((img) => img.url)
      );

      setLoading1(true);
      const result = await createProducts(values);

      console.log("Create product result:", result);

      if (result.success) {
        router.refresh();
        router.push(`/dashboard/${storeId}/products`);
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error in onCreateSubmit:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading1(false);
    }
  };

  const onEditSubmit = async (values: z.infer<typeof productFormSchema>) => {
    setLoading1(true);
    const result = await editProducts({ ...values, id: productId });
    if (result) {
      router.refresh();
      router.push(`/dashboard/${storeId}/products`);
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
      const result = await deleteProducts({ id: productId, storeId });

      if (result) {
        toast.success(result.message);
        router.push(`/dashboard/${storeId}/products`);
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
            <Trash size="product-4 " />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form className="space-y-8 " onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading1}
                      placeholder="Product name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading1}
                      placeholder="10000"
                      {...field}
                    />
                  </FormControl>
                  <div className="text-sm text-muted-foreground">
                    {field.value ? formatPrice(field.value) : "Rp 0"}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading1}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SelectProps.categories.length !== 0
                        ? SelectProps.categories.map((item) => (
                            <SelectItem value={item.id} key={item.id}>
                              {item.name}
                            </SelectItem>
                          ))
                        : "No Categories Found"}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select
                    disabled={loading1}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a size"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SelectProps.sizes.length !== 0
                        ? SelectProps.sizes.map((item) => (
                            <SelectItem value={item.id} key={item.id}>
                              {item.name}
                            </SelectItem>
                          ))
                        : "No Sizes Found"}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select
                    disabled={loading1}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a color"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SelectProps.colors.length !== 0
                        ? SelectProps.colors.map((item) => (
                            <SelectItem value={item.id} key={item.id}>
                              {item.name}
                            </SelectItem>
                          ))
                        : "No Colors Found"}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value.map((image) => image.url)}
                      disabled={loading1}
                      onChange={(url) => {
                        if (url) {
                          // Check if the URL already exists in the array
                          const exists = field.value.some(
                            (img) => img.url === url
                          );
                          if (!exists) {
                            field.onChange([...field.value, { url }]);
                          }
                          // Log the updated array for debugging
                          console.log("Current image array:", [
                            ...field.value,
                            { url },
                          ]);
                        }
                      }}
                      onRemove={(url) => {
                        const filteredImages = field.value.filter(
                          (current) => current.url !== url
                        );
                        field.onChange(filteredImages);
                        // Log the updated array after removal
                        console.log(
                          "Updated image array after removal:",
                          filteredImages
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {/* Add a debug display of current images */}
                  <div className="text-sm text-muted-foreground mt-2">
                    Current images: {field.value.length}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will appear on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere on the store
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading1} className="ml-auto" type="submit">
            {loading1 && <Loader2 className="mr-2 product-4 animate-spin" />}
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
