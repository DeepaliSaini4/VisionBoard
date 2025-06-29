import React, { useContext, useReducer } from "react";

import boardContext from "./board-context";
import { BOARD_ACTIONS, TOOL_ACTION_TYPES, TOOL_ITEMS } from "../constants";
import { PiAlignCenterHorizontalSimpleThin } from "react-icons/pi";
import { createRoughElement } from "../utils/element";
import { getSvgPathFromStroke } from "../utils/math";
import getStroke from "perfect-freehand";

// Reducer to handle board-related actions
const boardReducer = (state, action) => {
  switch (action.type) {
    // Action: Change currently active tool (e.g., pencil, line, etc.)
    case BOARD_ACTIONS.CHANGE_TOOL:
      return {
        ...state,
        activeToolItem: action.payload.tool,
      };
    // Action: Start drawing (on mouse down)
    case BOARD_ACTIONS.DRAW_DOWN:
      const { clientX, clientY, stroke, fill, size } = action.payload; //destructuring
      const newElement = createRoughElement(
        state.elements.length,
        clientX,
        clientY,
        clientX,
        clientY,
        { type: state.activeToolItem, stroke, fill, size }
      );
      const prevElements = state.elements;
      return {
        ...state,
        toolActionType: TOOL_ACTION_TYPES.DRAWING,
        elements: [...prevElements, newElement], // Add new element to elements array
      };
    // Action: Continue drawing (on mouse move)
    case BOARD_ACTIONS.DRAW_MOVE: {
      const { clientX, clientY } = action.payload;
      const newElements = [...state.elements]; // Clone elements
      const index = state.elements.length - 1; // Get index of last drawn element
      const { type } = newElements[index];
      switch (type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.ARROW:
          const { x1, y1, stroke, fill, size } = newElements[index];
          const newElement = createRoughElement(
            index,
            x1,
            y1,
            clientX,
            clientY,
            {
              type: state.activeToolItem,
              stroke,
              fill,
              size,
            }
          );
          newElements[index] = newElement;

          return {
            ...state,
            elements: newElements,
          };

        // On moving, issi element ke points array mei push karne hai (new points)
        // Brush waale element mei naya point push kardiya (clientX, clientY)
        // Then updated the path
        case TOOL_ITEMS.BRUSH:
          newElements[index].points = [
            ...newElements[index].points,
            { x: clientX, y: clientY },
          ];
          newElements[index].path = new Path2D(
            getSvgPathFromStroke(getStroke(newElements[index].points))
          );
          return {
            ...state,
            elements: newElements,
          };

        default:
          throw new Error("Type not recognised");
      }
    } // Default: Return current state (no changes)
    case BOARD_ACTIONS.DRAW_UP: {
      return {
        ...state,
        toolActionType: TOOL_ACTION_TYPES.NONE,
      };
    }
    default:
      return state;
  }
};
 
// Initial state of the drawing board
const initialBoardState = {
  activeToolItem: TOOL_ITEMS.LINE, // Default tool selected (e.g., Line tool)
  toolActionType: TOOL_ACTION_TYPES.NONE,
  elements: [], // Stores all drawn shapes (lines, rectangles, etc.)
};

const BoardProvider = ({ children }) => {
  // useReducer hook to manage board state (tools, elements)
  const [boardState, dispatchBoardAction] = useReducer(
    boardReducer,
    initialBoardState
  );


  //Called when the user selects a new drawing tool (like pencil, line, rectangle)
  const changeToolHandler = (tool) => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.CHANGE_TOOL,
      payload: {
        tool, // tool is passed and saved in state
      },
    });
  };
  //Called when user presses mouse down on the board (starts drawing)
  const boardMouseDownHandler = (event, toolboxState) => {
    const { clientX, clientY } = event; // Get mouse coordinates
    dispatchBoardAction({
      type: BOARD_ACTIONS.DRAW_DOWN,
      payload: {
        clientX,
        clientY,
        stroke: toolboxState[boardState.activeToolItem]?.stroke,
        fill: toolboxState[boardState.activeToolItem]?.fill,
        size: toolboxState[boardState.activeToolItem]?.size,
      },
    });
  };

  // Called when the user moves the mouse while pressing down (dragging to draw)
  const boardMouseMoveHandler = (event) => {
    const { clientX, clientY } = event; // // Get new mouse position
    dispatchBoardAction({
      type: BOARD_ACTIONS.DRAW_MOVE,
      payload: {
        clientX,
        clientY,
      },
    });
  };

  const boardMouseUpHandler = () => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.DRAW_UP,
    });
  };

  //context value that other components will use
  const boardContextValue = {
    activeToolItem: boardState.activeToolItem, // Currently selected tool
    elements: boardState.elements, // All drawn elements on the board
    toolActionType: boardState.toolActionType,
    changeToolHandler,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler,
  };

  return (
    <boardContext.Provider value={boardContextValue}>
      {children}
    </boardContext.Provider>
  );
};

export default BoardProvider;
