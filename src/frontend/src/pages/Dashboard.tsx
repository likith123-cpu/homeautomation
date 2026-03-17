import {
  Calendar,
  CheckCircle2,
  Clock,
  Cpu,
  Droplets,
  MoreVertical,
  ShieldCheck,
  Thermometer,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DeviceType } from "../backend";
import { DeviceRow } from "../components/DeviceRow";
import {
  ENERGY_DATA,
  SAMPLE_DEVICES,
  SAMPLE_ROOMS,
  SAMPLE_SCHEDULES,
  TOP_DEVICES_ENERGY,
} from "../data/sampleData";
import { useGetAllDevices, useGetAllRooms } from "../hooks/useQueries";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4 },
  }),
};

export function Dashboard() {
  const { data: roomsData } = useGetAllRooms();
  const { data: devicesData } = useGetAllDevices();

  const rooms = roomsData && roomsData.length > 0 ? roomsData : SAMPLE_ROOMS;
  const devices =
    devicesData && devicesData.length > 0 ? devicesData : SAMPLE_DEVICES;

  const stats = useMemo(() => {
    const onCount = devices.filter((d) => d.isOn).length;
    const thermostats = devices.filter(
      (d) => d.deviceType === DeviceType.thermostat,
    );
    const avgTemp = thermostats.length
      ? Math.round(
          thermostats.reduce((s, d) => s + Number(d.temperature), 0) /
            thermostats.length,
        )
      : 22;
    return { onCount, avgTemp };
  }, [devices]);

  const firstThreeRooms = rooms.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Section 1: Glance */}
      <motion.section
        custom={0}
        initial="hidden"
        animate="visible"
        variants={FADE_UP}
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Your Home At A Glance
        </h2>
        <div className="rounded-2xl bg-card border border-border p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlanceTile
            icon={<Cpu className="w-5 h-5" />}
            color="text-homiq-blue"
            bg="bg-homiq-blue/10"
            label="Devices On"
            value={`${stats.onCount}`}
            sub={`/ ${devices.length} total`}
          />
          <GlanceTile
            icon={<Thermometer className="w-5 h-5" />}
            color="text-homiq-orange"
            bg="bg-homiq-orange/10"
            label="Temperature"
            value={`${stats.avgTemp}°C`}
            sub="Avg indoor"
          />
          <GlanceTile
            icon={<Droplets className="w-5 h-5" />}
            color="text-homiq-teal"
            bg="bg-homiq-teal/10"
            label="Humidity"
            value="58%"
            sub="Comfortable"
          />
          <GlanceTile
            icon={<ShieldCheck className="w-5 h-5" />}
            color="text-homiq-green"
            bg="bg-homiq-green/10"
            label="Security"
            value="Armed"
            sub="All sensors OK"
          />
        </div>
      </motion.section>

      {/* Section 2: Room Controls */}
      <motion.section
        custom={1}
        initial="hidden"
        animate="visible"
        variants={FADE_UP}
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Room-Based Controls
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {firstThreeRooms.map((room) => {
            const roomDevices = devices.filter((d) => d.roomId === room.id);
            return (
              <div
                key={String(room.id)}
                className="rounded-2xl bg-card border border-border p-5"
                data-ocid={`room.card.${Number(room.id)}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {room.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {roomDevices.filter((d) => d.isOn).length} /{" "}
                      {roomDevices.length} active
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    data-ocid={`room.card.${Number(room.id)}`}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <div className="divide-y divide-border">
                  {roomDevices.slice(0, 3).map((device) => (
                    <DeviceRow
                      key={String(device.id)}
                      device={device}
                      compact
                    />
                  ))}
                  {roomDevices.length === 0 && (
                    <p
                      className="text-xs text-muted-foreground py-3"
                      data-ocid="room.empty_state"
                    >
                      No devices in this room
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Section 3: Schedules */}
      <motion.section
        custom={2}
        initial="hidden"
        animate="visible"
        variants={FADE_UP}
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Automation Schedules
        </h2>
        <div className="rounded-2xl bg-card border border-border p-5 space-y-0 divide-y divide-border">
          {SAMPLE_SCHEDULES.slice(0, 2).map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-4 py-4"
              data-ocid={`schedule.item.${s.id}`}
            >
              <div className="w-10 h-10 rounded-xl bg-homiq-blue/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-homiq-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {s.label}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {s.description}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-foreground">{s.time}</p>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    s.status === "Upcoming"
                      ? "bg-homiq-green/15 text-homiq-green"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Section 4: Energy */}
      <motion.section
        custom={3}
        initial="hidden"
        animate="visible"
        variants={FADE_UP}
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Energy Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bar chart */}
          <div className="rounded-2xl bg-card border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Daily Usage Chart
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={ENERGY_DATA} barGap={2} barCategoryGap="25%">
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 11, fill: "#A7B6C7" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#A7B6C7" }}
                  axisLine={false}
                  tickLine={false}
                  unit="kW"
                  width={38}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.22 0.04 248)",
                    border: "1px solid oklch(0.32 0.04 248 / 40%)",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "#EAF2FF" }}
                  itemStyle={{ color: "#A7B6C7" }}
                />
                <Bar
                  dataKey="usage"
                  fill="oklch(0.61 0.18 252)"
                  radius={[4, 4, 0, 0]}
                  name="Active"
                />
                <Bar
                  dataKey="standby"
                  fill="oklch(0.75 0.15 70)"
                  radius={[4, 4, 0, 0]}
                  name="Standby"
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-3">
              <LegendDot color="bg-homiq-blue" label="Active Usage" />
              <LegendDot color="bg-homiq-orange" label="Standby" />
            </div>
          </div>

          {/* Top devices */}
          <div className="rounded-2xl bg-card border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Top Devices
            </h3>
            <div className="space-y-3">
              {TOP_DEVICES_ENERGY.map((d, i) => (
                <div
                  key={d.name}
                  className="flex items-center gap-3"
                  data-ocid={`energy.item.${i + 1}`}
                >
                  <CheckCircle2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-foreground truncate">
                        {d.name}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {d.watts}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-homiq-blue transition-all"
                        style={{ width: `${d.usage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="text-center pt-4 pb-2">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-homiq-blue hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

function GlanceTile({
  icon,
  color,
  bg,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  color: string;
  bg: string;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center flex-shrink-0`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold text-foreground leading-tight">
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2.5 h-2.5 rounded-sm ${color}`} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export { Calendar };
