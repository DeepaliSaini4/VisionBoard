
import { useEffect,useRef,useLayoutEffect, useContext  } from 'react';
import rough from "roughjs";
import boardContext from '../../store/board-context';
import { TOOL_ACTION_TYPES } from '../../constants';

function Board() {

  const canvasRef = useRef();//Canvas DOM ref — to draw/update on it directly
  const {elements, boardMouseDownHandler, boardMouseMoveHandler,boardMouseUpHandler,toolActionType} = useContext(boardContext);//Getting board state & mouse functions from context

  //Set canvas size to full screen once when component mounts
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  },[]);

  //Re-draw canvas whenever elements change, using RoughJS
  useLayoutEffect(() =>{
    const canvas = canvasRef.current;//Get the actual canvas element
    const context = canvas.getContext("2d");//Get the drawing context (2D drawing tool)
    context.save();//Save the current state of the canvas
    const roughCanvas = rough.canvas(canvas);//Create a RoughJS drawing surface

    //Draw each element using RoughJS
    elements.forEach(element => {
      roughCanvas.draw(element.roughEle);
    });

    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);//Clean the canvas before re-drawing
    };
  },[elements]);

  //Forward mouse down event to board's handler
    const handleMouseDown =  (event) =>{
        boardMouseDownHandler(event);
    };

    //Forward mouse move event to board's handler
    const handleMouseMove =  (event) =>{
      if(toolActionType=== TOOL_ACTION_TYPES.DRAWING)
      boardMouseMoveHandler(event);
  };

  const handleMouseUp =  () =>{
    boardMouseUpHandler();
};

    return <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} />;//Render canvas with mouse event listeners and ref access
};

export default Board;
