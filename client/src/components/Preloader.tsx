import { useEffect, useState } from "react";

export default function Preloader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setTimeout(() => setShow(false), 1000);
  }, []);

  if (!show) return null;

  return (
    <div id="preloader" className="fixed w-full h-full bg-white z-999999">
      <div className="animate-spin border-4 border-purple-600 border-t-gray-100 rounded-full w-12 h-12 m-auto mt-[20%]" />
    </div>
  );
}