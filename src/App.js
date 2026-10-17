import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import Resume from "./resume/Resume";

const GamePortfolio = lazy(() => import("./game/GamePortfolio"));

function App() {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <div className="App">
                <Routes>
                    <Route path={"/resume"} element={<Resume/>}/>
                    <Route path={"/play"} element={<Suspense fallback={<div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f4f1e9", color: "#718265" }}>월드를 불러오는 중…</div>}><GamePortfolio /></Suspense>}/>
                    <Route path={"*"} element={<Navigate to="/play" replace/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
