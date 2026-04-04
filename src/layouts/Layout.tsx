import { Outlet, useLocation } from "react-router-dom";


export default function Layout() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  const shellSpacing = isAuthPage
    ? "pt-14"
    : "pt-14 lg:pl-[220px] pb-[78px] lg:pb-0";

  return (
    <div className="min-h-screen bg-[#d9d9d9]">
      <div className={`min-h-screen ${shellSpacing}`}>
        <Outlet />
      </div>
    </div>
  );
}

