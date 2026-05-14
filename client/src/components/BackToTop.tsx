import { useEffect, useState } from "react";
import useTemplateScripts from "@/hooks/useTemplateScripts";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const { getIcon } = useTemplateScripts();

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
    <button
      onClick={scrollTop}
      className={`scroll-top fixed bottom-6 right-6 bg-primary w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer ${
        visible ? "opacity-100 flex" : "opacity-0 pointer-events-none"
      }`}
    >
     {getIcon("chevron-up", "text-white", 25)}
    </button>
  );
};

export default BackToTop;