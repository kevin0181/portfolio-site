import {
    BrowserRouter, Route, Routes, useLocation
} from "react-router-dom";
import Loading from "./load/Loading";
import Main from "./Main";


function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function RedirectHandler() {
    const query = useQuery();
    const path = query.get('');

    if (path) {
        window.history.replaceState(null, '', path);
    }

    return null;
}

function App() {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <div className="App">
                <Routes>
                    <Route path={"/main"} element={<Main/>}/>
                    <Route path={"/"} exact element={<Loading/>}/>
                    <Route component={RedirectHandler} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
