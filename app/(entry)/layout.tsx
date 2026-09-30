import { EntryHeader } from "@/components/EntryHeader";
import { EntryFooter } from "@/components/EntryFooter";

// The entry page `/` (ADR 0022): the minimal header and the thin footer, no menu.
export default function EntryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <EntryHeader />
      {children}
      <EntryFooter />
    </>
  );
}
