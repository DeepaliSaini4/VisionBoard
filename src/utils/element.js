import { TOOL_ITEMS } from "../constants";
import rough from "roughjs/bin/rough";
const gen = rough.generator();
export const createRoughElement = (id, x1, y1, x2, y2, {type}) => {
    const element = {
        id,
        x1,
        y1,
        x2,
        y2,
    };
    //passing options so that on adjusting the size while drawing new style of rough js is not created or size doesnot buffers
    let options = {
        seed: id+1,//id cant be 0
    }
    switch (type) {
        case TOOL_ITEMS.LINE:
            element.roughEle = gen.line(x1, y1, x2, y2,options);
            return element;
        case TOOL_ITEMS.RECTANGLE:
            element.roughEle = gen.rectangle(x1, y1, x2-x1, y2-y1,options);
            return element;
        default:
            throw new Error("Type not recognized");
    }
    
};
