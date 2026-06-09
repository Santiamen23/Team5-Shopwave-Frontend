import { notFound } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import { ProductDetail } from "@/components/products/product-detail";
import { getProductById } from "@/services/product.service";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <ProductDetail product={product} />
    </main>
  );
}
