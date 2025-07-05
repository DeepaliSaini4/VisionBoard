# VisionBoard

**VisionBoard** is a dynamic, feature-rich whiteboard application built with React and HTML5 Canvas. It enables intuitive drawing, sketching, and collaborative design, making it suitable for professionals, educators, and teams seeking a streamlined digital canvas.



## Live Demo

Access the live application: [https://visionboard-rho.vercel.app/](https://visionboard-rho.vercel.app/)



## Features

### Drawing Tools

* Line tool with customizable stroke
* Rectangle and ellipse shapes
* Arrow tool for annotations
* Freehand brush for natural drawing
* Text tool with adjustable positioning

### Editing Capabilities

* Precision eraser tool
* Undo/Redo functionality
* Color picker with custom color options
* Adjustable stroke width

### User Experience

* Clean and intuitive toolbar
* Fully responsive canvas
* Download option for saving artwork
* Smooth drawing experience



## Technology Stack

* **Frontend Framework:** React.js
* **Styling:** Tailwind CSS
* **Drawing Libraries:**

  * Perfect Freehand (smooth, natural brush strokes)
  * Rough.js (sketch-style graphics)
* **State Management:** React Context API
* **Deployment:** Vercel



## Installation

1. Clone the repository:

```bash
git clone https://github.com/DeepaliSaini4/VisionBoard.git
```

2. Navigate into the project folder:

```bash
cd VisionBoard
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```



## Usage

* Select a tool from the toolbar (line, rectangle, ellipse, arrow, brush, or text)
* Choose your preferred color using the color picker
* Click and drag on the canvas to create drawings
* Use the eraser tool to remove elements
* Use undo/redo functionality to manage changes
* Download your artwork when finished



## Implementation Details

* Custom state management with React's `Context API` and `useReducer`
* Utilized `useLayoutEffect` for synchronized shape rendering
* Comprehensive mouse event handling for fluid drawing
* Integrated Rough.js for creating sketch-style graphics
* Implemented Perfect Freehand for realistic brush strokes
* Organized tool logic with a dedicated `ToolActionType` system
* Implemented a history management system for undo/redo support



## Recent Updates

* Added download functionality
* Improved color picker interface
* Corrected text erasing logic with `measureText`
* Integrated a robust undo/redo system
* Enhanced brush tool with additional stroke options



## Future Scope

### Real-Time Collaboration

* Integration of WebSocket for live multi-user sessions
* User cursor and presence indicators
* Built-in collaborative chat
* Room-based collaboration setup

### Enhanced Features

* Shape manipulation (move, resize, rotate)
* Layered canvas system
* Custom templates and stickers
* Cloud storage integration
* Exporting options (PNG, SVG, PDF)

### User Management

* User authentication
* Personal dashboard to manage boards
* Board sharing with permissions control
* Team organization features



## Contributing

Contributions are welcome. Follow these steps:

1. Fork the repository
2. Create a new branch:

```bash
git checkout -b feature/YourFeatureName
```

3. Commit changes:

```bash
git commit -m "Add YourFeatureName"
```

4. Push the branch:

```bash
git push origin feature/YourFeatureName
```

5. Open a Pull Request



## License

This project is licensed under the [MIT License](LICENSE).



## Contact

**Deepali Saini**
GitHub: [DeepaliSaini4](https://github.com/DeepaliSaini4)
Repository: [VisionBoard](https://github.com/DeepaliSaini4/VisionBoard)
Live Link: [https://visionboard-rho.vercel.app/](https://visionboard-rho.vercel.app/)

