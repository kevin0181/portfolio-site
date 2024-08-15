import "./../css/model/showPage.css";
import {useEffect, useState} from "react";
import Resume from "./modalComponent/Resume";
import Project from "./modalComponent/Project";
import Skill from "./modalComponent/Skill";
import AboutMe from "./modalComponent/AboutMe";
import Career from "./modalComponent/Career";

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

    let ModalComponent = ({showHtml}) => {

        switch (showHtml) {
            case 'resume':
                return <Resume/>;
            case 'project':
                return <Project/>;
            case 'skill':
                return <Skill/>;
            case 'aboutMe':
                return <AboutMe/>;
            case 'career':
                return <Career/>;
        }

    }

    return (
        <div className={`showPage_container dark:bg-gray-800 ${isVisible ? "" : "hide"}`}>
            {/* 슬라이드 애니메이션이 적용될 내용 */}
            <div
                onClick={handleClose}
                className="close-button p-2 dark:text-white text-gray-400 cursor-pointer inline-flex items-center justify-center"
                role="button"
                aria-label="Close menu"
            >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </div>
            <div>
                <ModalComponent showHtml={showHtml}/>
            </div>
        </div>
    );
}

export default ShowPage;
