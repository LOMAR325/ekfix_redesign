import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// The residential branch (ADR 0022): /appliance-repair and its 12 services, /towns and its pages.
export default function ResidentialLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header variant="residential" />
      {children}
      <Footer variant="residential" />
    </>
  );
}
