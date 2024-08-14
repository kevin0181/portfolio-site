import "./../css/model/showPage.css";
import {useEffect, useState} from "react";

let ShowPage = ({showHtml, setShowHtml}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        console.log(showHtml);
        if (showHtml === "cls") {
            handleClose();
        } else if (showHtml !== "") {
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
            <div
                onClick={handleClose}
                className="close-button p-2 text-gray-400 cursor-pointer inline-flex items-center justify-center"
                role="button"
                aria-label="Close menu"
            >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </div>
        </div>
    );
}

export default ShowPage;
