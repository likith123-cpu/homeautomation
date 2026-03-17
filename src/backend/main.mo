import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Device Types
  type DeviceType = { #light; #thermostat; #fan; #plug; #blind; #camera };

  // Room Type
  public type Room = {
    id : Nat;
    name : Text;
    icon : Text;
  };

  // Device Type
  public type Device = {
    id : Nat;
    roomId : Nat;
    name : Text;
    deviceType : DeviceType;
    isOn : Bool;
    brightness : Nat;
    temperature : Nat;
    status : Text;
  };

  // Automation Schedule Type
  public type AutomationSchedule = {
    id : Nat;
    name : Text;
    time : Text;
    days : [Text];
    actionDescription : Text;
    isEnabled : Bool;
  };

  // Energy Usage Type
  public type EnergyUsage = {
    deviceId : Nat;
    dailyKwh : [Nat];
  };

  let emptyRoomArray : [Room] = [];
  let emptyDeviceArray : [Device] = [];

  var nextRoomId = 1;
  var nextDeviceId = 1;
  var nextScheduleId = 1;

  let roomsState = Map.fromIter<Nat, Room>(emptyRoomArray.map(func(room) { (room.id, room) }).values());
  let devicesState = Map.fromIter<Nat, Device>(emptyDeviceArray.map(func(device) { (device.id, device) }).values());
  let schedulesState = Map.empty<Nat, AutomationSchedule>();
  let energyUsageState = Map.empty<Nat, EnergyUsage>();

  // Sample Data
  let livingRoom : Room = { id = 1; name = "Living Room"; icon = "sofa" };
  let kitchen : Room = { id = 2; name = "Kitchen"; icon = "spoon" };
  let bedroom : Room = { id = 3; name = "Bedroom"; icon = "bed" };

  let livingRoomLights : [Device] = [
    {
      id = 1;
      roomId = 1;
      name = "Ceiling Light";
      deviceType = #light;
      isOn = false;
      brightness = 0;
      temperature = 0;
      status = "Off";
    }
  ];

  let kitchenDevices : [Device] = [
    {
      id = 2;
      roomId = 2;
      name = "Thermostat";
      deviceType = #thermostat;
      isOn = true;
      brightness = 0;
      temperature = 22;
      status = "Cooling";
    }
  ];

  let bedroomDevices : [Device] = [
    {
      id = 3;
      roomId = 3;
      name = "Fan";
      deviceType = #fan;
      isOn = false;
      brightness = 0;
      temperature = 0;
      status = "Off";
    }
  ];

  // Room CRUD
  public shared ({ caller }) func createRoom(name : Text, icon : Text) : async Room {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create rooms");
    };

    let room : Room = { id = nextRoomId; name; icon };
    roomsState.add(nextRoomId, room);
    nextRoomId += 1;
    room;
  };

  public query ({ caller }) func getRoom(id : Nat) : async Room {
    switch (roomsState.get(id)) {
      case (null) { Runtime.trap("Room does not exist") };
      case (?room) { room };
    };
  };

  public query ({ caller }) func getAllRooms() : async [Room] {
    Array.fromIter(roomsState.values());
  };

  public shared ({ caller }) func updateRoom(id : Nat, name : Text, icon : Text) : async Room {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update rooms");
    };

    switch (roomsState.get(id)) {
      case (null) { Runtime.trap("Room does not exist") };
      case (?_) {
        let updatedRoom : Room = {
          id;
          name;
          icon;
        };
        roomsState.add(id, updatedRoom);
        updatedRoom;
      };
    };
  };

  public shared ({ caller }) func deleteRoom(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete rooms");
    };

    switch (roomsState.get(id)) {
      case (null) { Runtime.trap("Room does not exist") };
      case (?_) {
        roomsState.remove(id);
      };
    };
  };

  // Device Management
  public shared ({ caller }) func addDevice(roomId : Nat, name : Text, deviceType : DeviceType) : async Device {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add devices");
    };

    switch (roomsState.get(roomId)) {
      case (null) { Runtime.trap("Room does not exist") };
      case (?_) {
        let device : Device = {
          id = nextDeviceId;
          roomId;
          name;
          deviceType;
          isOn = false;
          brightness = 0;
          temperature = 0;
          status = "Offline";
        };
        devicesState.add(nextDeviceId, device);
        nextDeviceId += 1;
        device;
      };
    };
  };

  public shared ({ caller }) func updateDeviceState(id : Nat, isOn : Bool, brightness : Nat, temperature : Nat) : async Device {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update device state");
    };

    switch (devicesState.get(id)) {
      case (null) { Runtime.trap("Device does not exist") };
      case (?device) {
        let updatedDevice : Device = {
          device with
          isOn;
          brightness;
          temperature;
          status = if (isOn) { "Active" } else {
            "Inactive";
          };
        };
        devicesState.add(id, updatedDevice);
        updatedDevice;
      };
    };
  };

  public query ({ caller }) func getDevice(id : Nat) : async Device {
    switch (devicesState.get(id)) {
      case (null) { Runtime.trap("Device does not exist") };
      case (?device) { device };
    };
  };

  public query ({ caller }) func getAllDevices() : async [Device] {
    Array.fromIter(devicesState.values());
  };
};
