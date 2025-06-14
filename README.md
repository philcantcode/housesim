# House Heating Simulation

This project demonstrates a browser-based application for exploring heat flow within a house layout. It includes a simple grid layout editor, basic material properties, multiple radiators and an adjustable outside temperature. The simulation visualises temperature as a colour map which updates in real time.

Features include:

- Drawing walls, windows, doors and radiators on a grid plan
- Selecting different wall materials with varying insulation values
- Toggling radiators on and off and setting their temperature
- Adjustable external temperature boundary
- Basic heat conduction model with visual heat map

The application is intended as a lightweight starting point for a more comprehensive heating simulator. It does not yet include multi-floor support or advanced airflow modelling, but the code is structured so that these capabilities could be added later.

## Development Setup

Launch a simple HTTP server from the `src` directory:

```bash
cd src
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser to experiment with the editor and simulation.
