import { Outlet } from "react-router";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import AppSidebar from "./components/sidebar/app-sidebar";
import { initializeApiConfig } from "./services/config";

const Root = () => {
  initializeApiConfig();

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="overflow-x-hidden w-full">
        <main className="p-6 ">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Root;
