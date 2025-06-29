import React, { useReducer } from "react";

import toolboxContext from "./toolbox-context";
import { COLORS, TOOL_ITEMS, TOOLBOX_ACTIONS } from "../constants";

const toolboxReducer = (state, action) => {
  switch (action.type) {
    case TOOLBOX_ACTIONS.CHANGE_STROKE: {
      if (!state[action.payload.tool]) {
        console.warn(`Tool "${action.payload.tool}" not initialized.`);
        return state; // or initialize it as needed
      }
      return {
        ...state,
        [action.payload.tool]: {
          ...state[action.payload.tool],
          stroke: action.payload.stroke,
        },
      };
    }

    case TOOLBOX_ACTIONS.CHANGE_FILL: {
      if (!state[action.payload.tool]) {
        console.warn(`Tool "${action.payload.tool}" not initialized.`);
        return state;
      }
      return {
        ...state,
        [action.payload.tool]: {
          ...state[action.payload.tool],
          fill: action.payload.fill,
        },
      };
    }

    case TOOLBOX_ACTIONS.CHANGE_SIZE: {
      if (!state[action.payload.tool]) {
        console.warn(`Tool "${action.payload.tool}" not initialized.`);
        return state;
      }
      return {
        ...state,
        [action.payload.tool]: {
          ...state[action.payload.tool],
          size: action.payload.size,
        },
      };
    }

    default:
      return state;
  }
};


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
  [TOOL_ITEMS.BRUSH]: {
    stroke: COLORS.BLACK,
  },
  [TOOL_ITEMS.TEXT]: {
    stroke: COLORS.BLACK,
    size: 32,
  }
};

const ToolboxProvider = ({ children }) => {
  const [toolboxState, dispatchToolboxAction] = useReducer(
    toolboxReducer,
    initialToolboxState
  );

  const changeStrokeHandler = (tool, stroke) => {
    dispatchToolboxAction({
      type: TOOLBOX_ACTIONS.CHANGE_STROKE,
      payload: {
        tool,
        stroke,
      },
    });
  };

  const changeFillHandler = (tool, fill) => {
    dispatchToolboxAction({
      type: TOOLBOX_ACTIONS.CHANGE_FILL,
      payload: {
        tool,
        fill,
      },
    });
  };
  const changeSizeHandler = (tool, size) => {
    dispatchToolboxAction({
      type: TOOLBOX_ACTIONS.CHANGE_SIZE ,
      payload: {
        tool,
        size,
      },
    });
  };

  const toolboxContextValue = {
    toolboxState,
    changeStroke: changeStrokeHandler,
    changeFill: changeFillHandler,
    changeSize: changeSizeHandler,
  };

  return (
    <toolboxContext.Provider value={toolboxContextValue}>
      {children}
    </toolboxContext.Provider>
  );
};

export default ToolboxProvider;
