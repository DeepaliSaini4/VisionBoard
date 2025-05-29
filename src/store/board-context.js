import { createContext } from "react";
const boardContext = createContext({
    activeToolItem: " ",// Currently selected tool (e.g., pencil, line, eraser)
    toolActionType:"",
     elements: [],// Array to hold drawn shapes or objects on the board
     boardMouseDownHandler: () => {},// Placeholder function for handling mouse down
     changeToolHandler: () => {}, // Placeholder to switch drawing tools
     boardMouseMoveHandler:() => {}, // Placeholder for handling mouse move
     boardMouseUpHandler:() => {}, // Placeholder for handling mouse up
});
export default boardContext;