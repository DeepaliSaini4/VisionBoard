import Board from "./components/Board";
import Toolbar from "./components/Toolbar";
import Toolbox from "./components/Toolbox";
import  ToolboxProvider from "./store/toolboxProvider";
import BoardProvider from "./store/BoardProvider";

function App() {
  // Provides board state to Toolbar and Board
  return (
    <BoardProvider>
    <ToolboxProvider>
    <Toolbar/>
    <Board/>
    <Toolbox/>
    </ToolboxProvider>
    </BoardProvider>
    
  );
}

export default App;
