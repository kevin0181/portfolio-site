import "./../css/resume.css";
import {MailIcon} from '@heroicons/react/solid';
import {PhoneIcon} from '@heroicons/react/solid';
import {BookmarkIcon} from '@heroicons/react/solid';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import {SiTistory} from 'react-icons/si'; // Simple Icons에서 Tistory 아이콘 import

let Resume = () => {
    return (
        <div className={"resume_container flex justify-center"}>
            <div className={"flex flex-col font-noto"}>
                <div className={"part_section mt-5 flex flex-wrap justify-center "}>
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
                                   target={"_blank"}>https://code-nen.tistory.com/</a>
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
                <div className={"part_section mt-5"}>

                </div>
            </div>
        </div>
    )
}

export default Resume;