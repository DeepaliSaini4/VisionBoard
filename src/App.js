import Board from "./components/Board";
import Toolbar from "./components/Toolbar";
import BoardProvider from "./store/BoardProvider";

function App() {
  // Provides board state to Toolbar and Board
  return (
    <BoardProvider>
    <Toolbar/>
    <Board/>
    </BoardProvider>
    
  );
}

export default App;
