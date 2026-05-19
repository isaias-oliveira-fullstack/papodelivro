import { useEffect, useState } from "react";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <i
      onClick={scrollTop}
      className={`lni lni-chevron-up text-xl scroll-top fixed bottom-6 right-6 text-slate-100 bg-primary w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-primary/60 transition-all cursor-pointer ${
        visible ? "opacity-100 flex" : "opacity-0 pointer-events-none"
      }`}
    >
    </i>
  );
};

export default BackToTop;