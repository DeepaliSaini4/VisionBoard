import { createContext } from "react";
const boardContext = createContext({
    activeToolItem: "",
  toolActionType: "",
  elements: [],
  history: [[]],    // array of arrays (2D)Add commentMore actions
  index: 0,
  changeToolHandler: () => {},
  boardMouseDownHandler: () => {},
  boardMouseMoveHandler: () => {},
  boardMouseUpHandler: () => {},
  textAreaBlurHandler: () => {},
  undo: () => {},
  redo: () => {},
});
export default boardContext;