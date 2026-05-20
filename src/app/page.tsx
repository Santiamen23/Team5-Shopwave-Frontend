import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/layout/Hero";
import Footer from "@/components/layout/Footer";

import ProductCard from "@/components/ui/ProductCard";

const products = [
  {
    title: "iPhone 15 Pro",
    price: 999,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
  },
  {
    title: "MacBook Pro",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",
  },
  {
    title: "AirPods Max",
    price: 699,
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b",
  },
];

export default function HomePage() {
  return (
    <main>

      <Navbar />

      <Hero />

      <section className="container mx-auto px-4 py-20">

        <h2 className="text-4xl font-bold mb-10">
          Productos destacados
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {products.map((product) => (
            <ProductCard
              key={product.title}
              {...product}
            />
          ))}

        </div>

      </section>

      <Footer />

    </main>
  );
}