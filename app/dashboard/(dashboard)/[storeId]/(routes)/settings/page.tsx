import { SettingsForm } from "@/components/form/settings-form";
import { getStore } from "@/actions/store-action";
import { redirect } from "next/navigation";

interface SettingsPageProps {
  params: {
    storeId: string;
  };
}

const SettingsPage = async ({ params }: SettingsPageProps) => {
  const store = await getStore({ storeId: params.storeId });
  if (!store.result) {
    redirect("/dashboard");
  }
  return (
    <div className=" flex flex-col w-full">
      <div className=" space-y-4 p-8 pt-6">
        <SettingsForm initialData={store.result} />
      </div>
    </div>
  );
};

export default SettingsPage;
