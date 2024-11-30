import { SettingsForm } from "@/components/form/settings-form";
import { getStore } from "@/actions/store-action";
import { redirect } from "next/navigation";

interface SettingsPageProps {
  params: Promise<{ storeId: string }>;
}

const SettingsPage = async ({ params }: SettingsPageProps) => {
  const store = await getStore({ storeId: (await params).storeId });
  if (!store) {
    redirect("/dashboard");
  }
  return (
    <div className=" flex flex-col w-full">
      <div className=" space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;
