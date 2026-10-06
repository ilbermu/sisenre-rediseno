export default function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block mb-1 text-label text-text select-none tracking-wide">
      {children}
    </label>
  );
}
