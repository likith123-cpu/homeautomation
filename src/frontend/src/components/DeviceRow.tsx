import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Camera,
  ChevronsUpDown,
  Lightbulb,
  Plug,
  Thermometer,
  Wind,
} from "lucide-react";
import { type Device, DeviceType } from "../backend";
import { useUpdateDeviceState } from "../hooks/useQueries";

const DEVICE_ICONS: Record<DeviceType, React.ReactNode> = {
  [DeviceType.light]: <Lightbulb className="w-4 h-4" />,
  [DeviceType.thermostat]: <Thermometer className="w-4 h-4" />,
  [DeviceType.plug]: <Plug className="w-4 h-4" />,
  [DeviceType.fan]: <Wind className="w-4 h-4" />,
  [DeviceType.blind]: <ChevronsUpDown className="w-4 h-4" />,
  [DeviceType.camera]: <Camera className="w-4 h-4" />,
};

const DEVICE_ICON_COLORS: Record<DeviceType, string> = {
  [DeviceType.light]: "text-homiq-orange",
  [DeviceType.thermostat]: "text-homiq-teal",
  [DeviceType.plug]: "text-homiq-green",
  [DeviceType.fan]: "text-homiq-blue",
  [DeviceType.blind]: "text-muted-foreground",
  [DeviceType.camera]: "text-homiq-teal",
};

interface DeviceRowProps {
  device: Device;
  compact?: boolean;
}

export function DeviceRow({ device, compact = false }: DeviceRowProps) {
  const { mutate: updateDevice } = useUpdateDeviceState();

  const handleToggle = (checked: boolean) => {
    updateDevice({
      id: device.id,
      isOn: checked,
      brightness: device.brightness,
      temperature: device.temperature,
    });
  };

  const handleBrightness = (val: number[]) => {
    updateDevice({
      id: device.id,
      isOn: device.isOn,
      brightness: BigInt(val[0]),
      temperature: device.temperature,
    });
  };

  const handleTempChange = (delta: number) => {
    const newTemp = Math.max(
      16,
      Math.min(30, Number(device.temperature) + delta),
    );
    updateDevice({
      id: device.id,
      isOn: device.isOn,
      brightness: device.brightness,
      temperature: BigInt(newTemp),
    });
  };

  const iconColor = device.isOn
    ? DEVICE_ICON_COLORS[device.deviceType]
    : "text-muted-foreground";

  return (
    <div className={`flex items-center gap-3 ${compact ? "py-2" : "py-3"}`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${
          device.isOn ? "bg-accent" : "bg-muted"
        } ${iconColor}`}
      >
        {DEVICE_ICONS[device.deviceType]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-foreground truncate">
            {device.name}
          </span>
          <Switch
            checked={device.isOn}
            onCheckedChange={handleToggle}
            data-ocid={`device.toggle.${Number(device.id)}`}
            className="flex-shrink-0 data-[state=checked]:bg-homiq-blue"
          />
        </div>
        {device.isOn && device.deviceType === DeviceType.light && (
          <div className="mt-1.5 flex items-center gap-2">
            <Lightbulb className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <Slider
              value={[Number(device.brightness)]}
              onValueChange={handleBrightness}
              min={0}
              max={100}
              step={5}
              className="flex-1"
              data-ocid={`device.toggle.${Number(device.id)}`}
            />
            <span className="text-xs text-muted-foreground w-8 text-right">
              {Number(device.brightness)}%
            </span>
          </div>
        )}
        {device.isOn && device.deviceType === DeviceType.thermostat && (
          <div className="mt-1 flex items-center gap-2">
            <Thermometer className="w-3 h-3 text-muted-foreground" />
            <button
              type="button"
              onClick={() => handleTempChange(-1)}
              className="w-5 h-5 rounded text-xs bg-muted text-foreground hover:bg-accent flex items-center justify-center transition-colors"
              data-ocid={`device.toggle.${Number(device.id)}`}
            >
              −
            </button>
            <span className="text-sm font-semibold text-homiq-teal">
              {Number(device.temperature)}°C
            </span>
            <button
              type="button"
              onClick={() => handleTempChange(1)}
              className="w-5 h-5 rounded text-xs bg-muted text-foreground hover:bg-accent flex items-center justify-center transition-colors"
              data-ocid={`device.toggle.${Number(device.id)}`}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
