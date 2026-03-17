import { Activity, DollarSign, TrendingDown, Zap } from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ENERGY_DATA, TOP_DEVICES_ENERGY } from "../data/sampleData";

const WEEKLY_DATA = [
  { day: "Mon", usage: 18.2, prev: 20.1 },
  { day: "Tue", usage: 21.4, prev: 19.8 },
  { day: "Wed", usage: 15.9, prev: 22.3 },
  { day: "Thu", usage: 24.1, prev: 21.0 },
  { day: "Fri", usage: 19.7, prev: 23.5 },
  { day: "Sat", usage: 28.3, prev: 25.2 },
  { day: "Sun", usage: 22.6, prev: 24.8 },
];

export function Energy() {
  const totalToday = ENERGY_DATA.reduce(
    (s, d) => s + d.usage + d.standby,
    0,
  ).toFixed(1);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Energy Overview</h2>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: <Zap className="w-5 h-5" />,
            label: "Today",
            value: `${totalToday} kWh`,
            color: "text-homiq-blue",
            bg: "bg-homiq-blue/10",
          },
          {
            icon: <TrendingDown className="w-5 h-5" />,
            label: "vs Yesterday",
            value: "−12%",
            color: "text-homiq-green",
            bg: "bg-homiq-green/10",
          },
          {
            icon: <DollarSign className="w-5 h-5" />,
            label: "Est. Cost",
            value: "$3.82",
            color: "text-homiq-orange",
            bg: "bg-homiq-orange/10",
          },
          {
            icon: <Activity className="w-5 h-5" />,
            label: "Peak Hour",
            value: "6:00 PM",
            color: "text-homiq-teal",
            bg: "bg-homiq-teal/10",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
            className="rounded-2xl bg-card border border-border p-4"
            data-ocid={`energy.card.${i + 1}`}
          >
            <div
              className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}
            >
              {stat.icon}
            </div>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily hourly bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="rounded-2xl bg-card border border-border p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Today's Hourly Usage
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ENERGY_DATA} barGap={2} barCategoryGap="20%">
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
        </motion.div>

        {/* Weekly line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="rounded-2xl bg-card border border-border p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">
            This Week vs Last Week
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={WEEKLY_DATA}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.32 0.04 248 / 30%)"
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#A7B6C7" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#A7B6C7" }}
                axisLine={false}
                tickLine={false}
                unit="kWh"
                width={44}
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
              <Legend wrapperStyle={{ fontSize: 12, color: "#A7B6C7" }} />
              <Line
                type="monotone"
                dataKey="usage"
                stroke="oklch(0.61 0.18 252)"
                strokeWidth={2}
                dot={false}
                name="This week"
              />
              <Line
                type="monotone"
                dataKey="prev"
                stroke="oklch(0.75 0.15 70)"
                strokeWidth={2}
                dot={false}
                strokeDasharray="4 4"
                name="Last week"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top devices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="rounded-2xl bg-card border border-border p-5"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Top Energy Consumers
        </h3>
        <div className="space-y-4">
          {TOP_DEVICES_ENERGY.map((d, i) => (
            <div
              key={d.name}
              className="flex items-center gap-4"
              data-ocid={`energy.item.${i + 1}`}
            >
              <span className="text-sm font-bold text-muted-foreground w-4">
                {i + 1}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-foreground">
                    {d.name}
                  </span>
                  <span className="text-sm font-semibold text-homiq-blue">
                    {d.watts}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${d.usage}%`,
                      background: `oklch(${0.61 + i * 0.02} ${0.18 - i * 0.02} ${252 - i * 10})`,
                    }}
                  />
                </div>
              </div>
              <span className="text-xs text-muted-foreground w-8 text-right">
                {d.usage}%
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
