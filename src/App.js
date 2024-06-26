import {
    BrowserRouter, Route, Routes
} from "react-router-dom";
import Loading from "./load/Loading";
import Main from "./Main";

function App() {
    return (
        <BrowserRouter basename={"portfolio-site"}>
            <div className="App">
                <Routes>
                    <Route path={"/"} element={<Loading/>}/>
                    <Route path={"/main"} element={<Main/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
