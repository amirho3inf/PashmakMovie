import {
  HeartIcon,
  Home,
  Search,
  SparklesIcon,
  TvIcon,
  VideoIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router";
import { Button } from "../ui/button";

const items = [
  {
    title: "خانه",
    url: "/",
    icon: Home,
  },
  {
    title: "جستجو",
    url: "/search",
    icon: Search,
  },
  {
    title: "فیلم ها",
    url: "/movies",
    icon: VideoIcon,
  },
  {
    title: "سریال ها",
    url: "/series",
    icon: TvIcon,
  },
  {
    title: "انیمیشن / انیمه",
    url: "/anime",
    icon: SparklesIcon,
  },
  {
    title: "علاقه مندی ها",
    url: "/favorites",
    icon: HeartIcon,
  },
];

export default function AppSidebar() {
  return (
    <Sidebar side="right">
      <SidebarHeader>
        <h1 className="text-2xl font-bold pr-4 pt-4 text-pretty text-primary">
          پشمک‌ مووی
        </h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="space-y-2">
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Button
                    className="py-6.5 text-lg justify-start"
                    asChild
                    variant="ghost"
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
