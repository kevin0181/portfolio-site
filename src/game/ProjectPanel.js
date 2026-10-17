import { FiArrowUpRight, FiMail } from "react-icons/fi";
import Modal from "../resume/Modal";
import { projects, skillGroups, experiences } from "../resume/resumeData";

const stations = [
    { id: "readapt", projectId: "readapt", label: "Unreal Engine · TPS" },
    { id: "karkartrider", projectId: "karkartrider", label: "C++ · OpenGL" },
    { id: "inversus", projectId: "inversus", label: "C++ · Win32 API" },
    { id: "workshop", projectId: "devil-codex", label: "AI 개발 도구" },
];

const profileExperiences = ["tech-university", "elice", "ncs-java"]
    .map((id) => experiences.find((experience) => experience.id === id))
    .filter(Boolean);

const gameSkills = skillGroups.find((group) => group.label === "Game Development")?.items || [];
const languageSkills = skillGroups.find((group) => group.label === "Languages")?.items || [];

function ProjectLinks({ links }) {
    return (
        <div className="panel-links">
            {links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                    <FiArrowUpRight aria-hidden="true" />
                </a>
            ))}
        </div>
    );
}

function PanelFooter({ onClose }) {
    return (
        <div className="panel-project-nav">
            <button type="button" onClick={onClose}>서킷으로 돌아가기</button>
        </div>
    );
}

function ProjectPanel({ selected, onClose }) {
    const station = stations.find((item) => item.id === selected);
    const project = station ? projects.find((item) => item.id === station.projectId) : null;
    const isProfile = selected === "profile";
    const isOpen = isProfile || Boolean(project);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isProfile ? "유영빈 · 프로필" : project?.title}>
            {isProfile ? (
                <article className="game-panel game-panel--profile">
                    <div className="panel-eyebrow">
                        <span>게임 클라이언트 개발자</span>
                    </div>
                    <div className="panel-profile-heading">
                        <div className="panel-profile-avatar" aria-hidden="true">YB</div>
                        <div>
                            <p className="panel-profile-name">유영빈 <span>YOUNG BIN YOU</span></p>
                            <p className="panel-profile-role">게임 클라이언트 개발자</p>
                        </div>
                    </div>
                    <p className="panel-summary">
                        C++와 Unreal Engine을 중심으로 게임 클라이언트를 개발합니다. 2D 게임부터 OpenGL 3D 그래픽스,
                        멀티플레이 졸업작품까지 직접 구현하며 경험을 넓혀 왔습니다.
                    </p>
                    <div className="panel-tags" aria-label="주요 기술">
                        <span>C++</span>
                        <span>Unreal Engine 5</span>
                        <span>OpenGL</span>
                    </div>
                    <div className="panel-details">
                        <h3>개발 경험</h3>
                        <ul>
                            <li>Unreal Engine 5 기반 멀티플레이어 전투와 포탈·보스·증강 시스템 구현</li>
                            <li>OpenGL 3D 레이싱 게임의 물리 구현과 OBJ 모델·텍스처 뷰어 제작</li>
                            <li>Win32 API 기반 2D 슈팅 게임과 횡 스크롤 액션 게임 개발</li>
                        </ul>
                    </div>
                    <dl className="panel-meta panel-profile-skills">
                        <div>
                            <dt>개발 언어</dt>
                            <dd>{languageSkills.filter((skill) => skill === "C++").join(" · ")}</dd>
                        </div>
                        <div>
                            <dt>게임 개발</dt>
                            <dd>{gameSkills.join(" · ")}</dd>
                        </div>
                    </dl>
                    <div className="panel-experiences">
                        <h3>배움과 경험</h3>
                        {profileExperiences.map((experience) => (
                            <div className="panel-experience" key={experience.id}>
                                <time>{experience.period}</time>
                                <div>
                                    <h4>{experience.title}</h4>
                                    <p>{experience.subtitle}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="panel-links">
                        <a href="mailto:kevin018111@gmail.com"><FiMail aria-hidden="true" /> 이메일 <FiArrowUpRight aria-hidden="true" /></a>
                        <a href="https://github.com/neneee0181" target="_blank" rel="noopener noreferrer">GitHub <FiArrowUpRight aria-hidden="true" /></a>
                        <a href="https://code-nen.tistory.com/" target="_blank" rel="noopener noreferrer">개발 블로그 <FiArrowUpRight aria-hidden="true" /></a>
                    </div>
                    <PanelFooter onClose={onClose} />
                </article>
            ) : project && (
                <article className="game-panel game-panel--project">
                    <div className="panel-eyebrow">
                        <span>{station.label}</span>
                        <span>PIT {String(stations.indexOf(station) + 1).padStart(2, "0")}</span>
                    </div>
                    <figure className="panel-screenshot">
                        <img src={`${process.env.PUBLIC_URL}/img/project/${project.image}`} alt={`${project.title} 프로젝트 화면`} />
                        <figcaption>{project.title}</figcaption>
                    </figure>
                    <dl className="panel-meta">
                        <div><dt>개발 기간</dt><dd>{project.period}</dd></div>
                    </dl>
                    <p className="panel-summary">{project.subtitle}</p>
                    <div className="panel-details">
                        <h3>구현 내용</h3>
                        <ul>{project.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
                    </div>
                    <div className="panel-tags" aria-label="사용 기술">
                        {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                    <ProjectLinks links={project.links} />
                    <PanelFooter onClose={onClose} />
                </article>
            )}
        </Modal>
    );
}

export default ProjectPanel;
