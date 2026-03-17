# HomeAutomation

## Current State
New project with empty backend and no frontend implementation.

## Requested Changes (Diff)

### Add
- Smart home dashboard with sidebar navigation (Dashboard, Rooms, Devices, Schedules, Energy, Settings)
- Welcome header with user greeting, date/time, and notifications
- At-a-glance summary card: Devices On, Temperature, Humidity, Security status
- Room-based device controls (Living Room, Kitchen, Master Bedroom) with:
  - Light toggles with dimmer sliders
  - Thermostat with temperature stepper controls
  - Security camera rows with live status
  - Smart plugs, ceiling fans, smart blinds
- Automation Schedules section with time-based rules
- Energy Overview section: daily usage bar chart + top devices list
- Backend for persisting device states, room data, schedules, and energy logs

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan
1. Generate Motoko backend with device state management, rooms, schedules, and energy data
2. Build React frontend matching the HomiQ-style dark dashboard design
3. Wire frontend to backend for real-time device control
4. Add sample/seed content for rooms and devices
