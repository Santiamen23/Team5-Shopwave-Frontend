import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/products/product-detail";
import { getProductById } from "@/services/product.service";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
