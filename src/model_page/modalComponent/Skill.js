let Skill = () => {
    return (
        <div className={"modal_com_container flex flex-wrap overflow-y-scroll scrollbar-hide font-Kanit"}>
            <div className={"part_d lg:basis-1/3 md:basis-1/2 sm:basis-full"}>
                <div className={"part_d_w bg-white flex flex-col"}>
                    <div className={"part_d_top"}>
                        <p>Front-End</p>
                        <hr/>
                    </div>
                    <div className={"part_d_bottom"}>
                        <div className={"skill_icon"}>
                            <img src={`${process.env.PUBLIC_URL}/img/skill/html_icon.png`} alt={"html icon"}/>
                        </div>
                        <div className={"skill_icon"}>
                            <img src={`${process.env.PUBLIC_URL}/img/skill/javascript_icon.png`} alt={"js icon"}/>
                        </div>
                        <div className={"skill_icon"}>
                            <img src={`${process.env.PUBLIC_URL}/img/skill/css_icon.png`} alt={"css icon"}/>
                        </div>
                        <div className={"skill_icon"}>
                            <img src={`${process.env.PUBLIC_URL}/img/skill/bootstrap.png`} alt={"bootstrap icon"}/>
                        </div>
                        <div className={"skill_icon"}>
                            <img src={`${process.env.PUBLIC_URL}/img/skill/jquery.png`} alt={"jquery icon"}/>
                        </div>
                        <div className={"skill_icon"} style={{
                            width: "190px"
                        }}>
                            <img src={`${process.env.PUBLIC_URL}/img/skill/tailwindcss_icon.png`}
                                 alt={"tailwindcss icon"}/>
                        </div>
                        <div className={"skill_icon"}>
                            <img src={`${process.env.PUBLIC_URL}/img/skill/react_icon.png`} alt={"react icon"}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"part_d lg:basis-1/3 md:basis-1/2 sm:basis-full flex flex-col"}>
                <div className={"part_d_w bg-white"}>
                    <div className={"part_d_top"}>
                        <p>Back-End</p>
                        <hr/>
                    </div>
                    <div className={"part_d_bottom"}>
                        <div className={"skill_icon"}>
                            <img src={`${process.env.PUBLIC_URL}/img/skill/java_icon.png`} alt={"java icon"}/>
                        </div>
                        <div className={"skill_icon"} style={{
                            width: "200px"
                        }}>
                            <img src={`${process.env.PUBLIC_URL}/img/skill/springboot_icon.png`}
                                 alt={"springboot icon"}/>
                        </div>
                        <div className={"skill_icon"}>
                            <img src={`${process.env.PUBLIC_URL}/img/skill/nodejs_icon.png`}
                                 alt={"nodejs icon"}/>
                        </div>
                        <div className={"skill_icon"}>
                            <img src={`${process.env.PUBLIC_URL}/img/skill/tomcat_icon.png`}
                                 alt={"tomcat icon"}/>
                        </div>
                        <div className={"skill_icon"} style={{
                            width: "167px"
                        }}>
                            <img src={`${process.env.PUBLIC_URL}/img/skill/mysql_icon.png`}
                                 alt={"mysql icon"}/>
                        </div>
                    </div>
                </div>
                <div className={"part_d_w bg-white mt-2"}>
                    <div className={"part_d_top"}>
                        <p>Communication</p>
                        <hr/>
                    </div>
                    <div className={"part_d_bottom"}>

                    </div>
                </div>
            </div>
            <div className={"part_d lg:basis-1/3 md:basis-1/2 sm:basis-full flex flex-col"}>
                <div className={"part_d_w bg-white"}>
                    <div className={"part_d_top"}>
                        <p>Version Control</p>
                        <hr/>
                    </div>
                    <div className={"part_d_bottom"}>

                    </div>
                </div>
                <div className={"part_d_w bg-white mt-2"}>
                    <div className={"part_d_top"}>
                        <p>Tool</p>
                        <hr/>
                    </div>
                </div>
                <div className={"part_d_bottom"}>

                </div>
            </div>
        </div>
    )
}

export default Skill;