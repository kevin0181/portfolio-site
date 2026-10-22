import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpIcon, DocumentTextIcon, MailIcon, PrinterIcon } from "@heroicons/react/outline";
import { FiArrowUpRight as ArrowUpRightIcon } from "react-icons/fi";
import { SiGithub } from "react-icons/si";
import Modal from "./Modal";
import { achievements, activities, experiences, introParagraphs, projects, skillGroups } from "./resumeData";
import "../css/resume.css";

const sections = [
    { id: "about", title: "소개", english: "ABOUT" },
    { id: "projects", title: "프로젝트", english: "PROJECTS" },
    { id: "skills", title: "기술", english: "SKILLS" },
    { id: "experience", title: "경력 · 교육", english: "EXPERIENCE" },
    { id: "achievements", title: "수상·논문·자격", english: "ACHIEVEMENTS" },
    { id: "activities", title: "기타 활동", english: "ACTIVITIES" },
];
const filters = [{ id: "all", label: "전체" }, { id: "game", label: "게임 · 그래픽스" }, { id: "ai", label: "AI · 개발 도구" }, { id: "web", label: "웹 서비스" }];
const categoryLabels = { game: "GAME", graphics: "GRAPHICS", ai: "AI / TOOLS", web: "WEB" };
const projectOrder = ["readapt", "karkartrider", "inversus", "agent-chat", "escape-chronicles", "obj-viewer", "dynamic-beat", "devil-codex", "of-f", "soso-kiosk", "soso-kitchen", "nen-blog", "celebrity-match", "pet-find", "lecture-evaluation"];
const orderedProjects = [
    ...projectOrder.map((id) => projects.find((project) => project.id === id)).filter(Boolean),
    ...projects.filter((project) => !projectOrder.includes(project.id)),
];
const skillOrder = [6, 0, 8, 7, 1, 4, 5, 3, 2];
const skillLabels = { "Game Development": "게임 개발", Languages: "프로그래밍 언어", "Frameworks · Libraries · APIs": "프레임워크 · API", "AI Learning": "AI 학습·추론", "AI Agents": "AI 도구", "Version Control": "버전 관리", Tools: "개발 도구", Databases: "데이터베이스", "Infrastructure & Servers": "인프라 · 서버" };
const asset = (path) => `${process.env.PUBLIC_URL}/img/${path}`;
const matchesFilter = (project, filter) => filter === "all" || project.category === filter || (filter === "game" && project.category === "graphics");

function ExternalLink({ href, children, className = "text-link" }) {
    return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRightIcon aria-hidden="true" /></a>;
}
function SectionHeading({ id }) {
    const index = sections.findIndex((section) => section.id === id);
    return <div className="section-heading"><div><span className="section-number">0{index + 1}</span><h2 id={`${id}-heading`}>{sections[index].title}</h2></div><span className="section-english" lang="en">{sections[index].english}</span></div>;
}
function Tags({ items = [] }) {
    if (!items.length) return null;
    return <ul className="tags" aria-label="사용 기술">{items.map((tag) => <li key={tag}>{tag}</li>)}</ul>;
}
function Project({ project, onPreview }) {
    return <article className={`project-row${project.id === "readapt" ? " project-featured" : ""}${!project.image ? " project-without-image" : ""}`}>
        <div className="project-content">
            <div className="project-meta"><span className={`project-category category-${project.category}`}>{categoryLabels[project.category]}</span><span>{project.period}</span></div>
            <h3>{project.title}{project.id === "readapt" && <span className="featured-label">졸업작품</span>}</h3>
            <p className="project-subtitle">{project.subtitle}</p>
            <ul className="resume-bullets">{project.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
            <Tags items={project.tags} />
            <div className="project-links">{project.links.map((link) => <ExternalLink key={link.href} href={link.href}>{link.label}</ExternalLink>)}</div>
        </div>
        {project.image && <button className="project-image-button" type="button" onClick={() => onPreview(project)} aria-label={`${project.title} 이미지 확대`}>
            <img src={asset(`project/${project.image}`)} alt={`${project.title} 프로젝트 화면`} loading="lazy" />
            <span>화면 보기<ArrowUpRightIcon aria-hidden="true" /></span>
        </button>}
    </article>;
}

export default function Resume() {
    const [activeSection, setActiveSection] = useState("about");
    const [filter, setFilter] = useState("all");
    const [preview, setPreview] = useState(null);
    const navigationRef = useRef(null);
    const closePreview = useCallback(() => setPreview(null), []);
    const visibleProjects = orderedProjects.filter((project) => matchesFilter(project, filter));
    useEffect(() => {
        let frame;
        const updateSection = () => {
            frame = undefined;
            const firstSection = document.getElementById(sections[0].id);
            const anchorOffset = parseFloat(window.getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
            const sectionOffset = firstSection ? parseFloat(window.getComputedStyle(firstSection).scrollMarginTop) || 0 : 0;
            const readingLine = Math.max(100, anchorOffset + sectionOffset + 8);
            let current = sections[0].id;
            sections.forEach(({ id }) => {
                if (document.getElementById(id)?.getBoundingClientRect().top <= readingLine) current = id;
            });
            if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) current = sections[sections.length - 1].id;
            setActiveSection(current);
        };
        const scheduleUpdate = () => {
            if (frame === undefined) frame = window.requestAnimationFrame(updateSection);
        };
        scheduleUpdate();
        window.addEventListener("scroll", scheduleUpdate, { passive: true });
        window.addEventListener("resize", scheduleUpdate);
        return () => {
            window.cancelAnimationFrame(frame);
            window.removeEventListener("scroll", scheduleUpdate);
            window.removeEventListener("resize", scheduleUpdate);
        };
    }, [filter]);
    useEffect(() => {
        const revealActiveLink = () => {
            const navigation = navigationRef.current;
            const link = navigation?.querySelector('[aria-current="location"]');
            if (!navigation || !link || navigation.scrollWidth <= navigation.clientWidth) return;
            const bounds = navigation.getBoundingClientRect();
            const item = link.getBoundingClientRect();
            if (item.left < bounds.left + 18) navigation.scrollLeft += item.left - bounds.left - 18;
            else if (item.right > bounds.right - 18) navigation.scrollLeft += item.right - bounds.right + 18;
        };
        revealActiveLink();
        window.addEventListener("resize", revealActiveLink);
        return () => window.removeEventListener("resize", revealActiveLink);
    }, [activeSection]);
    return <div className="resume-site" id="top">
        <a className="skip-link" href="#about">본문으로 이동</a>
        <header className="site-bar">
            <a className="wordmark" href="#top" aria-label="유영빈 이력서 처음으로"><span>YB<span className="wordmark-dot">.</span></span><span className="wordmark-label">RESUME & PORTFOLIO</span></a>
            <div className="site-actions"><a className="contact-action" href="mailto:kevin018111@gmail.com"><MailIcon aria-hidden="true" /><span>연락하기</span></a><button className="print-action" type="button" onClick={() => window.print()}><PrinterIcon aria-hidden="true" />PDF로 저장</button></div>
        </header>
        <div className="resume-layout">
            <aside className="resume-sidebar">
                <div className="sidebar-identity"><span>유영빈</span><span>게임 클라이언트 개발자</span></div>
                <nav ref={navigationRef} aria-label="이력서 목차">{sections.map((section, index) => <a key={section.id} href={`#${section.id}`} className={activeSection === section.id ? "is-active" : ""} aria-current={activeSection === section.id ? "location" : undefined}><span className="nav-number">0{index + 1}</span>{section.title}<span className="nav-indicator" /></a>)}</nav>
                <a className="sidebar-github" href="https://github.com/neneee0181" target="_blank" rel="noopener noreferrer"><SiGithub aria-hidden="true" />GitHub<ArrowUpRightIcon aria-hidden="true" /></a>
                <p className="sidebar-note">C++ · Unreal Engine<br />게임을 만드는 개발자</p>
            </aside>
            <main className="resume-paper">
                <header className="profile-header">
                    <div className="profile-main"><div className="profile-identity">
                        <p className="document-eyebrow"><span />GAME CLIENT DEVELOPER</p>
                        <h1>유영빈<span lang="en">You Young Bin</span></h1>
                        <p className="profile-role">게임 클라이언트 개발자</p>
                        <p className="profile-stack">C++<span>/</span>Unreal Engine 5<span>/</span>OpenGL</p>
                    </div><img className="profile-photo" src={asset("m.jpg")} alt="유영빈 프로필 사진" width="112" height="144" /></div>
                    <dl className="profile-contacts">
                        <div><dt>EMAIL</dt><dd><a href="mailto:kevin018111@gmail.com">kevin018111@gmail.com</a></dd></div>
                        <div><dt>PHONE</dt><dd><a href="tel:+821086509052">+82 10-8650-9052</a></dd></div>
                        <div><dt>GITHUB · GAME</dt><dd><ExternalLink href="https://github.com/neneee0181">neneee0181</ExternalLink></dd></div>
                        <div><dt>GITHUB · WEB</dt><dd><ExternalLink href="https://github.com/kevin0181">kevin0181</ExternalLink></dd></div>
                    </dl>
                    <div className="profile-more"><span>LINKS</span><ExternalLink href="https://code-nen.tistory.com/">개발 블로그</ExternalLink><ExternalLink href="https://www.inflearn.com/users/1466071/@neneee">Inflearn</ExternalLink></div>
                </header>
                <section className="resume-section about-section" id="about" aria-labelledby="about-heading"><SectionHeading id="about" /><div className="intro-copy">{introParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>
                <section className="resume-section" id="projects" aria-labelledby="projects-heading">
                    <SectionHeading id="projects" />
                    <div className="project-filters" role="group" aria-label="프로젝트 분야">{filters.map(({ id, label }) => <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}<span>{orderedProjects.filter((project) => matchesFilter(project, id)).length}</span></button>)}</div>
                    <p className="sr-only" role="status">{filters.find(({ id }) => id === filter).label} 프로젝트 {visibleProjects.length}개</p>
                    <div className="project-list">{visibleProjects.map((project) => <Project key={project.id} project={project} onPreview={setPreview} />)}</div>
                    <div className="print-only print-projects">{orderedProjects.map((project) => <Project key={project.id} project={project} onPreview={setPreview} />)}</div>
                </section>
                <section className="resume-section" id="skills" aria-labelledby="skills-heading"><SectionHeading id="skills" /><dl className="skill-table">{skillOrder.map((index) => { const group = skillGroups[index]; return <div key={group.label}><dt>{skillLabels[group.label]}</dt><dd>{group.items.map((item) => <span key={item}>{item}</span>)}</dd></div>; })}</dl></section>
                <section className="resume-section" id="experience" aria-labelledby="experience-heading"><SectionHeading id="experience" /><div className="timeline">{[...experiences].reverse().map((experience) => <article className="timeline-row" key={experience.id}><div className="timeline-period">{experience.period}</div><div className="timeline-content"><h3>{experience.title}</h3><p className="timeline-subtitle">{experience.subtitle}</p><ul className="resume-bullets">{experience.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul><Tags items={experience.tags} /></div></article>)}</div></section>
                <section className="resume-section" id="achievements" aria-labelledby="achievements-heading"><SectionHeading id="achievements" /><div className="timeline">{achievements.map((achievement) => <article className="timeline-row" key={achievement.id}><div className="timeline-period">{achievement.period}<span className="achievement-type">{achievement.type}</span></div><div className="timeline-content"><h3>{achievement.title}</h3><p className="timeline-subtitle">{achievement.subtitle}</p><ul className="resume-bullets">{achievement.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul><Tags items={achievement.tags} /><div className="project-links">{achievement.links.map((link) => <ExternalLink key={link.href} href={link.href}>{link.label}</ExternalLink>)}</div></div></article>)}</div></section>
                <section className="resume-section" id="activities" aria-labelledby="activities-heading"><SectionHeading id="activities" /><div className="activity-list">{[...activities].reverse().map((activity) => <article className="activity-row" key={activity.id}>
                    <button className="activity-image" type="button" aria-label={`${activity.title} 이미지 확대`} onClick={() => setPreview(activity)}><img src={asset(`project/${activity.image}`)} alt={`${activity.title} 활동 화면`} loading="lazy" /></button>
                    <div><p className="activity-period">{activity.period}</p><h3>{activity.title}</h3><p className="activity-subtitle">{activity.subtitle}</p><ul className="resume-bullets">{activity.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul><div className="project-links">{activity.links.map((link) => <ExternalLink key={link.href} href={link.href}>{link.label}</ExternalLink>)}</div></div>
                </article>)}</div></section>
                <footer className="document-footer"><span><DocumentTextIcon aria-hidden="true" />유영빈 · 이력서</span><a href="#top">처음으로<ArrowUpIcon aria-hidden="true" /></a></footer>
            </main>
        </div>
        <footer className="site-footer"><span>YOU YOUNG BIN</span><a href="mailto:kevin018111@gmail.com">kevin018111@gmail.com<ArrowUpRightIcon aria-hidden="true" /></a></footer>
        <Modal isOpen={Boolean(preview?.image)} onClose={closePreview} title={preview?.title}>{preview?.image && <img className="preview-image" src={asset(`project/${preview.image}`)} alt={`${preview.title} 프로젝트 화면 확대`} />}</Modal>
    </div>;
}
