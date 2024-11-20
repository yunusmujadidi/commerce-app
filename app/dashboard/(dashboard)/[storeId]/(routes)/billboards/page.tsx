import { BillboardsClient } from "./billboard-client";

const BillboardsPage = async () => {
  return (
    <div className="flex-col w-full">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <BillboardsClient />
      </div>
    </div>
  );
};

export default BillboardsPage;
