import React, {useEffect, useRef, useState} from "react";

let Terminal = ({setTerminalStatus, navigate}) => {
    const initialInputRef = useRef(null); // 첫 번째 input 태그에 대한 ref
    const [answer, setAnswer] = useState("");
    const [inputs, setInputs] = useState([]); // 여러 input 필드를 관리하는 배열
    const [inputRefs, setInputRefs] = useState([]); // 각 input 태그에 대한 ref 배열
    const [errors, setErrors] = useState([]); // 각 input에 대한 오류 상태 배열
    const [showConnecting, setShowConnecting] = useState(false);

    useEffect(() => {
        if (initialInputRef.current) {
            initialInputRef.current.focus(); // 컴포넌트가 마운트될 때 첫 번째 input 요소에 포커스를 설정
        }
    }, []);

    useEffect(() => {
        if (inputRefs.length > 0) {
            inputRefs[inputRefs.length - 1].current.focus(); // 새로운 input 태그에 포커스
        }
    }, [inputRefs]);

    let onClickClose = () => {
        setTerminalStatus("");
    };

    let onChangeAnswer = (e) => {
        setAnswer(e.target.value);
    };

    let onKeyPress = (e) => {
        if (e.key === "Enter") {
            if (answer === "a") {
                setShowConnecting(true);
                navigate("/portfolio"); // "a" 입력 시 /portfolio 페이지로 이동
            } else {
                addNewInputField();
            }
        }
    };

    const addNewInputField = () => {
        setInputs([...inputs, ""]);
        setErrors([...errors, "Error"]); // 새로운 input에 대한 오류 메시지를 추가
        const newRef = React.createRef();
        setInputRefs([...inputRefs, newRef]); // 새로운 input에 대한 ref 추가
    };

    let handleChange = (e, index) => {
        const newInputs = [...inputs];
        newInputs[index] = e.target.value;
        setInputs(newInputs);
    };

    let handleKeyPress = (e, index) => {
        if (e.key === "Enter") {
            if (inputs[index] === "a") {
                setShowConnecting(true);
                navigate("/portfolio"); // "a" 입력 시 /portfolio 페이지로 이동
            }
            if (inputs[index] === "clear") {
                setInputs([]);
                setInputRefs([]);
                initialInputRef.current.focus();
                setAnswer("");
            } else {
                addNewInputField();
            }
        }
    };

    return (
        <div
            className="mx-auto bg-gray-900 text-gray-200 font-mono"
            style={{
                height: "100%",
                borderRadius: "70px 70px 0px 0px",
            }}
        >
            <div
                style={{
                    height: "4%",
                    borderRadius: "70px 70px 70px 70px",
                }}
                className="bg-gray-800 flex items-center space-x-6 px-4"
            >
                <span className="w-24 h-24 rounded-full bg-red-500" onClick={onClickClose}></span>
                <span className="w-24 h-24 rounded-full bg-yellow-500"></span>
                <span className="w-24 h-24 rounded-full bg-green-500"></span>
            </div>

            <div
                className="flex-1 p-4 overflow-y-hidden"
                style={{
                    fontSize: "100px",
                    height: "96%"
                }}
            >
                <div className="mt-2">
                    <div className="bg-gray-800 p-2 mt-1">
                        <p
                            style={{
                                padding: "0.3% 0",
                            }}
                        >
                            &nbsp; Hello! This is 넨이 portfolio site.
                            <br/>
                            &nbsp; If you want to access the portfolio site, please press >> a.
                        </p>
                    </div>
                </div>
                <div className="flex mt-9">
                    <div className="mr-2">&gt;&gt;</div>
                    <input
                        type="text"
                        className="flex-1 bg-gray-800 focus:outline-none"
                        ref={initialInputRef}
                        value={answer}
                        name={answer}
                        onChange={onChangeAnswer}
                        onKeyUp={onKeyPress}
                        placeholder="Type your command here"
                        style={{
                            padding: "0px 1%",
                        }}
                    />
                </div>

                {showConnecting && (
                    <div className="p-2 mt-1">
                        <p
                            className={"text-green-500"}
                            style={{
                                padding: "0.3% 2%",
                            }}
                        >
                            Connecting...
                        </p>
                    </div>
                )}

                {inputs.map((input, index) => (
                    <div key={index}>
                        {errors[index] && (
                            <div className="p-2 mt-1">
                                <p
                                    className={"text-red-500"}
                                    style={{
                                        padding: "0.3% 2%",
                                    }}
                                >
                                    {errors[index]}
                                </p>
                            </div>
                        )}
                        <div className="flex mt-4">
                            <div className="mr-2">&gt;&gt;</div>
                            <input
                                type="text"
                                className="flex-1 bg-gray-800 focus:outline-none"
                                ref={inputRefs[index]}
                                value={input}
                                onChange={(e) => handleChange(e, index)}
                                onKeyUp={(e) => handleKeyPress(e, index)}
                                placeholder="Try again"
                                style={{
                                    padding: "0px 1%",
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Terminal;
