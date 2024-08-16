let Skill = () => {
    return (
        <div
            className={"modal_com_container flex flex-wrap overflow-y-scroll scrollbar-hide font-Kanit dark:text-gray-800"}>
            <div className={"part_d lg:basis-1/3 md:basis-full flex flex-col"}>
                <div className={"part_d_w bg-white"}>
                    <div className={"part_d_top"}>
                        Front-End
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
                        Back-End
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
                        etc
                        <hr/>
                    </div>
                    <div className={"part_d_bottom"}>
                        <div className={"skill_icon"}>
                            <img src={`${process.env.PUBLIC_URL}/img/skill/cpp_icon.png`}
                                 alt={"cpp icon"}/>
                        </div>
                        <div className={"skill_icon"}>
                            <img src={`${process.env.PUBLIC_URL}/img/skill/python.png`}
                                 alt={"python icon"}/>
                        </div>
                        <div className={"skill_icon"}>
                            <img src={`${process.env.PUBLIC_URL}/img/skill/naverCloud.png`}
                                 style={{
                                     borderRadius: "10px",
                                 }}
                                 alt={"naverCloud icon"}/>
                        </div>
                        <div className={"skill_icon"}>
                            <img src={`${process.env.PUBLIC_URL}/img/skill/3dsmax_icon.png`}
                                 alt={"3dsmax icon"}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"part_d lg:basis-1/3 md:basis-1/2 sm:basis-full flex flex-col"}>
                <div className={"part_d_w bg-white mt-2"}>
                    <div className={"part_d_top"}>
                        Version Control
                        <hr/>
                    </div>
                    <div className={"part_d_bottom"}>
                        <div className={"skill_icon"}>
                            <img src={`${process.env.PUBLIC_URL}/img/skill/git_icon.png`}
                                 alt={"git icon"}/>
                        </div>
                        <div className={"skill_icon"}>
                            <img src={`${process.env.PUBLIC_URL}/img/skill/github.png`}
                                 alt={"github icon"}/>
                        </div>
                    </div>
                </div>
                <div className={"part_d_w bg-white mt-2"}>
                    <div className={"part_d_top"}>
                        Tool
                        <hr/>
                    </div>
                    <div className={"part_d_bottom"}>
                        <div className={"skill_icon"}>
                            <img src={`${process.env.PUBLIC_URL}/img/skill/intellij_icon.png`}
                                 alt={"intellij icon"}/>
                        </div>
                        <div className={"skill_icon"}>
                            <img src={`${process.env.PUBLIC_URL}/img/skill/eclipse_icon.png`}
                                 alt={"eclipse icon"}/>
                        </div>
                    </div>
                </div>
                <div className={"part_d_w bg-white mt-2"}>
                    <div className={"part_d_top"}>
                        Communication
                        <hr/>
                    </div>
                    <div className={"part_d_bottom"}>
                        <div className={"skill_icon"} style={{
                            padding: "3%"
                        }}>
                            <img src={`${process.env.PUBLIC_URL}/img/skill/notion_icon.png`}
                                 alt={"notion icon"}/>
                        </div>
                        <div className={"skill_icon"} style={{
                            padding: "3%"
                        }}>
                            <img src={`${process.env.PUBLIC_URL}/img/skill/discord_icon.png`}
                                 alt={"discord icon"}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Skill;