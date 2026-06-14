# Atlas Programming System

## Overview
The programming module lets you build multi-week training plans and assign them to clients.
Programs are organized by **weeks** and **days**, with AM and PM session slots.

## Program Structure
```
Program
├── id          — unique identifier
├── name        — program name (e.g. "12-Week Strength Block")
├── clientId    — optional: assign to a specific client
├── notes       — coach notes / program description
└── weeks[]
    └── Week
        ├── days[]
        │   └── Day (7 days per week)
        │       ├── am   — workout ID for morning session (optional)
        │       └── pm   — workout ID for afternoon session (optional)
```

## How to Use
1. Go to the **Programming** tab
2. Select or create a program from the dropdown
3. Click any day slot to assign a workout from your library
4. Assign the program to a client via the client's profile

## Key Concepts

### Session Slots
Each day has two slots — **AM** and **PM** — so you can program two-a-days or keep one empty for rest.

### Workout Assignment
Any workout from your library (127 workouts) can be slotted into any day.
Click a filled slot to change or remove the workout.

### Program Lifecycle
- Programs are stored in `localStorage` under the key `pt_programs_v1`
- Each program is independent — you can run multiple programs simultaneously
- Programs can be duplicated and edited for periodization blocks

## Workout Categories Available for Programming

| Category | Count | Best For |
|---|---|---|
| Strength | 11 | Max strength, hypertrophy blocks |
| Endurance | 10 | Aerobic base, cardio capacity |
| Mobility | 36 | Recovery days, deload weeks |
| Metcon | 22 | Conditioning, fat loss |
| Weightlifting | 11 | Olympic lifting skill |
| HYROX | 37 | HYROX race prep |

## Example 5-Day Strength Block (Week 1)

| Day | AM | PM |
|---|---|---|
| Monday | Lower Body Power | — |
| Tuesday | Upper Body Strength | — |
| Wednesday | — | Active Recovery |
| Thursday | Lower Body Volume | — |
| Friday | Upper Body Volume | — |
| Saturday | Metcon | — |
| Sunday | Rest | — |
