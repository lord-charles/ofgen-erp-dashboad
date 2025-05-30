"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function GreetingHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div
      className={cn(
        "space-y-3 transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      {/* Main greeting */}
      <div className="">
        <h1
          className={cn(
            "text-xl md:text-2xl font-semibold tracking-tight transition-all duration-300",
            "text-foreground hover:text-foreground/90"
          )}
        >
          {getGreeting()}, Charles Mwaniki
        </h1>
        <div className="flex items-center gap-1">
          <p
            className={cn(
              "text-xs text-muted-foreground transition-colors duration-300"
            )}
          >
            {formatDate(currentTime)}
          </p>
          <div className="space-y-0.5">
            {/* Live time display */}
            <div
              className={cn(
                "inline-flex items-center gap-2 px-3 py-0.5 rounded-lg",
                "bg-muted/50 border border-border/50",
                "transition-all duration-300 hover:bg-muted/70"
              )}
            >
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span
                className={cn(
                  "font-mono text-[8px] font-medium text-muted-foreground"
                )}
              >
                {formatTime(currentTime)}
              </span>
            </div>

            {/* Subtle divider */}
            <div
              className={cn(
                "h-px w-24 rounded-full transition-all duration-500 ease-out",
                "bg-gradient-to-r from-border to-transparent",
                isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0",
                "origin-left"
              )}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
