import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Camera,
  ChevronsUpDown,
  Lightbulb,
  Plug,
  Plus,
  Search,
  Thermometer,
  Wind,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { DeviceType } from "../backend";
import { DeviceRow } from "../components/DeviceRow";
import { SAMPLE_DEVICES, SAMPLE_ROOMS } from "../data/sampleData";
import {
  useAddDevice,
  useGetAllDevices,
  useGetAllRooms,
} from "../hooks/useQueries";

const DEVICE_TYPE_ICONS: Record<DeviceType, React.ReactNode> = {
  [DeviceType.light]: <Lightbulb className="w-4 h-4" />,
  [DeviceType.thermostat]: <Thermometer className="w-4 h-4" />,
  [DeviceType.plug]: <Plug className="w-4 h-4" />,
  [DeviceType.fan]: <Wind className="w-4 h-4" />,
  [DeviceType.blind]: <ChevronsUpDown className="w-4 h-4" />,
  [DeviceType.camera]: <Camera className="w-4 h-4" />,
};

const TYPE_FILTERS = [
  { value: "all", label: "All" },
  { value: DeviceType.light, label: "Lights" },
  { value: DeviceType.thermostat, label: "Thermostats" },
  { value: DeviceType.fan, label: "Fans" },
  { value: DeviceType.plug, label: "Plugs" },
  { value: DeviceType.camera, label: "Cameras" },
  { value: DeviceType.blind, label: "Blinds" },
];

export function Devices() {
  const { data: roomsData } = useGetAllRooms();
  const { data: devicesData } = useGetAllDevices();
  const { mutate: addDevice, isPending: isAdding } = useAddDevice();

  const rooms = roomsData && roomsData.length > 0 ? roomsData : SAMPLE_ROOMS;
  const devices =
    devicesData && devicesData.length > 0 ? devicesData : SAMPLE_DEVICES;

  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<DeviceType>(DeviceType.light);
  const [newRoomId, setNewRoomId] = useState<string>("");

  const filtered = devices.filter((d) => {
    const matchType = filter === "all" || d.deviceType === filter;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const getRoomName = (roomId: bigint) =>
    rooms.find((r) => r.id === roomId)?.name ?? "Unknown";

  const handleAdd = () => {
    if (!newName.trim() || !newRoomId) return;
    addDevice(
      { roomId: BigInt(newRoomId), name: newName.trim(), deviceType: newType },
      {
        onSuccess: () => {
          toast.success(`Device "${newName}" added`);
          setOpen(false);
          setNewName("");
        },
        onError: () => toast.error("Failed to add device"),
      },
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">All Devices</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="gap-1.5 bg-homiq-blue hover:bg-homiq-blue/90 text-white"
              data-ocid="devices.open_modal_button"
            >
              <Plus className="w-4 h-4" /> Add Device
            </Button>
          </DialogTrigger>
          <DialogContent
            className="bg-card border-border"
            data-ocid="devices.dialog"
          >
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Add New Device
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label className="text-foreground">Device Name</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Ceiling Light"
                  className="bg-input border-border text-foreground"
                  data-ocid="devices.input"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Type</Label>
                <Select
                  value={newType}
                  onValueChange={(v) => setNewType(v as DeviceType)}
                >
                  <SelectTrigger
                    className="bg-input border-border text-foreground"
                    data-ocid="devices.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {Object.values(DeviceType).map((t) => (
                      <SelectItem
                        key={t}
                        value={t}
                        className="text-foreground capitalize"
                      >
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Room</Label>
                <Select value={newRoomId} onValueChange={setNewRoomId}>
                  <SelectTrigger
                    className="bg-input border-border text-foreground"
                    data-ocid="devices.select"
                  >
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {rooms.map((r) => (
                      <SelectItem
                        key={String(r.id)}
                        value={String(r.id)}
                        className="text-foreground"
                      >
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setOpen(false)}
                data-ocid="devices.cancel_button"
                className="text-muted-foreground"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAdd}
                disabled={isAdding || !newName.trim() || !newRoomId}
                className="bg-homiq-blue text-white"
                data-ocid="devices.submit_button"
              >
                {isAdding ? "Adding..." : "Add Device"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters + search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search devices…"
            className="pl-9 bg-input border-border text-foreground"
            data-ocid="devices.search_input"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TYPE_FILTERS.map((f) => (
            <button
              type="button"
              key={f.value}
              onClick={() => setFilter(f.value)}
              data-ocid="devices.filter.tab"
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filter === f.value
                  ? "bg-homiq-blue text-white"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Device grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16" data-ocid="devices.empty_state">
          <p className="text-muted-foreground">No devices found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((device, i) => (
            <motion.div
              key={String(device.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="rounded-xl bg-card border border-border px-4 py-3"
              data-ocid={`devices.item.${i + 1}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-muted-foreground">
                  {DEVICE_TYPE_ICONS[device.deviceType]}
                </span>
                <Badge
                  variant="outline"
                  className="text-xs border-border text-muted-foreground capitalize"
                >
                  {device.deviceType}
                </Badge>
                <span className="ml-auto text-xs text-muted-foreground">
                  {getRoomName(device.roomId)}
                </span>
              </div>
              <DeviceRow device={device} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
