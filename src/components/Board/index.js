import { useEffect, useRef, useLayoutEffect, useContext } from "react";
import rough from "roughjs";
import boardContext from "../../store/board-context";
import toolboxContext from "../../store/toolbox-context";
import {TOOL_ACTION_TYPES, TOOL_ITEMS } from "../../constants";
import classes from "./index.module.css";
function Board() {
  const canvasRef = useRef(); //Canvas DOM ref — to draw/update on it directly
  const textAreaRef = useRef();
  const {
    elements,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler,
    toolActionType,
    textAreaBlurHandler,
  } = useContext(boardContext); //Getting board state & mouse functions from context
  const { toolboxState } = useContext(toolboxContext);
  //Set canvas size to full screen once when component mounts
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  //Re-draw canvas whenever elements change, using RoughJS
  useLayoutEffect(() => {
    const canvas = canvasRef.current; //Get the actual canvas element
    const context = canvas.getContext("2d"); //Get the drawing context (2D drawing tool)
    context.save(); //Save the current state of the canvas
    const roughCanvas = rough.canvas(canvas); //Create a RoughJS drawing surface

    //Draw each element using RoughJS
    elements.forEach((element) => {
      switch (element.type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.ARROW:
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.RECTANGLE:
          roughCanvas.draw(element.roughEle); // draw expects element as an object
          break;

        // Don't use rough library in case of BRUSH tool
        case TOOL_ITEMS.BRUSH:
          context.fillStyle = element.stroke;
          context.fill(element.path);
          context.restore(); // Bcoz jab mai fillStyle change krunga toh har cheez ki fillStyle change hojayegi
          break;

          case TOOL_ITEMS.TEXT:
            context.textBaseline = "top";
            context.font = `${element.size}px Caveat`;
            context.fillStyle = element.stroke;
            context.fillText(element.text, element.x1, element.y1);
            context.restore();
          break;

        default:
          throw new Error("Type not recognised");
      }
    });

    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height); //Clean the canvas before re-drawing
    };
  }, [elements]);
    // i want ki merko input field ko focus nah karna pade
  // wahan cursor apne aap aajaye
  useEffect(() => {
    const textarea = textAreaRef.current;
    if (toolActionType === TOOL_ACTION_TYPES.WRITING) {
      // setTimeout kyuki isme thora sa delay hora tha
      setTimeout(() => {
        textarea.focus();
      }, 0);
    }
  }, [toolActionType]);

  // On Blur i want to draw it on canvas 

  //Forward mouse down event to board's handler
  const handleMouseDown = (event) => {
    boardMouseDownHandler(event, toolboxState);
  };

  //Forward mouse move event to board's handler
  const handleMouseMove = (event) => {
    boardMouseMoveHandler(event);
  };

  const handleMouseUp = () => {
    boardMouseUpHandler();
  };

  return (
    <>
    {toolActionType === TOOL_ACTION_TYPES.WRITING && (
      <textarea
        type="text"
        ref={textAreaRef}
        className={classes.textElementBox}
        style={{
          top: elements[elements.length - 1].y1,
          left: elements[elements.length - 1].x1,
          fontSize: `${elements[elements.length - 1]?.size}px`,
          color: elements[elements.length - 1]?.stroke,
        }}
        onBlur={(event) => textAreaBlurHandler(event.target.value, toolboxState)}
      />
    )}
    <canvas
      // style={{ border: "1px solid black" }}
      ref={canvasRef}
      id="canvas"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  </>
  ); //Render canvas with mouse event listeners and ref access
}

export default Board;
