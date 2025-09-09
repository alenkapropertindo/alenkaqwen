import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import ProductsClientPage from "./products-client";

export default async function ProductsPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    redirect("/");
  }

  return <ProductsClientPage />;
}
