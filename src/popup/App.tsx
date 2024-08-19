import "../utils/style-utils/globals.css";
import BlockList from "./components/BlockList";
import FocusList from "./components/FocusList";
import "./index.css";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <>
      <div className="w-[20rem] h-[25rem] p-1">
        <BlockList />
        <FocusList />
      </div>
    </>
  );
}

export default App;
