import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Device, DeviceType } from "../backend";
import { useActor } from "./useActor";

export function useGetAllRooms() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRooms();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllDevices() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["devices"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDevices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateDeviceState() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      isOn,
      brightness,
      temperature,
    }: {
      id: bigint;
      isOn: boolean;
      brightness: bigint;
      temperature: bigint;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateDeviceState(id, isOn, brightness, temperature);
    },
    onMutate: async ({ id, isOn, brightness, temperature }) => {
      await queryClient.cancelQueries({ queryKey: ["devices"] });
      const previous = queryClient.getQueryData<Device[]>(["devices"]);
      queryClient.setQueryData<Device[]>(
        ["devices"],
        (old) =>
          old?.map((d) =>
            d.id === id ? { ...d, isOn, brightness, temperature } : d,
          ) ?? [],
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["devices"], ctx.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
  });
}

export function useCreateRoom() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, icon }: { name: string; icon: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.createRoom(name, icon);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

export function useAddDevice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      roomId,
      name,
      deviceType,
    }: {
      roomId: bigint;
      name: string;
      deviceType: DeviceType;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addDevice(roomId, name, deviceType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
  });
}

export function useDeleteRoom() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteRoom(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
  });
}
