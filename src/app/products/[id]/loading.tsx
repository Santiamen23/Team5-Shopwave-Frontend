import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Skeleton className="aspect-[4/3] rounded-[2rem]" />
        <div className="space-y-6">
          <Skeleton className="h-[540px] rounded-[2rem]" />
          <Skeleton className="h-[260px] rounded-[2rem]" />
        </div>
      </div>
    </main>
  );
}