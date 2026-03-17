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
  Bath,
  BedDouble,
  Car,
  ChefHat,
  Monitor,
  Pencil,
  Plus,
  Sofa,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { SAMPLE_DEVICES, SAMPLE_ROOMS } from "../data/sampleData";
import {
  useCreateRoom,
  useDeleteRoom,
  useGetAllDevices,
  useGetAllRooms,
} from "../hooks/useQueries";

const ROOM_ICONS: Record<string, React.ReactNode> = {
  sofa: <Sofa className="w-6 h-6" />,
  "chef-hat": <ChefHat className="w-6 h-6" />,
  bed: <BedDouble className="w-6 h-6" />,
  monitor: <Monitor className="w-6 h-6" />,
  bath: <Bath className="w-6 h-6" />,
  car: <Car className="w-6 h-6" />,
};

const ICON_OPTIONS = [
  { value: "sofa", label: "Living Room" },
  { value: "chef-hat", label: "Kitchen" },
  { value: "bed", label: "Bedroom" },
  { value: "monitor", label: "Office" },
  { value: "bath", label: "Bathroom" },
  { value: "car", label: "Garage" },
];

export function Rooms() {
  const { data: roomsData } = useGetAllRooms();
  const { data: devicesData } = useGetAllDevices();
  const { mutate: createRoom, isPending: isCreating } = useCreateRoom();
  const { mutate: deleteRoom } = useDeleteRoom();

  const rooms = roomsData && roomsData.length > 0 ? roomsData : SAMPLE_ROOMS;
  const devices =
    devicesData && devicesData.length > 0 ? devicesData : SAMPLE_DEVICES;

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("sofa");

  const handleCreate = () => {
    if (!name.trim()) return;
    createRoom(
      { name: name.trim(), icon },
      {
        onSuccess: () => {
          toast.success(`Room "${name}" created`);
          setOpen(false);
          setName("");
          setIcon("sofa");
        },
        onError: () => toast.error("Failed to create room"),
      },
    );
  };

  const handleDelete = (id: bigint, roomName: string) => {
    deleteRoom(id, {
      onSuccess: () => toast.success(`Room "${roomName}" deleted`),
      onError: () => toast.error("Failed to delete room"),
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">All Rooms</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="gap-1.5 bg-homiq-blue hover:bg-homiq-blue/90 text-white"
              data-ocid="rooms.open_modal_button"
            >
              <Plus className="w-4 h-4" /> Add Room
            </Button>
          </DialogTrigger>
          <DialogContent
            className="bg-card border-border"
            data-ocid="rooms.dialog"
          >
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Create New Room
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="room-name" className="text-foreground">
                  Room Name
                </Label>
                <Input
                  id="room-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Living Room"
                  className="bg-input border-border text-foreground"
                  data-ocid="rooms.input"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Icon</Label>
                <Select value={icon} onValueChange={setIcon}>
                  <SelectTrigger
                    className="bg-input border-border text-foreground"
                    data-ocid="rooms.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {ICON_OPTIONS.map((o) => (
                      <SelectItem
                        key={o.value}
                        value={o.value}
                        className="text-foreground"
                      >
                        {o.label}
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
                data-ocid="rooms.cancel_button"
                className="text-muted-foreground"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={isCreating || !name.trim()}
                className="bg-homiq-blue text-white"
                data-ocid="rooms.submit_button"
              >
                {isCreating ? "Creating..." : "Create Room"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room, i) => {
          const roomDevices = devices.filter((d) => d.roomId === room.id);
          const activeCount = roomDevices.filter((d) => d.isOn).length;
          const icon = ROOM_ICONS[room.icon] ?? <Sofa className="w-6 h-6" />;
          return (
            <motion.div
              key={String(room.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              className="rounded-2xl bg-card border border-border p-5 group"
              data-ocid={`rooms.item.${i + 1}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-homiq-blue/10 text-homiq-blue flex items-center justify-center">
                  {icon}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    data-ocid={`rooms.edit_button.${i + 1}`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(room.id, room.name)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    data-ocid={`rooms.delete_button.${i + 1}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="text-base font-semibold text-foreground">
                {room.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {roomDevices.length} device{roomDevices.length !== 1 ? "s" : ""}{" "}
                · {activeCount} active
              </p>
              {roomDevices.length === 0 && (
                <p
                  className="text-xs text-muted-foreground mt-2 italic"
                  data-ocid="rooms.empty_state"
                >
                  No devices added yet
                </p>
              )}
              {activeCount > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {roomDevices
                    .filter((d) => d.isOn)
                    .slice(0, 3)
                    .map((d) => (
                      <span
                        key={String(d.id)}
                        className="text-xs px-2 py-0.5 rounded-full bg-homiq-blue/15 text-homiq-blue"
                      >
                        {d.name}
                      </span>
                    ))}
                  {activeCount > 3 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      +{activeCount - 3} more
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
