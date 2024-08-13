import "./../css/model/showPage.css";
import {useEffect, useState} from "react";

let ShowPage = ({showHtml, setShowHtml}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (showHtml !== "") {
            setIsVisible(true);
        }
    }, [showHtml]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            // 사라지는 애니메이션이 끝난 후 컴포넌트를 제거하는 로직을 추가할 수 있습니다.
        }, 500); // slideOut 애니메이션의 시간과 동일하게 설정
    };

    return (
        <div className={`showPage_container ${isVisible ? "" : "hide"}`}>
            {/* 슬라이드 애니메이션이 적용될 내용 */}
            <button onClick={handleClose}>Close</button>
        </div>
    );
}

export default ShowPage;
