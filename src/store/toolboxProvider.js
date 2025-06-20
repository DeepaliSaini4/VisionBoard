import React, { useReducer } from "react";

import toolboxContext from "./toolbox-context";
import { COLORS, TOOL_ITEMS } from "../constants";

const toolboxReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_STROKE": {
      const newState = { ...state };
      newState[action.payload.tool].stroke = action.payload.stroke;
      return newState;
    }

    default:
      return state;
  }
};

// Separate object for each tool
const initialToolboxState = {
  [TOOL_ITEMS.LINE]: {
    stroke: COLORS.BLACK,
    size: 1,
  },
  [TOOL_ITEMS.RECTANGLE]: {
    stroke: COLORS.BLACK,
    fill: null,
    size: 1,
  },
  [TOOL_ITEMS.CIRCLE]: {
    stroke: COLORS.BLACK,
    fill: null,
    size: 1,
  },
  [TOOL_ITEMS.ARROW]: {
    stroke: COLORS.BLACK,
    size: 1,
  },
};

// Let's maintain separate toolbox state for each item in toolbar
const ToolboxProvider = ({ children }) => {
  const [toolboxState, dispatchToolboxAction] = useReducer(
    toolboxReducer,
    initialToolboxState
  );

  const changeStrokeHandler = (tool, stroke) => {
    dispatchToolboxAction({
      type: "CHANGE_STROKE",
      payload: {
        tool,
        stroke,
      },
    });
  };

  const toolboxContextValue = {
    toolboxState,
    changeStroke: changeStrokeHandler,
  };

  return (
    <toolboxContext.Provider value={toolboxContextValue}>
      {children}
    </toolboxContext.Provider>
  );
};

export default ToolboxProvider;