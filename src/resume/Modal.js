// Modal.js
import { useEffect } from "react";

const Modal = ({ isOpen, onClose, children }) => {
    // ESC 키로 닫기 기능 추가
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null; // 모달이 닫혀있으면 렌더링하지 않음

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4"
             style={{zIndex: 1000}}>
            <div
                className="relative bg-white p-6 rounded-lg shadow-lg w-[90vw] h-[90vh] max-w-4xl max-h-[90vh] overflow-hidden">
                {/* X 버튼 (우측 상단) */}
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                    onClick={onClose}
                >
                    ✖
                </button>

                {/* 상하 스크롤 (좌우 스크롤 제거) */}
                <div className="overflow-y-auto h-full p-2 custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>

    );
};

export default Modal;
