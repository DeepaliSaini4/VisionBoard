import React, {useCallback, useContext, useReducer } from "react";

import boardContext from "./board-context";
import { BOARD_ACTIONS, TOOL_ACTION_TYPES, TOOL_ITEMS } from "../constants";
import { PiAlignCenterHorizontalSimpleThin } from "react-icons/pi";
import { createRoughElement } from "../utils/element";
import { getSvgPathFromStroke,isPointNearElement } from "../utils/math";
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

    case BOARD_ACTIONS.CHANGE_ACTION_TYPE: {
      return {
        ...state,
        toolActionType: action.payload.actionType,
      };
    }

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
        toolActionType:
        state.activeToolItem === TOOL_ITEMS.TEXT
          ? TOOL_ACTION_TYPES.WRITING
          : TOOL_ACTION_TYPES.DRAWING, // On CLICK, change it to "DRAWING"
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
 // Push new element state in historyAdd commentMore actions
    // Don't always push at end, push right after current index (i.e. current_index + 1)
    // And remove the forward history (if we draw on UNDO, we can't REDO)
    case BOARD_ACTIONS.DRAW_UP: {
      const elementsCopy = [...state.elements];
      const newHistory = state.history.slice(0, state.index + 1);
      newHistory.push(elementsCopy);

      return {
        ...state,
        history: newHistory,
        index: state.index + 1,
      };
    }

    // On ERASE as well, we need to deal with History (bcoz ERASE is equivalent to adding a new state)


    case BOARD_ACTIONS.ERASE: {
      const { clientX, clientY } = action.payload;
      let newElements = [...state.elements];
      newElements = newElements.filter((element) => {
        return !isPointNearElement(element, clientX, clientY); // ! bcoz if it's near, then we've to delete it
      });
      const newHistory = state.history.slice(0, state.index + 1);
      newHistory.push(newElements);
      return {
        ...state,
        elements: newElements,
        history: newHistory,
        index: state.index + 1,
      };
    }
     // I'm creating new element on TEXT as well (not only by DRAWING)
    case BOARD_ACTIONS.CHANGE_TEXT: {
      const index = state.elements.length - 1;
      const newElements = [...state.elements];
      newElements[index].text = action.payload.text;
      const newHistory = state.history.slice(0, state.index + 1);
      newHistory.push(newElements);
      return {
        ...state,
        toolActionType: TOOL_ACTION_TYPES.NONE,    // bcoz i've blurred it now 
        elements: newElements,
        history: newHistory,
        index: state.index + 1,
      };
    }

    case BOARD_ACTIONS.UNDO: {
      if (state.index <= 0) return state; // do nothing (if at begining of history)

      return {
        ...state,
        elements: state.history[state.index - 1],
        index: state.index - 1,
      };
    }

    case BOARD_ACTIONS.REDO: {
      if (state.index >= state.history.length - 1) return state; // do nothing (if at end of history)

      return {
        ...state,
        elements: state.history[state.index + 1],
        index: state.index + 1,
      };
    }
    default:
      return state;
  }
};
 
// Initial state of the drawing board
const initialBoardState = {
  activeToolItem: TOOL_ITEMS.BRUSH, // Default tool selected (e.g., Line tool)
  toolActionType: TOOL_ACTION_TYPES.NONE,
  elements: [], // Stores all drawn shapes (lines, rectangles, etc.)
  history: [[]],
  index: 0,
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
     // Jab mai dusri baar click kar raha hunAdd commentMore actions
    // tab mujhe wapas DRAW_DOWN call nahi karna 
    // tab mai already WRITING state mei hun 
    if(boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
    
    const { clientX, clientY } = event; // Get mouse coordinates
    if(boardState.activeToolItem === TOOL_ITEMS.ERASER) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
        payload: {
          actionType: TOOL_ACTION_TYPES.ERASING,
        },
      });
      return; // if erasing, return from here itself
    }
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
    if(boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
    const { clientX, clientY } = event; // // Get new mouse position
    if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.DRAW_MOVE,
        payload: {
          clientX,
          clientY,
        },
      });
    } else if (boardState.toolActionType === TOOL_ACTION_TYPES.ERASING) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.ERASE,
        payload: {
          clientX,
          clientY,
        },
      });
    }
  };

  const boardMouseUpHandler = () => {
    if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
    if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.DRAW_UP,
      });
    }
    dispatchBoardAction({
      type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
      payload: {
        actionType: TOOL_ACTION_TYPES.NONE,
      },
    });
  };
   // On Blur i want to draw text out canvas 
   const textAreaBlurHandler = (text) => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.CHANGE_TEXT,
      payload: {
        text,
      },
    });
  };
   // wrap both with useCallback to handle their "Referential Equality"
  // Bcoz they're getting passed in handleKeyDown() in index.js of Board
  const boardUndoHandler = useCallback(() => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.UNDO,
    });
},[]);

const boardRedoHandler = useCallback(() => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.REDO,
    });
  }, []);

  //context value that other components will use
  const boardContextValue = {
    activeToolItem: boardState.activeToolItem, // Currently selected tool
    elements: boardState.elements, // All drawn elements on the board
    toolActionType: boardState.toolActionType,
    changeToolHandler,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler,
    textAreaBlurHandler,
    undo: boardUndoHandler,
    redo: boardRedoHandler,
  };

  return (
    <boardContext.Provider value={boardContextValue}>
      {children}
    </boardContext.Provider>
  );
};

export default BoardProvider;
