import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import { initializeApiConfig } from "./services/config";
import { Loader } from "./components/Loader";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import AppSidebar from "./components/sidebar/app-sidebar";
import { Button } from "./components/ui/button";
import { BottomNavBar } from "./components/BottomNavBar";
import { useMediaQuery } from "./hooks/useMediaQuery";
import { cn } from "./lib/utils";

const Root = () => {
  const [configLoading, setConfigLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const initConfig = async () => {
    try {
      await initializeApiConfig();
      setConfigError(null);
      setConfigLoading(false);
    } catch (error) {
      console.error("Failed to initialize API config:", error);
      setConfigError(
        "خطا در بارگذاری تنظیمات برنامه. لطفاً دوباره امتحان کنید."
      );
      setConfigLoading(false);
    }
  };

  useEffect(() => {
    initConfig();
  }, [retryCount]);

  const handleRetry = () => {
    setConfigError(null);
    setConfigLoading(true);
    setRetryCount((prev) => prev + 1);
  };

  if (configLoading) {
    return <Loader />;
  }

  if (configError) {
    return (
      <div className="flex h-screen w-screen justify-center items-center bg-background text-foreground p-8">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold text-destructive">{configError}</h2>
          <p className="text-muted-foreground">
            مشکلی در اتصال به سرور وجود دارد. لطفاً اتصال اینترنت خود را بررسی
            کنید.
          </p>
          <Button onClick={handleRetry} className="mt-4">
            تلاش مجدد
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden w-full">
        <main
          className={cn(
            "p-3 sm:p-4 md:p-6",
            !isDesktop && "pb-24" // Add bottom padding for mobile footer navbar
          )}
        >
          <Outlet />
        </main>
      </SidebarInset>
      {!isDesktop && <BottomNavBar />}
    </SidebarProvider>
  );
};

export default Root;
