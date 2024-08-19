let Resume = () => {
    return (
        <div
            className={"modal_com_container flex flex-wrap overflow-y-scroll scrollbar-hide font-jua dark:text-gray-800"}>
            <div className={"part_d_career part_d flex flex-col items-center"}>
                <a href={"/portfolio-site/resume"} className={"text-blue-600 underline"}>크게 보기</a>
                <iframe
                    src="/portfolio-site/resume"
                    title="resume Page"
                    width="100%"
                    height="auto"
                    style={{border: 'none'}}
                />
            </div>
        </div>
    )
}

export default Resume;