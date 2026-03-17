import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Room {
    id: bigint;
    icon: string;
    name: string;
}
export interface Device {
    id: bigint;
    status: string;
    temperature: bigint;
    isOn: boolean;
    name: string;
    brightness: bigint;
    deviceType: DeviceType;
    roomId: bigint;
}
export enum DeviceType {
    fan = "fan",
    plug = "plug",
    light = "light",
    thermostat = "thermostat",
    blind = "blind",
    camera = "camera"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDevice(roomId: bigint, name: string, deviceType: DeviceType): Promise<Device>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createRoom(name: string, icon: string): Promise<Room>;
    deleteRoom(id: bigint): Promise<void>;
    getAllDevices(): Promise<Array<Device>>;
    getAllRooms(): Promise<Array<Room>>;
    getCallerUserRole(): Promise<UserRole>;
    getDevice(id: bigint): Promise<Device>;
    getRoom(id: bigint): Promise<Room>;
    isCallerAdmin(): Promise<boolean>;
    updateDeviceState(id: bigint, isOn: boolean, brightness: bigint, temperature: bigint): Promise<Device>;
    updateRoom(id: bigint, name: string, icon: string): Promise<Room>;
}
