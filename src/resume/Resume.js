import "./../css/resume.css";
import {MailIcon} from '@heroicons/react/solid';
import {PhoneIcon} from '@heroicons/react/solid';
import {BookmarkIcon} from '@heroicons/react/solid';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithub, faJava} from '@fortawesome/free-brands-svg-icons';
import {
    SiTistory,
    SiNotion,
    SiJavascript,
    SiCplusplus,
    SiSpringboot,
    SiReact,
    SiApachetomcat,
    SiNginx, SiMysql, SiOracle, SiRedis, SiMongodb, SiGit, SiGithub, SiIntellijidea, SiVisualstudiocode, SiWindows
} from 'react-icons/si'; // Simple Icons에서 Tistory 아이콘 import

import Modal from "./Modal";
import {useState} from "react";
import {useNavigate} from "react-router-dom";


let Resume = () => {

    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate hook

    const [isModalOpen, setIsModalOpen] = useState(false);


    return (
        <>
            <div className={"resume_container flex justify-center"}>
                <div className={"flex flex-col font-noto"}>
                    <div className={"part_section mt-5 mb-5 flex flex-wrap justify-center "}>
                        <div className={"sm:w-1/3 max-w-72 min-w-52 w-full flex justify-center"}>
                            <img alt={"얼굴 이미지"} style={{
                                borderRadius: "30px",
                                padding: "2% 1%"
                            }} src={`${process.env.PUBLIC_URL}/img/m.jpg`}/>
                        </div>
                        <div style={{
                            padding: "2% 5%"
                        }} className={"part_section_list sm:w-2/3 w-full flex flex-col p-3"}>
                            <div className={"resume_name"}>
                                <span className={"mr-3 text-4xl font-bold"}>유영빈</span>
                                <span>you young bin</span>
                            </div>
                            <div className={"resume_mail flex"}>
                                <MailIcon className="h-6 text-gray-800 w-auto mr-3"/>
                                <span>
                            <a className={"text-blue-700 underline"} href={"mailto:kevin018111@gmail.com"}
                               target={"_blank"}>kevin018111@gmail.com</a>
                        </span>
                            </div>
                            <div className={"resume_contact flex"}>
                                <PhoneIcon className="h-6 text-gray-800 w-auto mr-3"/>
                                <span>82+ 10-3211-9952</span>
                            </div>
                            <div className={"resume_github flex"}>
                                <FontAwesomeIcon icon={faGithub} className="h-6 text-gray-800 w-auto mr-3"/>
                                <span>
                                Web : <a className={"text-blue-700 underline"} href={"https://github.com/kevin0181"}
                                         target={"_blank"}>https://github.com/kevin0181</a>
                                <br/>
                                Game : <a className={"text-blue-700 underline"} href={"https://github.com/neneee0181"}
                                          target={"_blank"}>https://github.com/neneee0181</a>
                            </span>
                            </div>
                            <div className={"resume_tistory flex"}>
                                <SiTistory className="h-6 text-gray-800 w-auto mr-3"/>
                                <span>
                                <a className={"text-blue-700 underline"} href={"https://code-nen.tistory.com/"}
                                   target={"_blank"}>https://code-nen.tistory.com</a>
                            </span>
                            </div>
                            <div className={"resume_notion flex"}>
                                <SiNotion className="h-6 text-gray-800 w-auto mr-3"/>
                                <span>
                                <a className={"text-blue-700 underline"}
                                   href={"https://neneee.notion.site/My-Life-a89c7f78cc7c4b1cb1a0874d1283a15d?pvs=74"}
                                   target={"_blank"}>https://neneee.notion.site</a>
                            </span>
                            </div>
                            <div className={"resume_contact flex"}>
                                <button className="custom-btn btn-6" onClick={() => setIsModalOpen(true)}
                                        style={{
                                            marginRight: "1rem"
                                        }}>자기소개서
                                </button>
                                <button className="custom-btn btn-6" onClick={() => {
                                    navigate("/portfolio");
                                }}>포트폴리오
                                </button>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <div className={"part_section mt-5 mb-5 flex flex-wrap justify-center "}>
                        <div className={"sm:w-1/3 mt-5 max-w-72 min-w-52 w-full flex justify-center"}>
                            <span className={"text-4xl font-light"}>INTRODUCE</span>
                        </div>
                        <div className={"part_section_list sm:w-2/3 w-full mt-3 flex flex-col p-3"}>
                        <span className={"font-light"}>
                            안녕하세요, 저는 웹 백엔드 개발자로서 시작해 현재는 게임 개발의 세계로 진로를 확장하고 있는 개발자입니다. 대학에서 게임 개발 전공을 이수하며, 게임 개발자로서의 커리어를 쌓아가고 있습니다. 이전에는 Node.js, Java, MySQL, Redis, AWS, Git, Linux 등을 활용하여 웹 서비스를 설계하고 개발하는 일을 주로 했으며, 프론트엔드 개발도 다룰 줄 알기에 전체적인 서비스 구조를 이해하고 효율적인 개발이 가능합니다.<br/><br/>
웹 서비스 개발 경험 덕분에 안정적이고 확장성 있는 시스템을 구축하는 방법에 익숙하며, 서비스가 제공하는 가치를 극대화하기 위해 비즈니스와 기술의 접점을 항상 고민해 왔습니다. 이런 경험은 게임 개발에서도 중요한 자산이 될 것이라고 생각합니다. 게임 역시 결국 사용자 경험과 비즈니스 목표를 동시에 만족시켜야 하는 서비스이기 때문에, 양쪽의 요구를 균형 있게 반영하며 개발할 수 있는 역량을 계속해서 키워나가고 있습니다. <br/><br/>
현재는 게임 개발을 중심으로 프로그래밍 역량을 강화하며, 게임 기획, 디자인, 프로그래밍 등 다양한 분야에서 기술을 익히고 있습니다. 게임 개발 과정에서 창의적 문제 해결과 몰입감 있는 경험을 제공하는 것에 흥미를 느끼며, 특히 서버 구조 설계와 네트워크 게임 플레이에 관심을 두고 있습니다. <br/><br/>
개발자로서의 비전은 게임의 기술적 한계를 뛰어넘어 플레이어들에게 새로운 경험을 제공하는 것입니다. 이를 위해 적극적으로 학습하고, 게임 엔진을 다루며, 직접 게임을 개발해보는 프로젝트를 진행 중입니다. 장기적으로는 게임 개발 분야에서 기술 조직을 이끌며, 혁신적인 게임을 만드는 데 기여하고 싶습니다. <br/><br/>
언제나 배움의 자세로 새로운 도전에 임하고 있으며, 더 나은 게임 개발자가 되기 위해 끊임없이 노력하고 있습니다.
                        </span>
                        </div>
                    </div>
                    <hr/>
                    <div className={"part_section mt-5 flex flex-wrap justify-center "}>
                        <div className={"sm:w-1/3 mt-5 max-w-72 min-w-52 w-full flex justify-center"}>
                            <span className={"text-4xl font-light"}>SKILL</span>
                        </div>
                        <div className={"sm:w-2/3 w-full mt-3 flex flex-col p-3"}>
                            <div className={"flex flex-col mb-4"}>
                                <span className={"text-center text-2xl font-extralight"}>Languages</span>
                                <div className={"skill_part font-light flex flex-wrap"} style={{
                                    marginTop: "2rem"
                                }}>
                                    <div className={"flex w-full mb-4 md:w-1/3 justify-center"}>
                                        <FontAwesomeIcon icon={faJava} className="text-red-500 h-6 w-6 mr-4"/>
                                        <span>Java</span>
                                    </div>
                                    <div className={"flex w-full mb-4 md:w-1/3 justify-center"}>
                                        <SiJavascript className="text-yellow-500 h-6 w-6 mr-4"/>
                                        <span>Javascript</span>
                                    </div>
                                    <div className={"flex w-full mb-4 md:w-1/3 justify-center"}>
                                        <SiCplusplus className="text-blue-500 h-6 w-6 mr-4"/>
                                        <span>C++</span>
                                    </div>
                                </div>
                            </div>
                            <div className={"flex flex-col mb-8"}>
                                <span className={"text-center text-2xl font-extralight"}>Fameworks</span>
                                <div className={"skill_part font-light flex"} style={{
                                    marginTop: "2rem"
                                }}>
                                    <div className={"flex w-full justify-center"}>
                                        <SiSpringboot className="text-green-500 h-6 w-6 mr-4"/>
                                        <span>Spring Boot</span>
                                    </div>
                                </div>
                            </div>
                            <div className={"flex flex-col mb-8"}>
                                <span className={"text-center text-2xl font-extralight"}>Libraries</span>
                                <div className={"skill_part font-light flex"} style={{
                                    marginTop: "2rem"
                                }}>
                                    <div className={"flex w-full mb-4 md:w-1/2 justify-center"}>
                                        <SiReact className="text-sky-400 h-6 w-6 mr-4"/>
                                        <span>React.js</span>
                                    </div>
                                    <div className={"flex w-full mb-4 md:w-1/2 justify-center"}>
                                        <SiWindows className="text-blue-500 h-6 w-6 mr-4"/>
                                        <span>Win32Api</span>
                                    </div>
                                </div>
                            </div>
                            <div className={"flex flex-col mb-4 flex-wrap"}>
                                <span className={"text-center text-2xl font-extralight"}>IT Infrastructure</span>
                                <div className={"skill_part font-light flex flex-wrap"} style={{
                                    marginTop: "2rem"
                                }}>
                                    <div className={"flex w-full mb-4 md:w-1/3 justify-center"}>
                                        <img src={`${process.env.PUBLIC_URL}/img/skill/naverCloud.png`}
                                             className={"h-6 w-6 mr-4"}
                                             alt={"naverCloud icon"}/>
                                        <span>Naver Cloud Platform</span>
                                    </div>
                                    <div className={"flex w-full mb-4 md:w-1/3 justify-center"}>
                                        <SiApachetomcat className="text-yellow-500 h-6 w-6 mr-4"/>
                                        <span>Apache Tomcat</span>
                                    </div>
                                    <div className={"flex w-full mb-4 md:w-1/3 justify-center"}>
                                        <SiNginx className="text-green-500 h-6 w-6 mr-4"/>
                                        <span>Nginx</span>
                                    </div>
                                </div>
                            </div>
                            <div className={"flex flex-col mb-4 flex-wrap"}>
                                <span className={"text-center text-2xl font-extralight"}>Databases</span>
                                <div className={"skill_part font-light flex flex-wrap"} style={{
                                    marginTop: "2rem"
                                }}>
                                    <div className={"flex w-full mb-4 md:w-1/4 justify-center"}>
                                        <SiMysql className="text-blue-500 h-6 w-6 mr-4"/>
                                        <span>Mysql</span>
                                    </div>
                                    <div className={"flex w-full mb-4 md:w-1/4 justify-center"}>
                                        <SiOracle className="text-red-500 h-6 w-6 mr-4"/>
                                        <span>Oracle</span>
                                    </div>
                                    <div className={"flex w-full mb-4 md:w-1/4 justify-center"}>
                                        <SiRedis className="text-red-500 h-6 w-6 mr-4"/>
                                        <span>Redis</span>
                                    </div>
                                    <div className={"flex w-full mb-4 md:w-1/4 justify-center"}>
                                        <SiMongodb className="text-green-500 h-6 w-6 mr-4"/>
                                        <span>MongoDB</span>
                                    </div>
                                </div>
                            </div>
                            <div className={"flex flex-col mb-4 flex-wrap"}>
                                <span className={"text-center text-2xl font-extralight"}>Version Control</span>
                                <div className={"skill_part font-light flex flex-wrap"} style={{
                                    marginTop: "2rem"
                                }}>
                                    <div className={"flex w-full mb-4 md:w-1/2 justify-center"}>
                                        <SiGit className="text-orange-500 h-6 w-6 mr-4"/>
                                        <span>Git</span>
                                    </div>
                                    <div className={"flex w-full mb-4 md:w-1/2 justify-center"}>
                                        <SiGithub className="text-black h-6 w-6 mr-4"/>
                                        <span>Github</span>
                                    </div>
                                </div>
                            </div>
                            <div className={"flex flex-col mb-4 flex-wrap"}>
                                <span className={"text-center text-2xl font-extralight"}>Tools</span>
                                <div className={"skill_part font-light flex flex-wrap"} style={{
                                    marginTop: "2rem"
                                }}>
                                    <div className={"flex w-full mb-4 md:w-1/2 justify-center"}>
                                        <SiIntellijidea className="text-black h-6 w-6 mr-4"/>
                                        <span>Intellij</span>
                                    </div>
                                    <div className={"flex w-full mb-4 md:w-1/2 justify-center"}>
                                        <SiVisualstudiocode className="text-blue-600 h-6 w-6 mr-4"/>
                                        <span>VS code</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <div className={"part_section mt-5"}>
                        <div className={"text-4xl font-light mb-8"}>EXPERIENCE</div>
                        <div className={"w-full flex mb-5 mt-5"}>
                            <div className={"w-1/4 flex justify-end mt-2"}>
                                <span>2018.09 ~ 2019.08</span>
                            </div>
                            <div className={"w-3/4 pl-10 flex flex-col"}>
                                <div className={"exp_title font-bold text-2xl mb-3"}>
                                    (주) 네스텍코리아
                                </div>
                                <div className={"exp_sm_title mb-3 text-gray-500 italic"}>
                                    2D CAD 기계 설계자 및 MCT 오퍼레이터
                                </div>
                                <div className={"exp_body mb-3 font-light"}>
                                    <ul className="list-disc pl-5">
                                        <li>반도체에 검사 장비에 들어가는 소켓 개발</li>
                                        <li>캐드를 사용하여 소켓 설계</li>
                                        <li>설계된 도면을 통해 소켓 가공</li>
                                    </ul>
                                </div>
                                <div className={"exp_footer mb-3 mt-4 flex flex-wrap gap-2"}>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">CAD</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">SolidWorks</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">MCT</span>

                                </div>
                            </div>
                        </div>
                        <div className={"w-full flex mb-5 mt-5"}>
                            <div className={"w-1/4 flex justify-end mt-2"}>
                                <span>2019.10.14 ~ 2020.04.24</span>
                            </div>
                            <div className={"w-3/4 pl-10 flex flex-col"}>
                                <div className={"exp_title font-bold text-2xl mb-3"}>
                                    [NCS] JAVA 프로그래밍 백엔드개발 육성 과정평가형 수료
                                </div>
                                <div className={"exp_sm_title mb-3 text-gray-500 italic"}>
                                    처음으로 개발을 시작하게 된 계기
                                </div>
                                <div className={"exp_body mb-3 font-light"}>
                                    <ul className="list-disc pl-5">
                                        <li>기초적인 프로그래밍 언어 학습</li>
                                        <li>정보처리산업기사 자격증 취득</li>
                                        <li>jsp를 사용한 SSR 개발 진행</li>
                                        <li>Oracle을 사용한 다양한 쿼리문 작성</li>
                                        <li><a className={"text-blue-500 underline"} href={"#"}>관련 프로젝트 링크</a></li>
                                    </ul>
                                </div>
                                <div className={"exp_footer mb-3 mt-4 flex flex-wrap gap-2"}>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">Java</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">JavaScript</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">SQL</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">HTML</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">CSS</span>
                                </div>
                            </div>
                        </div>
                        <div className={"w-full flex mb-5 mt-5"}>
                            <div className={"w-1/4 flex justify-end mt-2"}>
                                <span>2020.12.07 ~ 2022.09.06</span>
                            </div>
                            <div className={"w-3/4 pl-10 flex flex-col"}>
                                <div className={"exp_title font-bold text-2xl mb-3"}>
                                    공군 병장 만기 전역
                                </div>
                                <div className={"exp_sm_title mb-3 text-gray-500 italic"}>
                                    컴퓨터의 하드웨어와 소프트웨어의 다양한 지식을 얻게됨
                                </div>
                                <div className={"exp_body mb-3 font-light"}>
                                    <ul className="list-disc pl-5">
                                        <li>정보체계관리병으로 인트라넷 관리 및 정보 보안</li>
                                        <li>다양한 해킹 훈련을 통해 정보 보안 확립</li>
                                        <li>부대 인트라넷 페이지 디자인 수정(전체 수정)</li>
                                    </ul>
                                </div>
                                <div className={"exp_footer mb-3 mt-4 flex flex-wrap gap-2"}>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">CS</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">정보 보안</span>
                                </div>
                            </div>
                        </div>
                        <div className={"w-full flex mb-5 mt-5"}>
                            <div className={"w-1/4 flex justify-end mt-2"}>
                                <span>2022.10.05 ~ 2022.12.05</span>
                            </div>
                            <div className={"w-3/4 pl-10 flex flex-col"}>
                                <div className={"exp_title font-bold text-2xl mb-3"}>
                                    (주) 엘리스 (AI 웹 개발 강의)
                                </div>
                                <div className={"exp_sm_title mb-3 text-gray-500 italic"}>
                                    개발 강의를 진행하게 되며 많은걸 배우게 된 계기
                                </div>
                                <div className={"exp_body mb-3 font-light"}>
                                    <ul className="list-disc pl-5">
                                        <li>AI 웹개발 트랙 4개월 강의 진행</li>
                                        <li>웹 개발 트랙 3개월 강의 진행</li>
                                        <li>웹 프로젝트 1개월 멘토 진행</li>
                                        <li>기업은행 신입사원 멘토링 진행중</li>
                                        <li><a className={"text-blue-500 underline"} href={"#"}>관련 프로젝트 링크</a></li>
                                    </ul>
                                </div>
                                <div className={"exp_footer mb-3 mt-4 flex flex-wrap gap-2"}>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">React.js</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">Node.js</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">MongoDB</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">AI</span>
                                </div>
                            </div>
                        </div>
                        <div className={"w-full flex mb-5 mt-5"}>
                            <div className={"w-1/4 flex justify-end mt-2"}>
                                <span>2023.03 ~ 진행중</span>
                            </div>
                            <div className={"w-3/4 pl-10 flex flex-col"}>
                                <div className={"exp_title font-bold text-2xl mb-3"}>
                                    한국공학대학교(재학중)
                                </div>
                                <div className={"exp_sm_title mb-3 text-gray-500 italic"}>
                                    게임 개발을 시작하게 된 계기
                                </div>
                                <div className={"exp_body mb-3 font-light"}>
                                    <ul className="list-disc pl-5">
                                        <li>C 언어 기초를 배움</li>
                                        <li>C++의 기초를 배움</li>
                                        <li>Win32Api를 사용하여 2D 게임을 제작</li>
                                        <li><a className={"text-blue-500 underline"} href={"#"}>관련 프로젝트 링크</a></li>
                                    </ul>
                                </div>
                                <div className={"exp_footer mb-3 mt-4 flex flex-wrap gap-2"}>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">C언어</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">C++</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">Win32Api</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <div className={"part_section mt-5"}>
                        <div className={"text-4xl font-light mb-8"}>PROJECT</div>
                        <div className={"w-full flex mb-5 mt-5"}>
                            <div className={"w-1/4 flex justify-end mt-2"}>
                                <span>2020.05.05 ~ 2020.05.12</span>
                            </div>
                            <div className={"w-2/4 pl-10 flex flex-col"}>
                                <div className={"exp_title font-bold text-2xl mb-3"}>
                                    강의 평가 사이트
                                </div>
                                <div className={"exp_sm_title mb-3 text-gray-500 italic"}>
                                    강의를 등록하고 평가할 수 있는 기본적인 CLUD 사이트
                                </div>
                                <div className={"exp_body mb-3 font-light"}>
                                    <ul className="list-disc pl-5">
                                        <li>첫 웹 사이트 프로젝트</li>
                                        <li>jsp와 Spring을 사용한 SSR 사이트</li>
                                        <li><a className={"text-blue-500 underline"}
                                               href={"https://github.com/kevin0181/lecture_evaluation"}>https://github.com/kevin0181/lecture_evaluation</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className={"exp_footer mb-3 mt-4 flex flex-wrap gap-2"}>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">Java</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">Jsp</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">Spring</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">Mysql</span>
                                </div>
                            </div>
                            <div className={"w-1/4 pl-10 flex flex-col justify-center items-center"}>
                                <img alt={"강의평가"} src={`${process.env.PUBLIC_URL}/img/project/강의평가.png`}/>
                            </div>
                        </div>
                        <div className={"w-full flex mb-5 mt-5"}>
                            <div className={"w-1/4 flex justify-end mt-2"}>
                                <span>2020.05.25 ~ 2020.06.12</span>
                            </div>
                            <div className={"w-2/4 pl-10 flex flex-col"}>
                                <div className={"exp_title font-bold text-2xl mb-3"}>
                                    펫파인드
                                </div>
                                <div className={"exp_sm_title mb-3 text-gray-500 italic"}>
                                    공인 API를 사용하여 유기견 유기묘를 알려주는 사이트
                                </div>
                                <div className={"exp_body mb-3 font-light"}>
                                    <ul className="list-disc pl-5">
                                        <li>첫번째 협업 프로젝트</li>
                                        <li>공인 API를 사용하여 유기견, 유기묘 데이터를 가져옴</li>
                                        <li>메인 화면 디자인</li>
                                        <li>Thymeleaf와 Spring을 사용한 SSR 사이트</li>
                                        <li><a className={"text-blue-500 underline"}
                                               href={"https://github.com/kevin0181/dog_portfolio"}>https://github.com/kevin0181/dog_portfolio</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className={"exp_footer mb-3 mt-4 flex flex-wrap gap-2"}>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">Java</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">Thymeleaf</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">Spring</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">Mysql</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">API</span>
                                </div>
                            </div>
                            <div className={"w-1/4 pl-10 flex flex-col justify-center items-center"}>
                                <img alt={"펫파인드"} src={`${process.env.PUBLIC_URL}/img/project/펫파인드.png`}/>
                            </div>
                        </div>
                        <div className={"w-full flex mb-5 mt-5"}>
                            <div className={"w-1/4 flex justify-end mt-2"}>
                                <span>2020.06.21 ~ 2020.06.27</span>
                            </div>
                            <div className={"w-2/4 pl-10 flex flex-col"}>
                                <div className={"exp_title font-bold text-2xl mb-3"}>
                                    Dynamic-Beat<img
                                    src="https://img.shields.io/badge/game project-CCFF00?style=flat-square&logo=gamejolt&logoColor=white"/>
                                </div>
                                <div className={"exp_sm_title mb-3 text-gray-500 italic"}>
                                    Java의 GUI 프로그램을 사용한 비트 게임
                                </div>
                                <div className={"exp_body mb-3 font-light"}>
                                    <ul className="list-disc pl-5">
                                        <li>첫번째 게임 프로젝트</li>
                                        <li>Java를 사용하여 GUI 프로그래밍</li>
                                        <li>노래의 BPM에 맞춰 비트를 내려보내는 동작</li>
                                        <li><a className={"text-blue-500 underline"}
                                               href={"https://github.com/kevin0181/Dynamic-Beat"}>https://github.com/kevin0181/Dynamic-Beat</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className={"exp_footer mb-3 mt-4 flex flex-wrap gap-2"}>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">Java</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">GUI</span>
                                </div>
                            </div>
                            <div className={"w-1/4 pl-10 flex flex-col justify-center items-center"}>
                                <img alt={"다이나믹비트"} src={`${process.env.PUBLIC_URL}/img/project/다이나믹비트.png`}/>
                            </div>
                        </div>
                        <div className={"w-full flex mb-5 mt-5"}>
                            <div className={"w-1/4 flex justify-end mt-2"}>
                                <span>2020.06.21 ~ 2020.06.27</span>
                            </div>
                            <div className={"w-2/4 pl-10 flex flex-col"}>
                                <div className={"exp_title font-bold text-2xl mb-3"}>
                                    Celebirty_Match, LOL_Champ_Match
                                </div>
                                <div className={"exp_sm_title mb-3 text-gray-500 italic"}>
                                    나와 닮은 연예인을 알려주는 AI 웹
                                </div>
                                <div className={"exp_body mb-3 font-light"}>
                                    <ul className="list-disc pl-5">
                                        <li>AI를 사용한 웹 프로젝트</li>
                                        <li>구글에서 제공하는 AI을 사용</li>
                                        <li>AI에게 연예인, 롤 캐릭터 사진을 학습</li>
                                        <li>본인의 사진과 닮은 연예인, 롤 캐릭터의 일치율을 비교</li>
                                        <li><a className={"text-blue-500 underline"}
                                               href={"https://github.com/kevin0181/Celebirty_Match"}>https://github.com/kevin0181/Celebirty_Match</a>
                                        </li>
                                        <li><a className={"text-blue-500 underline"}
                                               href={"https://github.com/kevin0181/LOL_Champ_Match"}>https://github.com/kevin0181/LOL_Champ_Match</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className={"exp_footer mb-3 mt-4 flex flex-wrap gap-2"}>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">Javascript</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">AI</span>
                                </div>
                            </div>
                            <div className={"w-1/4 pl-10 flex flex-col justify-center items-center"}>
                                <img alt={"연예인"} src={`${process.env.PUBLIC_URL}/img/project/연예인닮은꼴.png`}/>
                            </div>
                        </div>
                        <div className={"w-full flex mb-5 mt-5"}>
                            <div className={"w-1/4 flex justify-end mt-2"}>
                                <span>2020.9.3 ~ 2020.10.12</span>
                            </div>
                            <div className={"w-2/4 pl-10 flex flex-col"}>
                                <div className={"exp_title font-bold text-2xl mb-3"}>
                                    넨이의 블로그
                                </div>
                                <div className={"exp_sm_title mb-3 text-gray-500 italic"}>
                                    CLUD 형태의 개인 블로그
                                </div>
                                <div className={"exp_body mb-3 font-light"}>
                                    <ul className="list-disc pl-5">
                                        <li>Spring Boot를</li>
                                        <li>회원가입 및 로그인</li>
                                        <li>이메일 인증</li>
                                        <li>CLUD 형태의 게시판</li>
                                        <li><a className={"text-blue-500 underline"}
                                               href={"https://github.com/kevin0181/nenBlog"}>https://github.com/kevin0181/nenBlog</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className={"exp_footer mb-3 mt-4 flex flex-wrap gap-2"}>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">Spring</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">Javascript</span>
                                </div>
                            </div>
                            <div className={"w-1/4 pl-10 flex flex-col justify-center items-center"}>
                                <img alt={"블로그"} src={`${process.env.PUBLIC_URL}/img/project/블로그.png`}/>
                            </div>
                        </div>
                        <div className={"w-full flex mb-5 mt-5"}>
                            <div className={"w-1/4 flex justify-end mt-2"}>
                                <span>2021.12.3 ~ 2022.9.9</span>
                            </div>
                            <div className={"w-2/4 pl-10 flex flex-col"}>
                                <div className={"exp_title font-bold text-2xl mb-3"}>
                                    소소한 부엌
                                </div>
                                <div className={"exp_sm_title mb-3 text-gray-500 italic"}>
                                    WebSocket을 사용한 실시간 주문 페이지
                                </div>
                                <div className={"exp_body mb-3 font-light"}>
                                    <ul className="list-disc pl-5">
                                        <li>실시간 주문 연동</li>
                                        <li>관리자 페이지</li>
                                        <li>가게를 대표하는 페이지</li>
                                        <li>블로그 형태 시스템</li>
                                        <li>실제 웹 배포</li>
                                        <li><a className={"text-blue-500 underline"}
                                               href={"https://github.com/kevin0181/sosoProject"}>https://github.com/kevin0181/sosoProject</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className={"exp_footer mb-3 mt-4 flex flex-wrap gap-2"}>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">Spring</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">Javascript</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">WebSocket</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">NaverCloud</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">Linux</span>
                                </div>
                            </div>
                            <div className={"w-1/4 pl-10 flex flex-col justify-center items-center"}>
                                <img alt={"소소한부엌"} src={`${process.env.PUBLIC_URL}/img/project/soso.png`}/>
                            </div>
                        </div>
                        <div className={"w-full flex mb-5 mt-5"}>
                            <div className={"w-1/4 flex justify-end mt-2"}>
                                <span>2023.1.25 ~ 2023.4.4</span>
                            </div>
                            <div className={"w-2/4 pl-10 flex flex-col"}>
                                <div className={"exp_title font-bold text-2xl mb-3"}>
                                    소소한 부엌 키오스크 버전
                                </div>
                                <div className={"exp_sm_title mb-3 text-gray-500 italic"}>
                                    소소한 부엌의 디비와 연동하여 키오스크 개발
                                </div>
                                <div className={"exp_body mb-3 font-light"}>
                                    <ul className="list-disc pl-5">
                                        <li>실시간 주문 연동</li>
                                        <li>키오스크 페이지</li>
                                        <li>시스템 구축</li>
                                        <li><a className={"text-blue-500 underline"}
                                               href={"https://github.com/kevin0181/sosoKioskElectron"}>https://github.com/kevin0181/sosoKioskElectron</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className={"exp_footer mb-3 mt-4 flex flex-wrap gap-2"}>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">Spring Boot</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">React.js</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">Electron.js</span>
                                </div>
                            </div>
                            <div className={"w-1/4 pl-10 flex flex-col justify-center items-center"}>
                                <img alt={"soso kiosk"} src={`${process.env.PUBLIC_URL}/img/project/키오스크.png`}/>
                            </div>
                        </div>
                        <div className={"w-full flex mb-5 mt-5"}>
                            <div className={"w-1/4 flex justify-end mt-2"}>
                                <span>2024.5.10 ~ 2024.5.19</span>
                            </div>
                            <div className={"w-2/4 pl-10 flex flex-col"}>
                                <div className={"exp_title font-bold text-2xl mb-3"}>
                                    INVERSUS
                                    <img
                                        src="https://img.shields.io/badge/game project-CCFF00?style=flat-square&logo=gamejolt&logoColor=white"/>
                                </div>
                                <div className={"exp_sm_title mb-3 text-gray-500 italic"}>
                                    키보드를 사용한 2D 슈팅 게임
                                </div>
                                <div className={"exp_body mb-3 font-light"}>
                                    <ul className="list-disc pl-5">
                                        <li>Win32Api를 사용한 2D 게임</li>
                                        <li><a className={"text-blue-500 underline"}
                                               href={"https://github.com/kevin0181/INVERSUS"}>https://github.com/kevin0181/INVERSUS</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className={"exp_footer mb-3 mt-4 flex flex-wrap gap-2"}>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">C++</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">Win32Api</span>
                                </div>
                            </div>
                            <div className={"w-1/4 pl-10 flex flex-col justify-center items-center"}>
                                <img alt={"인버서스"} src={`${process.env.PUBLIC_URL}/img/project/인버서스.png`}/>
                            </div>
                        </div>
                        <div className={"w-full flex mb-5 mt-5"}>
                            <div className={"w-1/4 flex justify-end mt-2"}>
                                <span>2024.5.1 ~ 2024.6.16</span>
                            </div>
                            <div className={"w-2/4 pl-10 flex flex-col"}>
                                <div className={"exp_title font-bold text-2xl mb-3"}>
                                    Escape-Chronicles<img
                                    src="https://img.shields.io/badge/game project-CCFF00?style=flat-square&logo=gamejolt&logoColor=white"/>
                                </div>
                                <div className={"exp_sm_title mb-3 text-gray-500 italic"}>
                                    횡 스크롤 2D 액션 게임
                                </div>
                                <div className={"exp_body mb-3 font-light"}>
                                    <ul className="list-disc pl-5">
                                        <li>Win32Api를 사용한 2D 게임</li>
                                        <li>애니메이션을 추가</li>
                                        <li>게임 기획</li>
                                        <li><a className={"text-blue-500 underline"}
                                               href={"https://github.com/kevin0181/Escape-Chronicles"}>https://github.com/kevin0181/Escape-Chronicles</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className={"exp_footer mb-3 mt-4 flex flex-wrap gap-2"}>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">C++</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">Win32Api</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">횡 스크롤</span>
                                </div>
                            </div>
                            <div className={"w-1/4 pl-10 flex flex-col justify-center items-center"}>
                                <img alt={"크로니클"} src={`${process.env.PUBLIC_URL}/img/project/escape크로니클.png`}/>
                            </div>
                        </div>
                        <div className={"w-full flex mb-5 mt-5"}>
                            <div className={"w-1/4 flex justify-end mt-2"}>
                                <span>2024.11.15 ~ 2024.11.19</span>
                            </div>
                            <div className={"w-2/4 pl-10 flex flex-col"}>
                                <div className={"exp_title font-bold text-2xl mb-3"}>
                                    Obj-viewer (opengl)
                                </div>
                                <div className={"exp_sm_title mb-3 text-gray-500 italic"}>
                                    obj 파일을 불러와 3D로 보여주는 프로그램
                                </div>
                                <div className={"exp_body mb-3 font-light"}>
                                    <ul className="list-disc pl-5">
                                        <li>OpenGl을 사용한 뷰어</li>
                                        <li>모델과 텍스쳐 입혀서 불러오기</li>
                                        <li><a className={"text-blue-500 underline"}
                                               href={"https://github.com/neneee0181/obj-viewer"}>https://github.com/neneee0181/obj-viewer</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className={"exp_footer mb-3 mt-4 flex flex-wrap gap-2"}>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">C++</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">OpenGl</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">3D</span>
                                </div>
                            </div>
                            <div className={"w-1/4 pl-10 flex flex-col justify-center items-center"}>
                                <img alt={"obj뷰어"} src={`${process.env.PUBLIC_URL}/img/project/objview.png`}/>
                            </div>
                        </div>
                        <div className={"w-full flex mb-5 mt-5"}>
                            <div className={"w-1/4 flex justify-end mt-2"}>
                                <span>2024.11.20 ~ 2024.12.15</span>
                            </div>
                            <div className={"w-2/4 pl-10 flex flex-col"}>
                                <div className={"exp_title font-bold text-2xl mb-3"}>
                                    KarKartRider <img
                                    src="https://img.shields.io/badge/game project-CCFF00?style=flat-square&logo=gamejolt&logoColor=white"/>
                                </div>
                                <div className={"exp_sm_title mb-3 text-gray-500 italic"}>
                                    OpenGl 3D 레이싱 게임 (카트라이더 모작)
                                </div>
                                <div className={"exp_body mb-3 font-light"}>
                                    <ul className="list-disc pl-5">
                                        <li>OpenGl을 사용한 3D 게임</li>
                                        <li>물리 구현</li>
                                        <li>첫 3D 게임 개발</li>
                                        <li><a className={"text-blue-500 underline"}
                                               href={"https://github.com/neneee0181/KartRider"}>https://github.com/neneee0181/KartRider</a>
                                        </li>
                                        <li><a className={"text-blue-500 underline"}
                                               href={"https://youtu.be/FTfmZc3j5fU?si=Knz2sXl-UROgJgys"}>플레이 영상
                                            (유튜브)</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className={"exp_footer mb-3 mt-4 flex flex-wrap gap-2"}>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">C++</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">OpenGl</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">3D</span>
                                </div>
                            </div>
                            <div className={"w-1/4 pl-10 flex flex-col justify-center items-center"}>
                                <img alt={"카카트라이더"} src={`${process.env.PUBLIC_URL}/img/project/kartrider.png`}/>
                            </div>
                        </div>
                        <div className={"w-full flex mb-5 mt-5"}>
                            <div className={"w-1/4 flex justify-end mt-2"}>
                                <span>2022.7.11 ~ 진행중</span>
                            </div>
                            <div className={"w-2/4 pl-10 flex flex-col"}>
                                <div className={"exp_title font-bold text-2xl mb-3"}>
                                    OF-F
                                </div>
                                <div className={"exp_sm_title mb-3 text-gray-500 italic"}>
                                    QR 코드를 사용한 실시간 주문 웹
                                </div>
                                <div className={"exp_body mb-3 font-light"}>
                                    <ul className="list-disc pl-5">
                                        <li>다양한 가맹점 연결</li>
                                        <li>해당 가맹점의 메뉴 주문</li>
                                        <li>실시간 주문 전송</li>
                                        <li><a className={"text-blue-500 underline"}
                                               href={"https://github.com/kevin0181/OF-f"}>https://github.com/kevin0181/OF-f</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className={"exp_footer mb-3 mt-4 flex flex-wrap gap-2"}>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">Spring Boot</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">React.js</span>
                                    <span className="bg-gray-400 text-white py-0.5 px-2 rounded-lg">WebSocket</span>
                                </div>
                            </div>
                            <div className={"w-1/4 pl-10 flex flex-col justify-center items-center"}>
                                <img alt={"off"} src={`${process.env.PUBLIC_URL}/img/project/OF.png`}/>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <div className={"part_section mt-5"}>
                        <div className={"text-4xl font-light mb-8"}>ETC</div>
                        <div className={"w-full flex mb-5 mt-5"}>
                            <div className={"w-1/4 flex justify-end mt-2"}>
                                <span>2020.05.05 ~ 2020.05.12</span>
                            </div>
                            <div className={"w-2/4 pl-10 flex flex-col"}>
                                <div className={"exp_title font-bold text-2xl mb-3"}>
                                    Stanty
                                </div>
                                <div className={"exp_sm_title mb-3 text-gray-500 italic"}>
                                    Iot 스마트 안전벨트
                                </div>
                                <div className={"exp_body mb-3 font-light"}>
                                    <ul className="list-disc pl-5">
                                        <li>공군 해커톤</li>
                                        <li>사업 계획서</li>
                                    </ul>
                                </div>
                                <div className={"exp_footer mb-3 mt-4 flex flex-wrap gap-2"}>
                                </div>
                            </div>
                            <div className={"w-1/4 pl-10 flex flex-col justify-center items-center"}>
                                <img alt={"stanty"} src={`${process.env.PUBLIC_URL}/img/project/stanty.png`}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-lg font-bold font-medium">2024 넥슨컴퍼니 채용형 인턴십 - [네오플]신입_전체 모집분야 공통</h2>
                <hr/>
                <p className={"mt-4"} style={{fontSize: "18px"}}>전체적인 자기소개</p>
                <hr/>
                <p className={"font-normal"}
                   style={{fontSize: "15px"}}>
                    어릴 때부터 웹 개발에 관심이 많아 특성화 고등학교에 진학했습니다. 키오스크나 실시간 통신 웹 프로젝트를 개발하며 해커톤에도 참여했고, 이를 통해 개발의 매력을
                    느끼게 되었습니다.
                    <br/>
                    그러나 입대 후, 단순히 개발이 재미있다는 것만으로는 부족하다는 생각이 들었습니다. 내가 정말 만들고 싶은 것은 무엇일까? 어떤 분야에서 개발자로 성장하고 싶은가? 스스로에게
                    질문을 던졌고, 결국 게임 개발이라는 답을 찾게 되었습니다.
                    <br/>
                    사실 게임을 좋아하고, 다양한 게임을 플레이하면서 게임을 만들어 보고 싶다는 생각은 오래전부터 해왔습니다. 하지만 막상 게임을 개발하려고 하니 어떤 지식이 필요한지조차
                    몰랐습니다. 그래서 본격적으로 게임 개발을 배우기 위해 한국공학대학교 게임공학과에 진학했습니다.
                    <br/>
                    게임 개발이 쉽지만은 않았지만, 직접 게임을 만들며 새로운 것을 배워가는 과정에서 즐거움을 느꼈습니다. 프로그래밍뿐만 아니라 게임 기획, 그래픽, 수학적 개념 등 다양한 지식을
                    익히며 개발자로서 성장하고 있습니다.
                    <br/>
                </p>
                <hr/>
                <p className={"mt-4"} style={{fontSize: "18px"}}>당사 입사지원하신 이유와 함께 지원하신 분야를 희망하는 이유, 그리고 면접관이 꼭
                    알아주었으면 하는 점을 적어주세요.</p>
                <hr/>
                <p className={"font-normal"}
                   style={{fontSize: "15px"}}>
                </p>
                어릴 때부터 다양한 게임을 접하며 ‘나만의 게임을 만들고 싶다’는 꿈을 키워왔고, 이를 실현하기 위해 게임 개발을 본격적으로 공부해왔습니다. 특히 네오플의 작품들은 저에게 큰 영감을
                주었고, 도전적인 시도와 독창적인 콘텐츠로 많은 유저들에게 사랑받고 있다는 점에서 깊은 인상을 받았습니다. 네오플의 개발 철학과 유저 중심의 게임 디자인이 제가 추구하는 방향과 맞아,
                이번 인턴십에 지원하게 되었습니다.
                <br/>
                제가 지원한 클라이언트 개발자는 단순한 기술적 구현을 넘어, 플레이어에게 재미와 감동을 주는 게임을 만드는 과정에서 핵심적인 역할을 한다고 생각합니다. 저는 특성화고등학교 시절부터 다양한
                웹
                프로젝트를 개발하며 실시간 통신 기술을 활용한 경험이 있고, 대학에서는 직접 게임을 개발하며 기획부터 구현까지 전반적인 과정을 익혔습니다. 이를 통해 문제 해결 능력과 개발자로서의 실무
                역량을 키워왔으며, 이러한 경험을 바탕으로 네오플에서 의미 있는 도전을 해보고 싶습니다.
                <br/>
                특히 저는 새로운 기술을 배우고 적용하는 데 적극적이며, 협업을 통해 더 나은 결과물을 만드는 과정에 큰 보람을 느낍니다. 프로젝트를 진행하면서 항상 팀원들과 원활한 커뮤니케이션을
                유지하며 개발을 진행해 왔으며, 문제 상황에서는 빠르게 대안을 모색하는 태도를 가져왔습니다. 이번 인턴십을 통해 네오플의 개발 문화 속에서 더욱 성장하고, 팀에 기여할 수 있는 인재로
                거듭나고 싶습니다.
                <hr/>
                <p className={"mt-4"} style={{fontSize: "18px"}}>네오플의 인재상은 팀웍, 똑똑함, 열정입니다. 인재상과 관련된 일화가 있으면
                    말씀해 주세요.</p>
                <hr/>
                <p className={"font-normal"}
                   style={{fontSize: "15px"}}>
                    저는 팀워크를 가장 중요한 가치 중 하나로 생각하며, 협업을 통해 더 나은 결과를 만들어낸 경험이 많습니다. 특성화고 시절, 해커톤에 참가해 실시간 웹 기반 채팅
                    애플리케이션을 개발한 적이 있습니다. 팀원들과의 원활한 협업이 중요한 프로젝트였고, 저는 백엔드 개발을 맡아 실시간 데이터 처리 및 서버 구축을 담당했습니다. 프로젝트 중 예상치
                    못한 서버 부하 문제를 겪었지만, 팀원들과 긴밀히 소통하며 해결 방안을 모색했고, 결국 웹소켓 기술을 활용해 서버 부하를 줄이고 안정성을 확보하는 방향으로 개선할 수 있었습니다.
                    이 경험을 통해 협업의 중요성을 다시 한번 깨달았으며, 개발자로서 팀과 함께 성장하는 것의 가치를 배웠습니다.
                    <br/>
                    또한, 저는 똑똑함을 단순한 지식이 아니라, 문제를 효율적으로 해결하는 능력이라고 생각합니다. 대학에서 팀 프로젝트로 간단한 2D 로그라이크 게임을 개발할 때, 팀원들이
                    처음 다루는 엔진(Unity)에 익숙하지 않아 개발 속도가 더뎠습니다. 저는 팀의 개발 속도를 높이기 위해 핵심 기능별로 작은 프로토타입을 만들어 공유했고, 이를 참고하여 팀원들이
                    빠르게 구현할 수 있도록 도왔습니다. 그 결과, 짧은 기간 안에 게임을 완성할 수 있었고, 팀원들에게도 실질적인 도움이 되었다는 점에서 보람을 느꼈습니다.
                    <br/>
                    마지막으로, 저는 개발에 대한 열정을 가지고 꾸준히 새로운 기술을 배우고 있습니다. 게임 개발이 단순히 코드만 짜는 것이 아니라, 기획과 UX/UI 등 다양한 요소가
                    결합된 종합 예술이라는 점에서 큰 매력을 느끼며, 이를 더 깊이 이해하기 위해 방학 기간에도 개인 프로젝트를 진행하며 학습해왔습니다.
                    <br/>
                    이러한 경험들을 바탕으로, 네오플의 개발 문화 속에서 협업하며 성장하는 개발자가 되고 싶습니다.
                </p>
                <hr/>
                <p className={"mt-4"} style={{fontSize: "18px"}}>경력자에 한하여, 이직 회사별로 전 직장 퇴사사유를 보기 중 선택하고 부연 설명
                    해 주세요. (1. 회사의 불투명한 미래 / 2. 연봉조건 / 3. 경영 불만 / 4. 동료 및 상사와의 불화 / 5. 기타 / 6. 신입(해당 없음))</p>
                <hr/>
                <p className={"font-normal"}
                   style={{fontSize: "15px"}}>
                    6. 신입(해당 없음)
                </p>
            </Modal>
        </>
    )
}

export default Resume;