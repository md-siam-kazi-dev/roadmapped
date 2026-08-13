import { cn } from "@/lib/utils";

export function TrailConnector({
  filled,
  orientation = "horizontal",
}: {
  filled: boolean;
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <div
      data-trail-connector
      data-filled={filled}
      className={cn(
        "rounded-full",
        orientation === "horizontal" ? "h-0.5 flex-1" : "w-0.5 flex-1",
        filled ? "bg-primary" : "bg-border"
      )}
    />
  );
}