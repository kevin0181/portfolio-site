import React from "react";

let SelectIcon = ({icon, setProgram}) => {
    switch (icon) {
        case "youtube":
            return <YoutubeComponent/>
        case "map":
            return <MapComponent/>
        case "spotify":
            return <SpotifyComponent/>
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.085489228413!2d144.96305761589207!3d-37.81410757975144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218ce6e0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1616710276799!5m2!1sen!2sus"
                title="google map"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
            />
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
export default Browser;