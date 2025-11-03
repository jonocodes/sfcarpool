# Scheduler Architecture Guide

This document provides an AI-readable guide to understanding the SF Carpool scheduler implementation, its structure, and how to interact with it programmatically or through browser automation.

## Overview

The scheduler is a weekly calendar view for managing carpool events. It displays Monday through Friday with time slots from approximately 6am to 10am+ (configurable). Events can be created, edited, moved (via drag), resized, and deleted.

## Technology Stack

- **Frontend**: React with TanStack Router
- **Database**: Triplit (local-first database with real-time sync)
- **Drag & Drop**: react-rnd library
- **Date/Time**: @js-joda/core (LocalDate, LocalTime)
- **Scheduler Component**: Custom implementation in `src/components/Scheduler/`

## URL Structure

```
http://localhost:3000/scheduler?location={location_id}&week={date}
```

**Parameters:**
- `location`: String ID of the carpool route (e.g., "l5PQRRCiuSah4NFM_r6Ln")
- `week`: ISO date string for the start of the week (e.g., "2025-10-26")
- `options`: Optional, can be "passenger" or "driver"

## DOM Structure

### Critical: Timeline Row Indexing

The DOM contains **10 `.timeline` elements**, split into two groups:

1. **Title Rows (indices 0-4)**: Display day names
   - Index 0: Monday title
   - Index 1: Tuesday title
   - Index 2: Wednesday title
   - Index 3: Thursday title
   - Index 4: Friday title

2. **Interactive Rows (indices 5-9)**: Contain clickable cells
   - Index 5: Monday's interactive cells
   - Index 6: Tuesday's interactive cells
   - Index 7: Wednesday's interactive cells
   - Index 8: Thursday's interactive cells
   - Index 9: Friday's interactive cells

**Formula to find interactive timeline:**
```javascript
interactiveTimelineIndex = 5 + dayIndex
// where dayIndex: Mon=0, Tue=1, Wed=2, Thu=3, Fri=4
```

### Cell Structure

Each interactive timeline contains **60 `.tl` cells** (for ~4 hours):
- 60 cells / 4 hours = **15 cells per hour**
- Each cell represents **4 minutes** (300 seconds)
- Cell clicks trigger event creation at that time slot

**Formula to find cell for specific time:**
```javascript
// If schedule starts at 6am and you want 8am:
hoursFromStart = 8 - 6 = 2
cellIndex = hoursFromStart * 15 = 30
```

### Event Elements

Events are rendered as draggable/resizable blocks with:
- Class: `.sc_bar` (with additional class for mode: `passenger` or `driver`)
- Contained in: `react-rnd` wrapper (from react-rnd library)
- Clickable to edit/delete
- Display time range and icon

## Component Hierarchy

```
routes/scheduler.tsx
├── Week.tsx (main coordinator)
│   ├── LocationsCell.tsx (location dropdown)
│   ├── EventsCell.tsx (fetches events from DB)
│   └── Scheduler.tsx (visual grid)
│       ├── Main (wrapper)
│       ├── Menu (time labels)
│       └── Row (per day)
│           ├── Event (draggable blocks)
│           └── .tl cells (clickable)
└── EventModal.tsx (create/edit/delete UI)
```

## Event Management Flow

### Creating an Event

1. **User clicks a cell** → triggers `onScheduleClick(colNum, rowNum)`
2. **Week.tsx calculates time:**
   ```javascript
   startTime = tableStartTime + (colNum * widthTime)
   endTime = startTime + (4 * widthTime)
   ```
3. **EventModal opens** with pre-filled time
4. **User configures** label, mode (passenger/driver), times, likelihood
5. **On Save:**
   - Calls `triplit.insert("events", {...data})`
   - Event syncs to database
   - UI automatically updates via subscription

### Editing an Event

1. **User clicks event** (or drags with minimal movement)
2. **EventModal opens** with existing data loaded
3. **On Save:**
   - Calls `triplit.update("events", eventId, {...data})`
   - Changes sync to database
   - UI updates automatically

### Deleting an Event

1. **User clicks event** → modal opens
2. **User clicks Delete button**
3. **Week.tsx calls:**
   ```javascript
   await triplit.delete("events", eventId)
   ```
4. **Success message** displays: "Event deleted successfully"
5. **Event removed** from UI immediately

### Dragging/Resizing Events

- **Drag**: Changes time and/or day
- **Resize**: Changes duration
- **On drag/resize end**: Calls `onChange` → updates database
- Small drags (<2px) are treated as clicks to open modal

## Database Schema

### Events Table

```typescript
{
  id: string,              // Auto-generated
  created_at: Date,
  updated_at: Date,
  date: Date,              // Which day (e.g., Oct 30, 2025)
  start: string,           // LocalTime format "08:00"
  end: string,             // LocalTime format "08:20"
  label: string,           // Event title
  passenger: boolean,      // true for passenger, false for driver
  location_id: string,     // References locations table
  likelihood: number       // 0-100, affects opacity (95 default)
}
```

### Locations Table

```typescript
{
  id: string,
  name: string,            // e.g., "North Berkeley BART -> SF Financial District"
  // ... other fields
}
```

## Key Implementation Details

### Time Calculations

The scheduler uses **seconds since midnight** internally:
- `LocalTime.ofSecondOfDay(seconds)` creates time objects
- `localTime.toSecondOfDay()` gets seconds
- Default cell width: 300 seconds (5 minutes)

### Event Positioning

Events are positioned using:
- **X position**: Calculated from start time relative to table start
- **Y position**: Based on row (day)
- **Width**: Duration in cells
- **Height**: Fixed per row (configurable)

### Row Mapping

The `rowMap` structure organizes events by day:
```javascript
rowMap = [
  [eventIndex1, eventIndex2],  // Monday events
  [eventIndex3],               // Tuesday events
  [],                          // Wednesday (empty)
  [eventIndex4],               // Thursday events
  []                           // Friday (empty)
]
```

## Browser Automation Tips

### Finding Thursday at 8am

```javascript
// Get Thursday's interactive timeline (index 8)
const timelines = document.querySelectorAll('.timeline');
const thursdayTimeline = timelines[8];

// Get cells in Thursday's row
const cells = thursdayTimeline.querySelectorAll('.tl');

// Click cell for 8am (30 cells from start if starting at 6am)
const cellIndex = 30;
cells[cellIndex].click();
```

### Clicking an Event

```javascript
// Events have cursor:pointer and contain time text
const events = document.querySelectorAll('.sc_bar');

// Or find by time
const thursdayEvent = Array.from(document.querySelectorAll('[cursor=pointer]'))
  .find(el => el.textContent.includes('08:00 - 08:20'));

// Click to open modal
thursdayEvent.click();
```

### Deleting an Event

```javascript
// 1. Click event to open modal
event.click();

// 2. Wait for modal
await page.waitForSelector('dialog');

// 3. Click Delete button
const deleteButton = document.querySelector('button:has-text("Delete")');
deleteButton.click();

// 4. Success message appears
// Status element shows: "Event deleted successfully"
```

## Common Gotchas

1. **Timeline Indexing**: Remember interactive rows start at index 5, not 0
2. **Cell Count**: 60 cells per row, not 30 (15 per hour, not 7.5)
3. **Drag vs Click**: Small movements (<2px) are treated as clicks
4. **Date Parsing**: Week parameter must be valid ISO date string
5. **Location ID**: Must be a valid location_id from database
6. **Modal Timing**: Event creation redirects page, need to wait for reload

## State Management

- **Events**: Fetched via Triplit subscription in EventsCell
- **Locations**: Fetched via Triplit subscription in LocationsCell
- **Scheduler State**: Managed by Zustand store in zstore.ts
- **Router State**: Location and week in URL params (TanStack Router)

## Console Logs to Watch

Useful console patterns for debugging:
```
onScheduleClick external method {colNum} {rowNum}  // Cell clicked
update {index} {...event}                          // Event updated
remove {index} {...event}                          // Event deleted
deletedItem undefined                              // Delete succeeded
Main events [Object, Object, ...]                  // Events rendered
```

## Error Handling

The app shows errors via:
- Error boundaries (React)
- Success/error toast messages
- Console logs (check for ERROR level)

Currently, only non-critical error:
- `icons8-carpool-ios-16-filled-96.png` 404 (missing favicon)

## Testing Workflow

1. Navigate to `/scheduler` with valid location and week
2. Wait for events to load (check Main events log)
3. Click cell to create event
4. Verify modal opens with correct time
5. Save and verify event appears
6. Click event to edit
7. Delete and verify removal
8. Check console for errors

## Future Considerations

- Support for multi-day events
- Recurring events
- Drag across weeks
- Mobile touch support
- Offline sync conflict resolution
- Event color coding beyond passenger/driver

