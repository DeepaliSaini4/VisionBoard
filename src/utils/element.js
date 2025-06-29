import { ARROW_LENGTH, TOOL_ITEMS } from "../constants";
import rough from "roughjs/bin/rough";
import { getArrowHeadsCoordinates, getSvgPathFromStroke } from "./math";
import getStroke from "perfect-freehand";
const gen = rough.generator();
export const createRoughElement = (
  id,
  x1,
  y1,
  x2,
  y2,
  { type, stroke, fill, size }
) => {
  const element = {
    id,
    x1,
    y1,
    x2,
    y2,
    type,
    fill,
    stroke,
    size,
  };
  //passing options so that on adjusting the size while drawing new style of rough js is not created or size doesnot buffers
  let options = {
    seed: id + 1, //id cant be 0
    fillStyle: "solid",
  };
  if (stroke) {
    options.stroke = stroke;
  }
  if (fill) {
    options.fill = fill;
  }
  if (size) {
    options.strokeWidth = size;
  }
  switch (type) {
    case TOOL_ITEMS.LINE:
      element.roughEle = gen.line(x1, y1, x2, y2, options);
      return element;
    case TOOL_ITEMS.RECTANGLE:
      element.roughEle = gen.rectangle(x1, y1, x2 - x1, y2 - y1, options);
      return element;
    case TOOL_ITEMS.CIRCLE:
      const cx = (x1 + x2) / 2;
      const cy = (y1 + y2) / 2;
      const width = x2 - x1;
      const height = y2 - y1;
      element.roughEle = gen.ellipse(cx, cy, width, height, options);
      return element;
    case TOOL_ITEMS.ARROW:
      const { x3, y3, x4, y4 } = getArrowHeadsCoordinates(
        x1,
        y1,
        x2,
        y2,
        ARROW_LENGTH
      );
      const points = [
        [x1, y1],
        [x2, y2],
        [x3, y3],
        [x2, y2],
        [x4, y4],
      ];
      element.roughEle = gen.linearPath(points, options);
      return element;
    case TOOL_ITEMS.BRUSH: {
      // Brush ke case mei elements mei points honge (as Array of Objects)
      const brushElement = {
        id,
        points: [{ x: x1, y: y1 }],
        path: new Path2D(getSvgPathFromStroke(getStroke([{ x: x1, y: y1 }]))), // path bnane ka treka hota hai new Path2D()
        type,
        stroke,
      };
      return brushElement;
    }
    default:
      throw new Error("Type not recognized");
  }
};
