let AboutMe = () => {
    return (
        <div
            className={"modal_com_container flex flex-wrap overflow-y-scroll scrollbar-hide font-Kanit dark:text-gray-800"}>
            <div className={"part_d_img part_d lg:basis-1/2 md:basis-full flex items-center justify-center"}>
                <div>
                    <img src={`${process.env.PUBLIC_URL}/img/face.png`} alt={"얼굴 이미지"}/>
                </div>
            </div>
            <div className={"part_d_info part_d lg:basis-1/2 md:basis-full flex items-center justify-center"}>
                <div className={"bg-white"}>
                    <div className={"info_top mb-8"}>
                        <p>About Me</p>
                    </div>
                    <div className={"info_body flex flex-col font-jua"}>
                        <div>
                            <span className={"font-bold"}>이름 :</span> <span>유영빈</span>
                        </div>
                        <div>
                            <span className={"font-bold"}>생년월일 :</span> <span>00.01.25</span>
                        </div>
                        <div>
                            <span className={"font-bold"}>주소지 :</span> <span>경기도 안산시 단원구</span>
                        </div>
                        <div>
                            <span className={"font-bold"}>연락처 :</span> <span>+82 10-8888-8888</span>
                        </div>
                        <div>
                            <span className={"font-bold"}>이메일 :</span> <span>kevin018111@gmail.com</span>
                        </div>
                        <div>
                            <span className={"font-bold"}>학력 :</span> <span>대학교(재학중)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutMe;