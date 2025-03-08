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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{
            zIndex: 1000
        }}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                {children}
                <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded" onClick={onClose}>
                    닫기
                </button>
            </div>
        </div>
    );
};

export default Modal;
