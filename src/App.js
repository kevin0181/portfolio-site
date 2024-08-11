import {
    BrowserRouter, Navigate, Route, Routes
} from "react-router-dom";
import Main from "./Main";
import Resume from "./resume/Resume";
import React from "react";
import Razer from "./model_page/Razer";

function App() {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <div className="App">
                <Routes>
                    <Route path={"/"} element={<Navigate to="/main" replace/>}/>
                    <Route path={"/main"} element={<Razer/>}/>
                    <Route path={"/portfolio"} element={<Main/>}/>
                    <Route path={"/resume"} element={<Resume/>}/>
                    <Route path={"/project"}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
