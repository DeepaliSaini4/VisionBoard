# VisionBoard

**VisionBoard** is a dynamic, feature-rich whiteboard application built with React and HTML5 Canvas. It enables real-time drawing, sketching, and design work, providing users with an intuitive interface and advanced creative tools.

---

## Features

### Multiple Drawing Tools

* Line tool with customizable stroke
* Rectangle and ellipse shapes
* Arrow tool for annotations
* Freehand brush for natural drawing
* Text tool with adjustable positioning

### Advanced Editing Capabilities

* Eraser tool with precision control
* Undo/Redo functionality
* Color picker for custom colors
* Adjustable stroke width

### User-Friendly Interface

* Clean, intuitive toolbar
* Responsive canvas design
* Download functionality for saving work
* Smooth drawing experience

---

## Tech Stack

* **Frontend Framework**: React.js
* **Styling**: Tailwind CSS
* **Drawing Libraries**:

  * Perfect Freehand (smooth, natural brush strokes)
  * Rough.js (hand-drawn, sketchy graphics)
* **State Management**: React Context API
* **Deployment**: Vercel

---

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/visionboard.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd visionboard
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

---

## Usage

1. Select a tool from the toolbar (line, rectangle, ellipse, arrow, brush, or text)
2. Choose your desired color using the color picker
3. Click and drag on the canvas to draw
4. Use the eraser tool to remove elements
5. Use undo/redo to manage changes
6. Download your artwork when done

---

## Implementation Details

* Custom state management using React's `Context API` and `useReducer`
* `useLayoutEffect` for synchronous DOM updates in shape rendering
* Handled complex mouse event logic for seamless drawing
* Integrated Rough.js for sketch-style rendering
* Used Perfect Freehand for natural brush strokes
* Managed tool states using a dedicated ToolActionType system
* Built history state for full undo/redo support

---

## Recent Updates

* Download functionality added
* Enhanced color picker UI
* Improved text erasing using `measureText`
* Implemented undo/redo system
* Enhanced brush tool with stroke options

---

## Future Scope

### Real-Time Collaboration

* WebSocket support for live multi-user sessions
* User cursors and presence indicators
* Integrated chat for collaboration
* Room-based drawing system

### Enhanced Features

* Shape manipulation (resize, rotate, move)
* Layering system
* Custom templates and stickers
* Cloud board storage
* Export support (PNG, SVG, PDF)

### User Management

* User authentication
* Personal dashboard with saved boards
* Sharing and permission controls
* Team creation and board organization

---

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a new branch:

   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. Commit your changes:

   ```bash
   git commit -m 'Add YourFeatureName'
   ```
4. Push the branch:

   ```bash
   git push origin feature/YourFeatureName
   ```
5. Open a Pull Request

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

**Deepali Saini**
GitHub: [DeepaliSaini4](https://github.com/DeepaliSaini4)
Project Link: [https://github.com/DeepaliSaini4/VisionBoard](https://github.com/DeepaliSaini4/VisionBoard.git)

