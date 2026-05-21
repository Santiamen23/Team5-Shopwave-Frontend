import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Skeleton className="aspect-[4/3] rounded-[2rem]" />
        <div className="space-y-6">
          <Skeleton className="h-[28rem] rounded-[2rem] sm:h-[32rem]" />
          <Skeleton className="h-[18rem] rounded-[2rem] sm:h-[20rem]" />
        </div>
      </div>
    </main>
  );
}