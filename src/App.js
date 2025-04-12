import OriginalResearch1 from "./components/OriginalResearch1/OriginalResearch1";
import OriginalResearch2 from "./components/OriginalResearch2/OriginalResearch2";
import SwiftFoliosResearchForm from "./components/SwiftFoliosResearchForm/SwiftFoliosResearchForm";
import CustomDropdown from "./components/CustomComponents/CustomDropdown/CustomDropdown";
import AppRoutes from "./AppRoutes";
import "./App.css";
import "./css/global.css"

function App() {
  
  return (
    <div className="App">
      {/* <SwiftFoliosResearchForm />
      <OriginalResearch1 />
      <OriginalResearch2  /> */}
      <AppRoutes/>
    </div>
  );
}

export default App;
