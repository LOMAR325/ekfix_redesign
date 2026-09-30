import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// The commercial branch (ADR 0022): /commercial-appliance-repair and its child pages.
export default function CommercialLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header variant="commercial" />
      {children}
      <Footer variant="commercial" />
    </>
  );
}
