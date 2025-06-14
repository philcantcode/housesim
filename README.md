# House Heating Simulation

This project demonstrates a browser-based application for exploring heat flow within a house layout. It now provides a basic 3D visualisation so you can change the room size, position radiators and add features such as windows or curtains. Temperature is displayed as a colour map on cubes that update in real time.

Features include:

- Drawing walls, windows, doors, curtains and radiators on a voxel grid
- Selecting different wall materials with varying insulation values
- Toggling radiators on and off and setting their temperature
- Adjustable external temperature boundary
- Resizable room with 3D heat visualisation
- Basic heat conduction model with visual heat map

The application is intended as a lightweight starting point for a more comprehensive heating simulator. It does not yet include multi-floor support or advanced airflow modelling, but the code is structured so that these capabilities could be added later.

## Development Setup

Launch a simple HTTP server from the `src` directory:

```bash
cd src
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser to experiment with the editor and simulation.
