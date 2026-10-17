// Existing resume content, shared by the resume presentation.

export const introParagraphs = [
  "Java·Spring Boot 기반 웹 백엔드 개발과 React 웹 서비스 프로젝트를 시작으로, 현재는 게임 클라이언트 개발로 관심 분야를 확장하고 있습니다. 게임 기획·QA 등 제작의 다양한 과정을 함께 이해하고자 하며, C++ 기반 게임·컴퓨터 그래픽스 프로젝트와 Unreal Engine 학습을 이어오면서 기능 구현뿐 아니라 플레이 경험과 제작 흐름을 함께 고민해 왔습니다.",
  "최근에는 Unreal Editor 안에서 코드·에셋·Blueprint 문맥을 다루는 AI 에이전트 플러그인과, 여러 모델 공급자·도구를 연결하는 AI 에이전트 데스크톱 앱을 개발하고 있습니다. Codex Desktop 연동 프록시와 에이전트의 세션 간 맥락을 유지하는 메모리 도구도 함께 만들며, AI 에이전트가 실제 개발 환경에서 안정적으로 작동하는 방법을 탐구하고 있습니다.",
  "클라이언트 구현에만 머무르지 않고, 기능의 사용 흐름을 설계하며 변경 사항을 검토·승인하고 필요 시 되돌릴 수 있는 QA 관점까지 고려합니다. 게임과 AI 에이전트 기술을 연결해 제작 과정의 효율과 더 나은 사용자 경험에 기여하는 개발자로 성장하고 있습니다."
];

export const skillGroups = [
  {
    "label": "Languages",
    "items": [
      "Java",
      "Javascript",
      "Python",
      "C++"
    ]
  },
  {
    "label": "Frameworks · Libraries · APIs",
    "items": [
      "Spring Boot",
      "React.js",
      "Win32 API"
    ]
  },
  {
    "label": "Infrastructure & Servers",
    "items": [
      "Naver Cloud Platform",
      "Apache Tomcat",
      "Nginx"
    ]
  },
  {
    "label": "Databases",
    "items": [
      "Mysql",
      "Oracle",
      "Redis",
      "MongoDB"
    ]
  },
  {
    "label": "Version Control",
    "items": [
      "Git",
      "Github"
    ]
  },
  {
    "label": "Tools",
    "items": [
      "Intellij",
      "VS code"
    ]
  },
  {
    "label": "Game Development",
    "items": [
      "Unreal Engine",
      "Blender"
    ]
  },
  {
    "label": "AI Agents",
    "items": [
      "Codex",
      "Claude Code"
    ]
  }
];

export const experiences = [
  {
    "id": "nestec-korea",
    "title": "(주) 네스텍코리아",
    "period": "2018.09 ~ 2019.08",
    "subtitle": "2D CAD 설계 및 QA 담당",
    "bullets": [
      "반도체 검사 장비용 소켓 개발",
      "CAD와 SolidWorks를 활용한 2D 도면 설계 및 검토",
      "설계 도면 기준 가공 결과물 품질 점검",
      "MCT 가공 공정의 문제 사항 확인 및 개선"
    ],
    "tags": [
      "CAD",
      "SolidWorks",
      "MCT"
    ]
  },
  {
    "id": "ncs-java",
    "title": "[NCS] JAVA 프로그래밍 백엔드개발 육성 과정평가형 수료",
    "period": "2019.10.14 ~ 2020.04.24",
    "subtitle": "처음으로 개발을 시작하게 된 계기",
    "bullets": [
      "기초적인 프로그래밍 언어 학습",
      "정보처리산업기사 자격증 취득",
      "jsp를 사용한 SSR 개발 진행",
      "Oracle을 사용한 다양한 쿼리문 작성"
    ],
    "tags": [
      "Java",
      "JavaScript",
      "SQL",
      "HTML",
      "CSS"
    ]
  },
  {
    "id": "air-force",
    "title": "공군 병장 만기 전역",
    "period": "2020.12.07 ~ 2022.09.06",
    "subtitle": "컴퓨터의 하드웨어와 소프트웨어의 다양한 지식을 얻게됨",
    "bullets": [
      "정보체계관리병으로 인트라넷 관리 및 정보 보안",
      "다양한 해킹 훈련을 통해 정보 보안 확립",
      "부대 인트라넷 페이지 디자인 수정(전체 수정)"
    ],
    "tags": [
      "CS",
      "정보 보안"
    ]
  },
  {
    "id": "elice",
    "title": "(주) 엘리스 (AI 웹 개발 강의)",
    "period": "2022.10.05 ~ 2022.12.05",
    "subtitle": "개발 강의를 진행하게 되며 많은걸 배우게 된 계기",
    "bullets": [
      "AI 웹개발 트랙 4개월 강의 진행",
      "웹 개발 트랙 3개월 강의 진행",
      "웹 프로젝트 1개월 멘토 진행",
      "기업은행 신입사원 멘토링 진행중"
    ],
    "tags": [
      "React.js",
      "Node.js",
      "MongoDB",
      "AI"
    ]
  },
  {
    "id": "tech-university",
    "title": "한국공학대학교(재학중)",
    "period": "2023.03 ~ 진행중",
    "subtitle": "게임 개발을 시작하게 된 계기",
    "bullets": [
      "C 언어 기초를 배움",
      "C++의 기초를 배움",
      "Win32Api를 사용하여 2D 게임을 제작"
    ],
    "tags": [
      "C언어",
      "C++",
      "Win32Api"
    ]
  }
];

export const projects = [
  {
    "id": "lecture-evaluation",
    "title": "강의 평가 사이트",
    "period": "2020.05.05 ~ 2020.05.12",
    "subtitle": "강의를 등록하고 평가할 수 있는 기본적인 CLUD 사이트",
    "bullets": [
      "첫 웹 사이트 프로젝트",
      "jsp와 Spring을 사용한 SSR 사이트"
    ],
    "tags": [
      "Java",
      "Jsp",
      "Spring",
      "Mysql"
    ],
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/kevin0181/lecture_evaluation"
      }
    ],
    "image": "강의평가.png",
    "category": "web"
  },
  {
    "id": "pet-find",
    "title": "펫파인드",
    "period": "2020.05.25 ~ 2020.06.12",
    "subtitle": "공인 API를 사용하여 유기견 유기묘를 알려주는 사이트",
    "bullets": [
      "첫번째 협업 프로젝트",
      "공인 API를 사용하여 유기견, 유기묘 데이터를 가져옴",
      "메인 화면 디자인",
      "Thymeleaf와 Spring을 사용한 SSR 사이트"
    ],
    "tags": [
      "Java",
      "Thymeleaf",
      "Spring",
      "Mysql",
      "API"
    ],
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/kevin0181/dog_portfolio"
      }
    ],
    "image": "펫파인드.png",
    "category": "web"
  },
  {
    "id": "dynamic-beat",
    "title": "Dynamic-Beat",
    "period": "2020.06.21 ~ 2020.06.27",
    "subtitle": "Java의 GUI 프로그램을 사용한 비트 게임",
    "bullets": [
      "첫번째 게임 프로젝트",
      "Java를 사용하여 GUI 프로그래밍",
      "노래의 BPM에 맞춰 비트를 내려보내는 동작"
    ],
    "tags": [
      "Java",
      "GUI"
    ],
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/kevin0181/Dynamic-Beat"
      }
    ],
    "image": "다이나믹비트.png",
    "category": "game"
  },
  {
    "id": "celebrity-match",
    "title": "Celebirty_Match, LOL_Champ_Match",
    "period": "2020.06.21 ~ 2020.06.27",
    "subtitle": "나와 닮은 연예인을 알려주는 AI 웹",
    "bullets": [
      "AI를 사용한 웹 프로젝트",
      "구글에서 제공하는 AI을 사용",
      "AI에게 연예인, 롤 캐릭터 사진을 학습",
      "본인의 사진과 닮은 연예인, 롤 캐릭터의 일치율을 비교"
    ],
    "tags": [
      "Javascript",
      "AI"
    ],
    "links": [
      {
        "label": "Celebirty_Match",
        "href": "https://github.com/kevin0181/Celebirty_Match"
      },
      {
        "label": "LOL_Champ_Match",
        "href": "https://github.com/kevin0181/LOL_Champ_Match"
      }
    ],
    "image": "연예인닮은꼴.png",
    "category": "web"
  },
  {
    "id": "nen-blog",
    "title": "넨이의 블로그",
    "period": "2020.9.3 ~ 2020.10.12",
    "subtitle": "CLUD 형태의 개인 블로그",
    "bullets": [
      "Spring Boot를",
      "회원가입 및 로그인",
      "이메일 인증",
      "CLUD 형태의 게시판"
    ],
    "tags": [
      "Spring",
      "Javascript"
    ],
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/kevin0181/nenBlog"
      }
    ],
    "image": "블로그.png",
    "category": "web"
  },
  {
    "id": "soso-kitchen",
    "title": "소소한 부엌",
    "period": "2021.12.3 ~ 2022.9.9",
    "subtitle": "WebSocket을 사용한 실시간 주문 페이지",
    "bullets": [
      "실시간 주문 연동",
      "관리자 페이지",
      "가게를 대표하는 페이지",
      "블로그 형태 시스템",
      "실제 웹 배포"
    ],
    "tags": [
      "Spring",
      "Javascript",
      "WebSocket",
      "NaverCloud",
      "Linux"
    ],
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/kevin0181/sosoProject"
      }
    ],
    "image": "soso.png",
    "category": "web"
  },
  {
    "id": "soso-kiosk",
    "title": "소소한 부엌 키오스크 버전",
    "period": "2023.1.25 ~ 2023.4.4",
    "subtitle": "소소한 부엌의 디비와 연동하여 키오스크 개발",
    "bullets": [
      "실시간 주문 연동",
      "키오스크 페이지",
      "시스템 구축"
    ],
    "tags": [
      "Spring Boot",
      "React.js",
      "Electron.js"
    ],
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/kevin0181/sosoKioskElectron"
      }
    ],
    "image": "키오스크.png",
    "category": "web"
  },
  {
    "id": "inversus",
    "title": "INVERSUS",
    "period": "2024.5.10 ~ 2024.5.19",
    "subtitle": "키보드를 사용한 2D 슈팅 게임",
    "bullets": [
      "Win32Api를 사용한 2D 게임"
    ],
    "tags": [
      "C++",
      "Win32Api"
    ],
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/kevin0181/INVERSUS"
      }
    ],
    "image": "인버서스.png",
    "category": "game"
  },
  {
    "id": "escape-chronicles",
    "title": "Escape-Chronicles",
    "period": "2024.5.1 ~ 2024.6.16",
    "subtitle": "횡 스크롤 2D 액션 게임",
    "bullets": [
      "Win32Api를 사용한 2D 게임",
      "애니메이션을 추가",
      "게임 기획"
    ],
    "tags": [
      "C++",
      "Win32Api",
      "횡 스크롤"
    ],
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/kevin0181/Escape-Chronicles"
      }
    ],
    "image": "escape크로니클.png",
    "category": "game"
  },
  {
    "id": "obj-viewer",
    "title": "Obj-viewer (opengl)",
    "period": "2024.11.15 ~ 2024.11.19",
    "subtitle": "obj 파일을 불러와 3D로 보여주는 프로그램",
    "bullets": [
      "OpenGl을 사용한 뷰어",
      "모델과 텍스쳐 입혀서 불러오기"
    ],
    "tags": [
      "C++",
      "OpenGl",
      "3D"
    ],
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/neneee0181/obj-viewer"
      }
    ],
    "image": "objview.png",
    "category": "graphics"
  },
  {
    "id": "karkartrider",
    "title": "KarKartRider",
    "period": "2024.11.20 ~ 2024.12.15",
    "subtitle": "OpenGl 3D 레이싱 게임 (카트라이더 모작)",
    "bullets": [
      "OpenGl을 사용한 3D 게임",
      "물리 구현",
      "첫 3D 게임 개발"
    ],
    "tags": [
      "C++",
      "OpenGl",
      "3D"
    ],
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/neneee0181/KartRider"
      },
      {
        "label": "플레이 영상",
        "href": "https://youtu.be/FTfmZc3j5fU?si=Knz2sXl-UROgJgys"
      }
    ],
    "image": "kartrider.png",
    "category": "game"
  },
  {
    "id": "of-f",
    "title": "OF-F",
    "period": "2022.07.11 ~ 2023.05.24",
    "subtitle": "QR 코드를 사용한 실시간 주문 웹",
    "bullets": [
      "다양한 가맹점 연결",
      "해당 가맹점의 메뉴 주문",
      "실시간 주문 전송"
    ],
    "tags": [
      "Spring Boot",
      "React.js",
      "WebSocket"
    ],
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/kevin0181/OF-f"
      }
    ],
    "image": "OF.png",
    "category": "web"
  },
  {
    "id": "devil-codex",
    "title": "Devil Codex",
    "period": "2026.06.27 ~ 진행 중",
    "subtitle": "멀티 모델과 컴퓨터 제어를 연결한 AI 에이전트 데스크톱 앱",
    "bullets": [
      "Codex app-server와 외부 AI 모델 공급자를 하나의 프로젝트 경험으로 연결",
      "인앱 브라우저·컴퓨터 제어를 포함한 MCP 도구와 원격 작업 환경 제공"
    ],
    "tags": [
      "Electron",
      "React",
      "TypeScript",
      "MCP"
    ],
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/neneee0181/Devil-Codex"
      }
    ],
    "image": "devil-codex-main.png",
    "category": "ai"
  },
  {
    "id": "readapt",
    "title": "Re:adapt",
    "period": "2025.09.01 ~ 진행 중",
    "subtitle": "1~4인 TPS 로그라이트 졸업작품",
    "bullets": [
      "플레이어와 적응형 AI 몬스터가 대결하는 TPS 로그라이트 게임",
      "강화학습을 사용한 드론 몬스터 적용",
      "Unreal Engine 5 기반 멀티플레이어 전투와 포탈·보스·증강 시스템 구현"
    ],
    "tags": [
      "Unreal Engine 5",
      "C++",
      "GAS",
      "RL"
    ],
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/zhaominn/Readapt_Project"
      }
    ],
    "image": "readapt-project.png",
    "category": "game"
  }
];

export const activities = [
  {
    "id": "stanty",
    "title": "Stanty",
    "period": "2020.05.05 ~ 2020.05.12",
    "subtitle": "Iot 스마트 안전벨트",
    "bullets": [
      "공군 해커톤",
      "사업 계획서"
    ],
    "tags": [],
    "links": [],
    "image": "stanty.png"
  },
  {
    "id": "rest-api-course",
    "title": "Spring Boot와 React로 배우는 초간단 REST API 게시판 만들기",
    "period": "2025.03.012 ~ 2025.03.27",
    "subtitle": "수강생 342명",
    "bullets": [
      "첫 강의 영상"
    ],
    "tags": [],
    "links": [
      {
        "label": "강의 보기",
        "href": "https://www.inflearn.com/course/springboot-react-restapi-게시판만들기"
      }
    ],
    "image": "in1.png"
  },
  {
    "id": "lol-search-course",
    "title": "React.js + Node.js 롤 전적 검색 사이트 만들기",
    "period": "2025.05.02 ~ 2020.05.16",
    "subtitle": "수강생 55명",
    "bullets": [
      "두번째 강의 영상"
    ],
    "tags": [],
    "links": [
      {
        "label": "강의 보기",
        "href": "https://www.inflearn.com/course/reactjs-nodejs-%EB%A1%A4%EC%A0%84%EC%A0%81-%EA%B2%80%EC%83%89%EC%82%AC%EC%9D%B4%ED%8A%B8"
      }
    ],
    "image": "in2.png"
  },
  {
    "id": "login-course",
    "title": "Spring Boot + React.js 로그인 (+소셜) 서비스 이해하기",
    "period": "2025.06.02 ~ 2020.07.16",
    "subtitle": "수강생 181명",
    "bullets": [
      "세번째 강의 영상"
    ],
    "tags": [],
    "links": [
      {
        "label": "강의 보기",
        "href": "https://www.inflearn.com/course/spring-boot-reactjs"
      }
    ],
    "image": "login.png"
  }
];
