import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function Header() {
  const [now, setNow] = useState(new Date());
  const { identity, login, loginStatus } = useInternetIdentity();

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal ? `${principal.slice(0, 5)}...` : null;

  return (
    <header
      className="flex items-start justify-between mb-8"
      data-ocid="header.panel"
    >
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Welcome Home, Alex!
        </h1>
        <div className="flex items-center gap-1.5 mt-1">
          <MapPin className="w-4 h-4 text-homiq-blue" />
          <span className="text-sm text-muted-foreground">Living Room</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-foreground">
            {formattedDate}
          </p>
          <p className="text-xs text-muted-foreground">{formattedTime}</p>
        </div>
        <div className="relative cursor-pointer" data-ocid="header.bell.button">
          <Bell className="w-6 h-6 text-muted-foreground hover:text-foreground transition-colors" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-homiq-orange border-2 border-background" />
        </div>
        {identity ? (
          <Avatar
            className="w-9 h-9 cursor-pointer"
            data-ocid="header.avatar.button"
          >
            <AvatarFallback className="bg-homiq-blue text-white text-xs font-bold">
              {shortPrincipal ?? "A"}
            </AvatarFallback>
          </Avatar>
        ) : (
          <button
            type="button"
            onClick={login}
            disabled={loginStatus === "logging-in"}
            data-ocid="header.login.button"
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-homiq-blue text-white hover:opacity-90 transition-opacity"
          >
            {loginStatus === "logging-in" ? "Connecting..." : "Connect"}
          </button>
        )}
      </div>
    </header>
  );
}
