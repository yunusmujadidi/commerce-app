import { Billboard } from "@/components/billboard";
import { Heading } from "@/components/heading";
import { ProductList } from "@/components/product-list";
import { getBillboard } from "@/actions/billboard-action";
import { getProductsMainPage } from "@/actions/product-action";

const Home = async () => {
  // TODO: maybe add billboard isMain tag
  const billboard = await getBillboard();

  const products = await getProductsMainPage();

  if (!billboard) {
    return;
  }

  return (
    <>
      <Billboard data={billboard} />
      <div className="flex flex-col gap-y-8 px-4 md:px-6 mx-0 xl:mx-32">
        <Heading title="Featured Products" className="my-6" />
        <ProductList products={products} />
      </div>
    </>
  );
};

export default Home;
