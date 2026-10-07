export default function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block mb-1 text-label text-text select-none">
      {children}
    </label>
  );
}
