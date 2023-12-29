import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./Home";
import Room from "./Room";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={`/`} element={<Home />} />
        <Route path={`/room/`} element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
