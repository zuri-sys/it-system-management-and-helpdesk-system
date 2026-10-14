import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function RouteFocus() {
  const { pathname } = useLocation();
  useEffect(() => {
    const heading = document.querySelector("h1");
    document.title = heading
      ? heading.textContent + " | IT Helpdesk"
      : "IT Helpdesk";
    if (heading) {
      heading.tabIndex = -1;
      heading.focus();
    }
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
