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

let Resume = () => {
    return (
        <div className={"resume_container flex justify-center"}>
            <div className={"flex flex-col font-noto"}>
                <div className={"part_section mt-5 mb-5 flex flex-wrap justify-center "}>
                    <div className={"sm:w-1/3 max-w-72 min-w-52 w-full flex justify-center"}>
                        <img alt={"얼굴 이미지"} src={`${process.env.PUBLIC_URL}/img/face.png`}/>
                    </div>
                    <div className={"part_section_list sm:w-2/3 w-full flex flex-col p-3"}>
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
                            <span>82+ 10-8650-9053</span>
                        </div>
                        <div className={"resume_github flex"}>
                            <FontAwesomeIcon icon={faGithub} className="h-6 text-gray-800 w-auto mr-3"/>
                            <span>
                                <a className={"text-blue-700 underline"} href={"https://github.com/kevin0181"}
                                   target={"_blank"}>https://github.com/kevin0181</a>
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
                            <BookmarkIcon className="h-6 text-gray-800 w-auto mr-3"/>
                            <span>
                                <a className={"text-blue-700 underline"} href={"/portfolio-site/"}
                                   target={"_blank"}>포트폴리오 사이트</a>
                            </span>
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
                            <img alt={"얼굴 이미지"} src={`${process.env.PUBLIC_URL}/img/face.png`}/>
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
                            <img alt={"얼굴 이미지"} src={`${process.env.PUBLIC_URL}/img/face.png`}/>
                        </div>
                    </div>
                    <div className={"w-full flex mb-5 mt-5"}>
                        <div className={"w-1/4 flex justify-end mt-2"}>
                            <span>2020.06.21 ~ 2020.06.27</span>
                        </div>
                        <div className={"w-2/4 pl-10 flex flex-col"}>
                            <div className={"exp_title font-bold text-2xl mb-3"}>
                                Dynamic-Beat
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
                            <img alt={"얼굴 이미지"} src={`${process.env.PUBLIC_URL}/img/face.png`}/>
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
                            <img alt={"얼굴 이미지"} src={`${process.env.PUBLIC_URL}/img/face.png`}/>
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
                            <img alt={"얼굴 이미지"} src={`${process.env.PUBLIC_URL}/img/face.png`}/>
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
                            <img alt={"얼굴 이미지"} src={`${process.env.PUBLIC_URL}/img/face.png`}/>
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
                            <img alt={"얼굴 이미지"} src={`${process.env.PUBLIC_URL}/img/face.png`}/>
                        </div>
                    </div>
                    <div className={"w-full flex mb-5 mt-5"}>
                        <div className={"w-1/4 flex justify-end mt-2"}>
                            <span>2024.5.10 ~ 2024.5.19</span>
                        </div>
                        <div className={"w-2/4 pl-10 flex flex-col"}>
                            <div className={"exp_title font-bold text-2xl mb-3"}>
                                INVERSUS
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
                            <img alt={"얼굴 이미지"} src={`${process.env.PUBLIC_URL}/img/face.png`}/>
                        </div>
                    </div>
                    <div className={"w-full flex mb-5 mt-5"}>
                        <div className={"w-1/4 flex justify-end mt-2"}>
                            <span>2024.5.1 ~ 2024.6.16</span>
                        </div>
                        <div className={"w-2/4 pl-10 flex flex-col"}>
                            <div className={"exp_title font-bold text-2xl mb-3"}>
                                Escape-Chronicles
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
                            <img alt={"얼굴 이미지"} src={`${process.env.PUBLIC_URL}/img/face.png`}/>
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
                            <img alt={"얼굴 이미지"} src={`${process.env.PUBLIC_URL}/img/face.png`}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Resume;