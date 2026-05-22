import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  price: number;
  image: string;
}

export default function ProductCard({
  title,
  price,
  image,
}: Props) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">

      <div className="relative h-64 w-full">

        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />

      </div>

      <CardContent className="p-5">

        <h2 className="font-bold text-lg">
          {title}
        </h2>

        <p className="text-muted-foreground mt-2">
          ${price}
        </p>

        <Button className="w-full mt-5">
          Agregar al carrito
        </Button>

      </CardContent>

    </Card>
  );
}