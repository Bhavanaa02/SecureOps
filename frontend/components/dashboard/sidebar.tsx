"use client";

import { useState } from "react";

import {
  LayoutDashboard,
  Code,
  Package,
  Key,
  BrainCircuit,
  FileBarChart,
  Settings,
  ChevronLeft,
  Shield,
} from "lucide-react";

import { cn } from "@/lib/utils";


const menuItems = [

  {
    icon: LayoutDashboard,
    label: "Overview",
  },

  {
    icon: Code,
    label: "SAST Analysis",
  },

  {
    icon: Package,
    label: "SCA Check",
  },

  {
    icon: Key,
    label: "Secrets Scan",
  },

  {
    icon: BrainCircuit,
    label: "AI Advisory",
  },

  {
    icon: FileBarChart,
    label: "Reports",
  },

  {
    icon: Settings,
    label: "Settings",
  },

];


export function Sidebar({
  activeItem,
  setActiveItem,
}: any) {

  const [collapsed, setCollapsed] =
    useState(false);

  return (

    <aside
      className={cn(
        "fixed left-0 top-0 h-screen glass-card border-r border-border/50 flex flex-col transition-all duration-300 z-50",
        collapsed
          ? "w-20"
          : "w-64"
      )}
    >


      {/* LOGO */}
      <div className="flex items-center gap-3 p-6 border-b border-border/50">

        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">

          <Shield className="w-5 h-5 text-background" />

        </div>

        {!collapsed && (

          <div>

            <span className="font-bold text-lg text-cyan-400">
              SecureOps
            </span>

            <p className="text-xs text-muted-foreground">
              DevSecOps Platform
            </p>

          </div>

        )}

      </div>



      {/* MENU */}
      <nav className="flex-1 p-4 space-y-2">

        {menuItems.map(
          (item) => {

            const Icon =
              item.icon;

            const isActive =
              activeItem ===
              item.label;

            return (

              <button
                key={item.label}
                onClick={() =>
                  setActiveItem(
                    item.label
                  )
                }
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-muted-foreground"
                )}
              >

                <Icon className="w-5 h-5" />

                {!collapsed && (

                  <span className="text-sm font-medium">
                    {item.label}
                  </span>

                )}

              </button>

            );

          }
        )}

      </nav>



      {/* COLLAPSE */}
      <div className="p-4 border-t border-border/50">

        <button
          onClick={() =>
            setCollapsed(
              !collapsed
            )
          }
          className="w-full flex justify-center"
        >

          <ChevronLeft
            className={cn(
              "w-5 h-5",
              collapsed &&
                "rotate-180"
            )}
          />

        </button>

      </div>

    </aside>

  );
}