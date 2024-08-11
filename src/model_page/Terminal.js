import React, {useState} from "react";

let Terminal = ({setTerminalStatus, navigate}) => {

    let onClickClose = () => {
        setTerminalStatus("");
    }

    let [answer, setAnswer] = useState("");

    let onChangeAnswer = (e) => {
        setAnswer(e.target.value);
    }

    let onKeyPress = (e) => {
        if (e.key === "Enter") {
            if (answer === "a") {
                navigate("/");  // "a" 입력 시 /portfolio 페이지로 이동
            }
        }
    }

    return (
        <div className="mx-auto bg-gray-900 text-gray-200 font-mono" style={{
            height: "100%",
            borderRadius: "70px 70px 0px 0px"
        }}>
            <div style={{
                height: "4%",
                borderRadius: "70px 70px 70px 70px"
            }}
                 className="bg-gray-800 flex items-center space-x-6 px-4">
                <span className="w-24 h-24 rounded-full bg-red-500" onClick={onClickClose}></span>
                <span className="w-24 h-24 rounded-full bg-yellow-500"></span>
                <span className="w-24 h-24 rounded-full bg-green-500"></span>
            </div>

            <div className="flex-1 p-4" style={{
                fontSize: "100px"
            }}>
                <div className="mt-2">
                    <div className="bg-gray-800 p-2 mt-1">
                        <p> a : Portfolio
                            <br/>
                            b : login
                        </p>
                    </div>
                    <span className="text-green-500">&gt; Answer:</span>
                </div>
                <div className="flex">
                    <div className="mr-2">&gt;</div>
                    <input type="text" className="flex-1 bg-gray-800 focus:outline-none"
                           value={answer} name={answer} onChange={onChangeAnswer} onKeyUp={onKeyPress}
                           placeholder="Type your command here"/>
                </div>
            </div>
        </div>
    )
}

export default Terminal;