import { Outlet, useLocation } from "react-router-dom";
import Nav from "./Nav";

export default function Layout() {
  const location = useLocation();
  const isStandalonePage = ["/login", "/register", "/home"].includes(
    location.pathname,
  );
  const shellSpacing = isStandalonePage
    ? ""
    : "pt-14 lg:pl-[220px] pb-[78px] lg:pb-0";

  return (
    <div className="min-h-screen bg-[#d9d9d9]">
      {!isStandalonePage ? (
        <div className="fixed left-0 top-0 z-50 w-full">
          <Nav />
        </div>
      ) : null}

      {/* {!isAuthPage && <DashboardSidebar />} */}

      <div className={`min-h-screen ${shellSpacing}`}>
        <Outlet />
      </div>
    </div>
  );
}
