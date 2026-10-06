import { ChevronDown } from "lucide-react";
import { ICON } from "@/components/ui/tokens";

export function SelectWrap({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {children}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-icon">
        <ChevronDown size={ICON.md} strokeWidth={1.5} />
      </div>
    </div>
  );
}
