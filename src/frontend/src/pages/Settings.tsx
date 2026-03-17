import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Bell, Globe, Moon, Shield, User, Wifi } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const SECTIONS = [
  { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
  {
    id: "notifications",
    label: "Notifications",
    icon: <Bell className="w-5 h-5" />,
  },
  { id: "security", label: "Security", icon: <Shield className="w-5 h-5" /> },
  {
    id: "connectivity",
    label: "Connectivity",
    icon: <Wifi className="w-5 h-5" />,
  },
  { id: "display", label: "Display", icon: <Moon className="w-5 h-5" /> },
  {
    id: "localization",
    label: "Localization",
    icon: <Globe className="w-5 h-5" />,
  },
];

export function Settings() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    security: true,
    energy: false,
  });
  const [displayName, setDisplayName] = useState("Alex");
  const [location, setLocation] = useState("Living Room");

  const handleSaveProfile = () => {
    toast.success("Profile saved");
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-6">Settings</h2>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <aside
          className="w-48 flex-shrink-0 space-y-1"
          data-ocid="settings.panel"
        >
          {SECTIONS.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer transition-colors"
              data-ocid={`settings.${s.id}.link`}
            >
              <span className="text-homiq-blue">{s.icon}</span>
              {s.label}
            </div>
          ))}
        </aside>

        <div className="flex-1 space-y-6">
          {/* Profile */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl bg-card border border-border p-6"
            data-ocid="settings.profile.card"
          >
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-homiq-blue" />
              <h3 className="font-semibold text-foreground">Profile</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-foreground">Display Name</Label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-input border-border text-foreground max-w-sm"
                  data-ocid="settings.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-foreground">Primary Location</Label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-input border-border text-foreground max-w-sm"
                  data-ocid="settings.input"
                />
              </div>
              {identity ? (
                <div>
                  <Label className="text-muted-foreground text-xs">
                    Principal ID
                  </Label>
                  <p className="text-xs text-homiq-teal font-mono mt-0.5">
                    {identity.getPrincipal().toString()}
                  </p>
                </div>
              ) : (
                <Button
                  onClick={login}
                  disabled={loginStatus === "logging-in"}
                  size="sm"
                  className="bg-homiq-blue text-white"
                  data-ocid="settings.login.button"
                >
                  {loginStatus === "logging-in"
                    ? "Connecting..."
                    : "Connect Internet Identity"}
                </Button>
              )}
              <Button
                onClick={handleSaveProfile}
                size="sm"
                className="bg-homiq-blue text-white"
                data-ocid="settings.save_button"
              >
                Save Changes
              </Button>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="rounded-2xl bg-card border border-border p-6"
            data-ocid="settings.notifications.card"
          >
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-homiq-blue" />
              <h3 className="font-semibold text-foreground">Notifications</h3>
            </div>
            <div className="space-y-4">
              {(
                [
                  {
                    key: "push",
                    label: "Push Notifications",
                    desc: "Receive alerts on your device",
                  },
                  {
                    key: "email",
                    label: "Email Alerts",
                    desc: "Get important updates via email",
                  },
                  {
                    key: "security",
                    label: "Security Alerts",
                    desc: "Notify on suspicious activity",
                  },
                  {
                    key: "energy",
                    label: "Energy Reports",
                    desc: "Weekly energy usage summary",
                  },
                ] as const
              ).map((item, i) => (
                <div key={item.key}>
                  {i > 0 && <Separator className="mb-4 bg-border" />}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                    <Switch
                      checked={notifications[item.key]}
                      onCheckedChange={(v) =>
                        setNotifications((prev) => ({ ...prev, [item.key]: v }))
                      }
                      data-ocid={`settings.${item.key}.switch`}
                      className="data-[state=checked]:bg-homiq-blue"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
