import {
    BrowserRouter, Navigate, Route, Routes
} from "react-router-dom";
import Main from "./Main";
import Resume from "./resume/Resume";
import React from "react";

function App() {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <div className="App">
                <Routes>
                    <Route path={"/"} element={<Navigate to="/main" replace />} />
                    <Route path={"/main"} element={<Main/>}/>
                    <Route path={"/resume"} element={<Resume/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
