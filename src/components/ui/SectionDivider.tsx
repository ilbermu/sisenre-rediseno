export default function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-3 mt-1">
      <span className="text-heading-xs uppercase text-text-muted whitespace-nowrap select-none">
        {title}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
