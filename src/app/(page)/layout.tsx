import type { ReactNode } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-grow pt-16 md:pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
