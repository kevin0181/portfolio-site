import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Resume from "./resume/Resume";

function App() {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <div className="App">
                <Routes>
                    <Route path={"/resume"} element={<Resume/>}/>
                    <Route path={"*"} element={<Navigate to="/resume" replace/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
