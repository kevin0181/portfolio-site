import "./../css/ui.css";
import React, {useEffect, useState} from 'react';

const ThemeToggle = ({darkMode, setDarkMode, mouseStatus, setMouseStatus}) => {

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark');
    };

    const toggleMouseStatus = () => {
        setMouseStatus(!mouseStatus);
    };

    useEffect(() => {
        console.log(mouseStatus);
    }, [mouseStatus]);

    return (
        <div className="default_ui_container">
            <div className="flex">
                <div
                    onClick={toggleDarkMode}
                    className="h-12 w-12 rounded-lg p-2 cursor-pointer flex items-center justify-center"
                    role="button"
                    aria-label="Toggle Dark Mode"
                >
                    <svg
                        className={`fill-yellow-500 block ${darkMode ? 'hidden' : ''}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                            fillRule="evenodd"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                    <svg
                        className={`fill-violet-700 ${darkMode ? 'block' : 'hidden'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                    </svg>
                </div>
                <div className={"mouse_tog_button flex justify-center items-center"}>
                    <div style={{
                        width: "40px"
                    }}
                         onClick={toggleMouseStatus}
                         className={`relative w-9 h-5 cursor-pointer rounded-full ${mouseStatus ? 'bg-blue-600' : 'bg-gray-300'} transition-colors duration-300`}
                    >
                        <div
                            className={`absolute top-[2px] ${mouseStatus ? 'start-5' : 'start-[2px]'} w-4 h-4 bg-white rounded-full transition-transform duration-300`}
                        ></div>
                    </div>
                    <span className="text-sm font-bold font-sans text-gray-600 dark:text-gray-300 ml-2.5">Mouse</span>
                </div>
            </div>
        </div>
    );
};

export default ThemeToggle;
