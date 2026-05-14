import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import { DynamicIcon } from "lucide-react/dynamic";

const useTemplateScripts = () => {
  const { signed, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const navbar = document.querySelector(".navbar-area") as HTMLElement | null;
    //const menu = document.querySelector("#main-menu") as HTMLElement | null;
    const btn = document.querySelector("#navbar-toggler") as HTMLElement | null;
    const elements = document.querySelectorAll("section, .section");
    const targetId = location.state?.section || location.hash?.replace("#", "");

    const sections = [
      "inicio",
      "sobre",
      "etapas",
      "biblioteca",
      "recursos",
      "contato",
      "root",
    ];

    const handleScroll = () => {
      if (!navbar) return;

      if (window.scrollY > navbar.offsetTop) {
        navbar.classList.add(
          "fixed",
          "top-0",
          "z-999999",
          "shadow",
          "w-full",
          "bg-primary",
          "dark:bg-dark-primary",
        );
        navbar.classList.remove("bg-transparent", "dark:bg-transparent", "relative");
      } else {
        navbar.classList.add("relative");
        navbar.classList.remove(
          "fixed",
          "top-0",
          "z-999999",
          "shadow",
          "w-full",
        );
        if (location.pathname === "/") {
          navbar.classList.add("bg-transparent", "dark:bg-transparent");
          navbar.classList.remove("bg-primary", "dark:bg-dark-primary");
        } else {
          navbar.classList.add("bg-primary", "dark:bg-dark-primary");
          navbar.classList.remove("bg-transparent", "dark:bg-transparent");
        }
      }

      const scrollPos = window.scrollY + 150;
      let current = "";

      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;

        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;

        if (scrollPos >= top && scrollPos < bottom) {
          current = id;
          break;
        }
      }

      setActiveSection((prev) => (prev !== current ? current : prev));
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    const handleMenuToggle = () => {
  console.log("clicou");

  const menu = document.querySelector("#main-menu") as HTMLElement | null;
  if (!menu) return;

  menu.classList.toggle("hidden");
};

if (btn) {
  btn.onclick = handleMenuToggle;
}

    if (!targetId) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    const scrollToSection = () => {
      const el = document.getElementById(targetId);

      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 100;

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });
      }
    };

    requestAnimationFrame(scrollToSection);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;

          const delay = el.dataset.delay || "0";
          el.style.transitionDelay = `${delay}ms`;

          if (entry.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          } else {
            el.style.opacity = "0";
            el.style.transform = "translateY(60px)";
          }
        });
      },
      {
        threshold: 0.2,
      },
    );

    elements.forEach((el) => {
      const htmlEl = el as HTMLElement;

      htmlEl.style.opacity = "0";
      htmlEl.style.transform = "translateY(60px)";
      htmlEl.style.transition = "all 0.7s ease-out";

      observer.observe(el);
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [location]);

  const handleLogout = () => {
    signOut();
    setDropdownOpen(false);
    navigate("/");
  };

  const getIcon = (name: string, className?: string, size = 28) => {
    return <DynamicIcon name={name as any} size={size} className={className} />;
  };

  return {
    activeSection,
    pathname: location.pathname,
    navigate,
    signed,
    user,
    handleLogout,
    dropdownOpen,
    dropdownRef,
    setDropdownOpen,
    getIcon,
  };
};

export default useTemplateScripts;
