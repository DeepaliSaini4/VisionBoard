import React, { useReducer } from 'react'
import rough from "roughjs/bin/rough"


import boardContext from './board-context'
import { BOARD_ACTIONS, TOOL_ACTION_TYPES, TOOL_ITEMS } from "../constants";
import { PiAlignCenterHorizontalSimpleThin } from 'react-icons/pi';

const gen = rough.generator();// Importing the rough.js generator to draw sketchy shapes

// Reducer to handle board-related actions
const boardReducer = (state, action) => {
    switch (action.type) {
        // Action: Change currently active tool (e.g., pencil, line, etc.)
        case  BOARD_ACTIONS.CHANGE_TOOL:
            return {
                ...state,
                activeToolItem: action.payload.tool,
            };
        // Action: Start drawing (on mouse down)
        case BOARD_ACTIONS.DRAW_DOWN:
            const {clientX, clientY} = action.payload;//destructuring
            const newElement = {
                id: state.elements.length, // Unique ID for the new element based on count
                x1: clientX,y1: clientY,// Start coordinates
                x2: clientX,y2: clientY, // Initially same as start
                roughEle:gen.line(clientX, clientY, clientX, clientY),// Rough line object
            };
            const prevElements = state.elements;
            return{
                ...state,
                toolActionType:TOOL_ACTION_TYPES.DRAWING,
                elements: [...prevElements,newElement],// Add new element to elements array
            };
            // Action: Continue drawing (on mouse move)
        case BOARD_ACTIONS.DRAW_MOVE:{
            const {clientX, clientY} = action.payload;
            const newElements = [...state.elements]; // Clone elements
            const index = state.elements.length-1; // Get index of last drawn element

            // Update end coordinates of the last element
            if (index < 0) return state;//Prevents crash when nothing has been drawn
            newElements[index].x2 = clientX;
            newElements[index].y2 = clientY;

            // Update the rough element with new dimensions
            newElements[index].roughEle = gen.line(
                newElements[index].x1,
                newElements[index].y1,
                clientX,
                clientY,
            )
            return {
                ...state,
                elements: newElements, // Update state with modified elements
            }
        }  // Default: Return current state (no changes)
        case BOARD_ACTIONS.DRAW_UP:{
            return {
                ...state,
                toolActionType:TOOL_ACTION_TYPES.NONE,
            }
        }
        default:
            return state;          
    }
};

// Initial state of the drawing board
const initialBoardState = {
    activeToolItem: TOOL_ITEMS.LINE,// Default tool selected (e.g., Line tool)
    toolActionType: TOOL_ACTION_TYPES.NONE,
    elements: [], // Stores all drawn shapes (lines, rectangles, etc.)
}

const BoardProvider = ({children}) => {
    // useReducer hook to manage board state (tools, elements)
    const [boardState, dispatchBoardAction ] = useReducer(boardReducer, initialBoardState);

//Called when the user selects a new drawing tool (like pencil, line, rectangle)
    const changeToolHandler= (tool) => {
        dispatchBoardAction({type: BOARD_ACTIONS.CHANGE_TOOL, 
            payload:{
                tool,// tool is passed and saved in state
            },
        });
    };
    //Called when user presses mouse down on the board (starts drawing)
    const boardMouseDownHandler =(event) => {
        const {clientX, clientY} = event;// Get mouse coordinates
        const roughEle =  gen.line(clientX, clientY);
        dispatchBoardAction({
            type: BOARD_ACTIONS.DRAW_DOWN,
            payload: {
                clientX,
                clientY,
            },
        });
    };

    

   // Called when the user moves the mouse while pressing down (dragging to draw)
    const boardMouseMoveHandler =(event) => {
        const {clientX, clientY} = event;// // Get new mouse position
        const roughEle =  gen.line(clientX, clientY);
        dispatchBoardAction({
            type: BOARD_ACTIONS.DRAW_MOVE,
            payload: {
                clientX,
                clientY,
            },
        });
    };

    const  boardMouseUpHandler=() => {
        dispatchBoardAction({
            type: BOARD_ACTIONS.DRAW_UP,
        });
    };


//context value that other components will use
    const boardContextValue = {
       activeToolItem: boardState.activeToolItem,// Currently selected tool
       elements: boardState.elements, // All drawn elements on the board
       toolActionType: boardState.toolActionType,
       changeToolHandler, 
       boardMouseDownHandler,
       boardMouseMoveHandler,
       boardMouseUpHandler,
    };

    return(
        <boardContext.Provider value = {boardContextValue}
        >
            {children}
            </boardContext.Provider>
    );
};

export default BoardProvider