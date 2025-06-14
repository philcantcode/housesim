Create a Web-Based House Heating Simulation Application
I need you to build a web application that simulates heat flow and distribution throughout a house. This should be an interactive, visual simulation that helps users understand how heat moves through their specific home layout.
Core Requirements:
House Layout Builder:

Allow users to create floor plans by drawing rooms, walls, doors, and windows
Support multiple floors with staircases
Set ceiling height for each room
Define room dimensions and connections

Material Properties System:

Wall materials (brick, timber frame, concrete, etc.) with thermal conductivity values
Insulation types and R-values for walls, floors, and ceilings
Window types (single/double/triple glazed) and their heat loss coefficients
Flooring materials (carpet, hardwood, tile, etc.) and their thermal properties
Door materials and their insulation properties

Heating System Configuration:

Multiple radiator types with different BTU outputs and heat distribution patterns
Underfloor heating zones
Heat pumps and their placement
Ability to set temperature and flow rates for each heat source

Physics Simulation:

Real-time heat flow visualization showing temperature gradients
Heat convection (warm air rising, circulation patterns)
Heat conduction through walls, floors, and ceilings
Heat loss through windows, doors, and thermal bridges
Airflow simulation including heat movement through doorways and staircases

Interactive Elements:

Drag-and-drop placement of furniture, curtains, and other objects that affect heat flow
Toggle heating sources on/off to see immediate effects
Adjust external temperature and weather conditions
Real-time temperature readings at different points in the house

Visualization:

Heat map overlay showing temperature distribution with color coding
Animated arrows or particles showing air circulation patterns
Temperature probe tool to check specific locations
Time-lapse mode to show how heat distribution changes over time

Technical Specifications:

Web-based (HTML5 Canvas or WebGL for smooth graphics)
Responsive design that works on desktop and tablet
Save/load house configurations
Export results as images or reports

User Experience:

Intuitive drag-and-drop interface for building layouts
Property panels for setting material characteristics
Step-by-step wizard for new users
Realistic default values based on common UK building standards

The goal is to help homeowners optimize their heating systems by visualizing where heat goes, identifying cold spots, and testing solutions like additional insulation, curtains, or radiator repositioning before making real-world changes.
Please build this as a complete, functional web application with realistic physics calculations and an engaging visual interface.

## Development Setup

This repository includes a small demonstration of a web-based house heating simulation. To run it locally, launch a simple HTTP server from the `src` directory:

```bash
cd src
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.
