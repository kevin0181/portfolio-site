import "./../css/model/showPage.css";
import {useEffect, useState} from "react";

let ShowPage = ({showHtml, setShowHtml}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        console.log(showHtml);
        if (showHtml === "cls") {
            console.log(2);
            handleClose();
        } else if (showHtml !== "") {
            console.log(1);
            setIsVisible(true);
        }
    }, [showHtml]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
        }, 500);
    };

    return (
        <div className={`showPage_container ${isVisible ? "" : "hide"}`}>
            {/* 슬라이드 애니메이션이 적용될 내용 */}
            <button onClick={handleClose}>Close</button>
        </div>
    );
}

export default ShowPage;
