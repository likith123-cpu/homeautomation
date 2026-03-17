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
import { Switch } from "@/components/ui/switch";
import { Clock, Plus, ToggleLeft, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { SAMPLE_SCHEDULES } from "../data/sampleData";

type Schedule = (typeof SAMPLE_SCHEDULES)[0];

export function Schedules() {
  const [schedules, setSchedules] = useState<Schedule[]>(SAMPLE_SCHEDULES);
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [days, setDays] = useState("Daily");

  const toggleActive = (id: number) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)),
    );
  };

  const handleDelete = (id: number) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    toast.success("Schedule deleted");
  };

  const handleCreate = () => {
    if (!label.trim() || !time) return;
    const newSchedule: Schedule = {
      id: Date.now(),
      time,
      label: label.trim(),
      description: description.trim(),
      status: "Upcoming",
      days,
      active: true,
    };
    setSchedules((prev) => [...prev, newSchedule]);
    toast.success(`Schedule "${label}" created`);
    setOpen(false);
    setLabel("");
    setTime("");
    setDescription("");
    setDays("Daily");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">
          Automation Schedules
        </h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="gap-1.5 bg-homiq-blue hover:bg-homiq-blue/90 text-white"
              data-ocid="schedules.open_modal_button"
            >
              <Plus className="w-4 h-4" /> New Schedule
            </Button>
          </DialogTrigger>
          <DialogContent
            className="bg-card border-border"
            data-ocid="schedules.dialog"
          >
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Create Schedule
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label className="text-foreground">Label</Label>
                <Input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Morning Routine"
                  className="bg-input border-border text-foreground"
                  data-ocid="schedules.input"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Time</Label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-input border-border text-foreground"
                  data-ocid="schedules.input"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Description</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What should happen?"
                  className="bg-input border-border text-foreground"
                  data-ocid="schedules.input"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Repeat</Label>
                <Input
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  placeholder="e.g. Daily, Mon–Fri"
                  className="bg-input border-border text-foreground"
                  data-ocid="schedules.input"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setOpen(false)}
                data-ocid="schedules.cancel_button"
                className="text-muted-foreground"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!label.trim() || !time}
                className="bg-homiq-blue text-white"
                data-ocid="schedules.submit_button"
              >
                Create Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {schedules.length === 0 && (
        <div className="text-center py-16" data-ocid="schedules.empty_state">
          <ToggleLeft className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            No schedules yet. Create one to automate your home.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {schedules.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
            className={`rounded-2xl bg-card border border-border p-5 transition-opacity ${
              s.active ? "" : "opacity-60"
            }`}
            data-ocid={`schedules.item.${i + 1}`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-homiq-blue/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-homiq-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{s.label}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {s.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-lg font-bold text-foreground">
                        {s.time}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {s.days}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          s.status === "Upcoming"
                            ? "bg-homiq-green/15 text-homiq-green"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Switch
                      checked={s.active}
                      onCheckedChange={() => toggleActive(s.id)}
                      data-ocid={`schedules.switch.${i + 1}`}
                      className="data-[state=checked]:bg-homiq-blue"
                    />
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id)}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      data-ocid={`schedules.delete_button.${i + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
