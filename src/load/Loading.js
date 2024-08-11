import "./../css/load.css";
import React from 'react';
import {Html, useProgress} from '@react-three/drei';

const LoadingScreen = ({progress}) => {
    return (
        <div className="loadingContainer">
            <p>넨이의 포트폴리오</p>
            <br/>
            <div className="spinner"></div>
            <p>Loading... {progress.toFixed(2)}%</p>
        </div>
    );
};

function Loading() {

    const {progress} = useProgress();

    return (
        <Html fullscreen>
            <div className="appContainer">
                <LoadingScreen progress={progress}/>
            </div>
        </Html>
    );
}

export default Loading;

