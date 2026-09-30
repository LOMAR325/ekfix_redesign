import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Pages of both branches (ADR 0022): /about, /reviews, /brands, the guides and the repair
// cases — a neutral header that links to both branches.
export default function SharedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header variant="shared" />
      {children}
      <Footer variant="shared" />
    </>
  );
}
