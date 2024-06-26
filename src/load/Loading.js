import "./../css/load.css";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
const LoadingScreen = ({ progress }) => {
    return (
        <div className="loadingContainer">
            <div className="spinner"></div>
            <p>Loading... {progress}%</p>
        </div>
    );
};

const Loading = () => {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setLoading(false);
                    return 100;
                }
                return prev + 1;
            });
        }, 30); // 30ms마다 1%씩 증가 (3초 동안 100%)

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 정리
    }, []);

    useEffect(() => {
        if (!loading) {
            navigate('/main');
        }
    }, [loading, navigate]);

    return (
        <div className="appContainer">
            {loading ? <LoadingScreen progress={progress} /> : null}
        </div>
    );
}

export default Loading;
