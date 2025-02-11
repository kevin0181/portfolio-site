import React, {useEffect, useState} from "react";
import {HfInference} from "@huggingface/inference";

let SelectIcon = ({icon, setProgram}) => {
    switch (icon) {
        case "youtube":
            return <YoutubeComponent/>
        case "map":
            return <MapComponent/>
        case "spotify":
            return <SpotifyComponent/>
        case "setting":
            return <SettingComponent/>
        case "deepseek":
            return <DeepSeek/>
        case "doom":
            return <Doom/>
        default:
            //setProgram("");
            break;
    }
}

let YoutubeComponent = () => {
    return (
        <div className={"mac_youtube_cp"}>
            <iframe src="https://www.youtube.com/embed/I8So1qmFH7k"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
            />
        </div>
    )
}

let MapComponent = () => {
    return (
        <div className={"mac_youtube_cp"}>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6347.3782684297585!2d126.81710368569334!3d37.30250081311309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357b6fa438180397%3A0xfb13490db1b671bf!2z7JWI7IKw7Zi47JuQ7LSI65Ox7ZWZ6rWQ!5e0!3m2!1sko!2skr!4v1723451449375!5m2!1sko!2skr"
                width="1800" height="4000" allowFullScreen="" loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
    )
}


let SpotifyComponent = () => {
    return (
        <div className={"mac_youtube_cp"}>
            <iframe
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                src="https://open.spotify.com/embed/track/5elW2CKSoqjYoJ32AGDxf1?utm_source=generator"
                loading="lazy"></iframe>
        </div>
    )
}

let SettingComponent = () => {
    return (
        <div className={"mac_youtube_cp"}>
            <p style={{
                fontSize: "100px",
                color: "black",
                padding: "1%"
            }} className={"overflow-y-hidden"}>
                안녕하세요. 넨이의 포트폴리오 입니다.
                <br/>
                깃허브 페이지로 작성되었으며 R3F를 사용한 모델링 기반 React 페이지 입니다.
                <br/>

                <p style={{
                    fontSize: "70px"
                }}>
                    저작권
                    <br/>
                    모든 모델링은 무료 모델링 또는 직접 제작한 모델링이며 아래는 해당 무료 모델링에 대한 라이센스 txt입니다.
                    <br/>

                    1.Model Information:
                    * title: Razer Setup Scene
                    * source: https://sketchfab.com/3d-models/razer-setup-scene-00d1918300634af48489467002fcb308
                    * author: brendan wood (https://sketchfab.com/brendanwood872)

                    Model License:
                    * license type: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
                    * requirements: Author must be credited. Commercial use is allowed.

                    If you use this 3D model in your project be sure to copy paste this credit wherever you share it:
                    This work is based on "Razer Setup Scene"
                    (https://sketchfab.com/3d-models/razer-setup-scene-00d1918300634af48489467002fcb308) by brendan wood
                    (https://sketchfab.com/brendanwood872) licensed under CC-BY-4.0
                    (http://creativecommons.org/licenses/by/4.0/)
                    2.IMPORTANT NOTICE: This license only applies if you downloaded this content as
                    an unsubscribed user. If you are a premium user (ie, you pay a subscription)
                    you are bound to the license terms described in the accompanying file
                    "License premium.txt".

                    ---------------------

                    You must attribute the image to its author:

                    In order to use a content or a part of it, you must attribute it to Freepik,
                    so we will be able to continue creating new graphic resources every day.


                    How to attribute it?

                    For websites:

                    Please, copy this code on your website to accredit the author:
                    <a href="http://www.freepik.com">Designed by Freepik</a>

                    For printing:

                    Paste this text on the final work so the authorship is known.
                    - For example, in the acknowledgements chapter of a book:
                    "Designed by Freepik"


                    You are free to use this image:

                    - For both personal and commercial projects and to modify it.
                    - In a website or presentation template or application or as part of your design.

                    You are not allowed to:

                    - Sub-license, resell or rent it.
                    - Include it in any online or offline archive or database.

                    The full terms of the license are described in section 7 of the Freepik
                    terms of use, available online in the following link:

                    http://www.freepik.com/terms_of_use

                    The terms described in the above link have precedence over the terms described
                    in the present document. In case of disagreement, the Freepik Terms of Use
                    will prevail.

                </p>
            </p>
        </div>
    )
}

let Browser = ({program, setProgram}) => {

    let onClickClose = () => {
        setProgram("");
    }

    return (
        <div className="mx-auto" style={{
            height: "100%"
        }}>
            <div style={{
                height: "4%",
                borderRadius: "70px 70px 0px 0px"
            }}
                 className="bg-gray-200 flex items-center space-x-6 px-4">
                <span className="w-24 h-24 rounded-full bg-red-400" onClick={onClickClose}></span>
                <span className="w-24 h-24 rounded-full bg-yellow-400"></span>
                <span className="w-24 h-24 rounded-full bg-green-400"></span>
            </div>
            <div className="bg-gray-100 border-t-0 w-full h-96" style={{
                height: "80%",
                borderRadius: "0px 0px 70px 70px",
                color: "black"
            }}>
                <SelectIcon icon={program} setProgram={setProgram}/>
            </div>
        </div>
    )
}

let DeepSeek = () => {
    const client = new HfInference("1");
    const [input, setInput] = useState(""); // 사용자 입력 저장
    const [response, setResponse] = useState(""); // AI 응답 저장
    const [loading, setLoading] = useState(false);

    const fetchChatCompletion = async () => {
        if (!input.trim()) return; // 빈 입력 방지
        setLoading(true);
        try {
            const chatCompletion = await client.chatCompletion({
                model: "deepseek-ai/DeepSeek-R1",
                messages: [{role: "user", content: input}],
                provider: "together",
                max_tokens: 500,
            });

            setResponse(chatCompletion.choices[0].message.content);
        } catch (error) {
            console.error("Error fetching chat completion:", error);
            setResponse("Error: 응답을 가져올 수 없습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            backgroundColor: "#343541",
            color: "white",
            fontFamily: "Arial, sans-serif",
            fontSize: "100px"
        }}>
            <h2 style={{marginBottom: "20px"}}>DeepSeek Chat</h2>

            <div style={{
                width: "60%",
                minHeight: "200px",
                padding: "20px",
                backgroundColor: "#444654",
                borderRadius: "10px",
                overflowY: "auto",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                textAlign: "left"
            }}>
                {loading ? <p>⌛ 로딩 중...</p> : <p>{response || "질문을 입력하세요!"}</p>}
            </div>

            <div style={{
                display: "flex",
                width: "60%",
                marginTop: "20px"
            }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="질문을 입력하세요..."
                    style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "5px",
                        border: "none",
                        outline: "none",
                        color: "black",
                    }}
                />
                <button
                    onClick={fetchChatCompletion}
                    style={{
                        marginLeft: "10px",
                        padding: "10px 20px",
                        fontWeight: "bold",
                        backgroundColor: "#10A37F",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    보내기
                </button>
            </div>
        </div>
    );
}

let Doom = () => {
    return (
        <div className={"mac_youtube_cp"} style={{
            fontSize: "100px",
        }}>
            둠 ㅎㅇ
        </div>
    )
}

export default Browser;