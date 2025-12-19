const Doom = () => {
    return (
        <div
            style={{
                position: "fixed",  // 화면에 고정
                top: 0,
                left: 0,
                width: "100vw",     // 뷰포트 기준 가로 100%
                height: "100vh",    // 뷰포트 기준 세로 100%
                margin: 0,
                padding: 0,
                zIndex: 9999,       // 다른 요소 위에 표시
            }}
        >
            <iframe
                src="https://js-dos.com/games/doom.exe.html"
                width="100%"
                height="100%"
                style={{
                    border: "none",
                    display: "block",
                }}
                title="DOOM"
            ></iframe>
        </div>
    );
}

export default Doom;
