import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import Preloader from "@/components/Preloader";
import ThemeToggle from "@/components/ThemeToggle";
import { Toaster } from "@/components/ui/sonner";

const AppContent = () => {
  return (
    <>
      <Preloader />
      <Toaster richColors position="top-right" />
      <Header />
      <main
        className="
        min-h-80
  bg-[#f7f7f7]
  dark:bg-slate-900/95

  [&_p]:leading-6

  [&_p]:text-slate-600
  dark:[&_p]:text-slate-300

  [&_h1]:text-slate-900
  [&_h2]:text-slate-900
  [&_h3]:text-slate-900

  dark:[&_h1]:text-white
  dark:[&_h2]:text-white
  dark:[&_h3]:text-white
"
      >
        <Outlet />
      </main>
      <Footer />
      <ThemeToggle />
      <BackToTop />
    </>
  );
};

export default AppContent;
