// Resume content shared by the public resume presentation.
// Keep only verified public professional information in this file.

export const introParagraphs = [
  "게임의 상태를 화면 속 동작으로 연결하는 게임 클라이언트 개발자를 지향합니다. C++·OpenGL 팀 프로젝트에서 렌더 상태와 충돌 반응을 다뤘고, Unreal Engine 기반 3인 팀 졸업작품 Re:adapt에서는 강화학습 기반 드론 연구와 클라이언트 기능을 구현했습니다.",
  "Re:adapt에서는 Unreal Engine과 Python을 FSocket으로 연결하고, PyBullet·PPO 사전학습 후 Unreal 환경에서 파인튜닝하는 학습 흐름을 구성했습니다. 두 환경의 조건과 실행 결과를 확인하며 학습 정책을 보조 제어와 함께 게임 속 드론에 적용했습니다.",
  "AI를 실제 개발에 적용하고 필요한 기능을 도구로 만드는 일을 좋아합니다. 생성형 AI의 도움을 받아 Agent Chat을 기획하고, 모델의 요청을 Unreal Editor의 조회·승인 후 편집 흐름에 연결했습니다. 현재는 개발을 중단한 개인 프로토타입이며, AI를 활용할 때 실행 범위와 결과를 직접 확인하는 과정을 중요하게 생각합니다."
];

export const skillGroups = [
  {
    "label": "Languages",
    "items": [
      "C++",
      "Python",
      "JavaScript",
      "Java"
    ]
  },
  {
    "label": "Frameworks · Libraries · APIs",
    "items": [
      "Electron",
      "React",
      "Node.js",
      "Spring Boot"
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
      "MySQL",
      "Oracle",
      "Redis",
      "MongoDB"
    ]
  },
  {
    "label": "Version Control",
    "items": [
      "Git",
      "GitHub"
    ]
  },
  {
    "label": "Tools",
    "items": [
      "IntelliJ",
      "VS Code"
    ]
  },
  {
    "label": "Game Development",
    "items": [
      "Unreal Engine",
      "Blueprint",
      "Win32 API",
      "OpenGL",
      "Bullet Physics"
    ]
  },
  {
    "label": "AI Agents",
    "items": [
      "Codex",
      "Claude Code"
    ]
  },
  {
    "label": "AI Learning",
    "items": [
      "PyBullet",
      "PPO",
      "ONNX",
      "Unreal NNE"
    ]
  }
];

export const experiences = [
  {
    "id": "nestec-korea",
    "title": "㈜네스텍코리아",
    "period": "2018.11 ~ 2019.07",
    "subtitle": "소켓 QA 팀 · 출하 전 품질 검사",
    "bullets": [
      "반도체 검사 소켓 제품의 출하 전 품질 검사 담당",
      "핀 상태·홀 크기·핀 개수 등 주요 항목을 기준에 따라 확인",
      "제품이 고객사에 전달되기 전 품질 이상 여부 점검"
    ],
    "tags": [
      "소켓 QA",
      "품질 검사"
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
    "subtitle": "정보체계관리병 · 병장 만기 전역",
    "bullets": [
      "부대 인트라넷 관리와 정보 보안 업무",
      "부대 인트라넷 페이지 디자인 수정"
    ],
    "tags": [
      "CS",
      "정보 보안"
    ]
  },
  {
    "id": "ibk-training",
    "title": "기업은행 신입사원 교육",
    "period": "교육 경험",
    "subtitle": "멘토링 참여",
    "bullets": [
      "기업은행 신입사원 교육에 멘토로 참여했습니다."
    ],
    "tags": []
  },
  {
    "id": "elice",
    "title": "엘리스 · 부트캠프 교육",
    "period": "부트캠프 강의",
    "subtitle": "AI 웹 개발·웹 개발 부트캠프 강의",
    "bullets": [
      "AI 웹 개발·웹 개발 부트캠프에서 강의를 진행했습니다."
    ],
    "tags": [
      "React",
      "Node.js",
      "MongoDB",
      "AI"
    ]
  },
  {
    "id": "tech-university",
    "title": "한국공학대학교 · 게임공학과",
    "period": "2022.03 ~ 2027.02 (졸업 예정)",
    "subtitle": "학사 과정 · 재학 중",
    "bullets": [
      "C++·Win32 API·OpenGL 기반 게임·그래픽스 수업 프로젝트",
      "Unreal Engine 기반 3인 팀 졸업작품 Re:adapt"
    ],
    "tags": [
      "C++",
      "Win32 API",
      "OpenGL",
      "Unreal Engine"
    ]
  }
];

export const projects = [
  {
    "id": "lecture-evaluation",
    "title": "강의 평가 사이트",
    "period": "2020.05.05 ~ 2020.05.12",
    "subtitle": "강의를 등록하고 평가할 수 있는 기본적인 CRUD 사이트",
    "bullets": [
      "첫 웹 사이트 프로젝트",
      "jsp와 Spring을 사용한 SSR 사이트"
    ],
    "tags": [
      "Java",
      "Jsp",
      "Spring",
      "MySQL"
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
      "MySQL",
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
      "JavaScript",
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
    "period": "2020.09.03 ~ 2020.10.12",
    "subtitle": "CRUD 형태의 개인 블로그",
    "bullets": [
      "Spring Boot 기반 회원가입·로그인과 이메일 인증",
      "CRUD 게시판 구현"
    ],
    "tags": [
      "Spring",
      "JavaScript"
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
    "period": "2021.12.03 ~ 2022.09.09",
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
      "JavaScript",
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
    "title": "소소한 부엌 키오스크",
    "period": "2023.01.25 ~ 2023.04.04",
    "subtitle": "부모님 가게에서 사용한 주문·결제 키오스크",
    "bullets": [
      "React·Electron 키오스크와 Spring Boot 서버 연결",
      "WebSocket·STOMP로 키오스크 주문을 관리자 화면에 실시간 전달",
      "수신 JSON을 주문 카드와 알림 표시로 연결"
    ],
    "tags": [
      "Electron",
      "React",
      "Spring Boot",
      "WebSocket",
      "STOMP"
    ],
    "links": [
      {
        "label": "실제 사용 영상",
        "href": "https://youtu.be/3WQFjuu-FOs"
      },
      {
        "label": "GitHub · 비공개 저장소",
        "href": "https://github.com/kevin0181/sosoKioskElectron"
      }
    ],
    "image": "키오스크.png",
    "category": "web"
  },
  {
    "id": "inversus",
    "title": "INVERSUS",
    "period": "2024.05.10 ~ 2024.05.19",
    "subtitle": "C++·Win32 API 수업 개인 프로젝트 · 2D 슈팅 게임",
    "bullets": [
      "수업 지정 기술인 C++·Win32 API로 입력·이동·충돌·전투와 GDI 화면 출력 구현",
      "적 주변 판정 중 삭제할 인덱스를 모으고, 반복문이 끝난 뒤 삭제하도록 처리 분리"
    ],
    "tags": [
      "C++",
      "Win32 API",
      "GDI"
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
    "period": "2024.05.01 ~ 2024.06.16",
    "subtitle": "횡 스크롤 2D 액션 게임",
    "bullets": [
      "Win32Api를 사용한 2D 게임",
      "애니메이션을 추가",
      "게임 기획"
    ],
    "tags": [
      "C++",
      "Win32 API",
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
      "OpenGL",
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
    "title": "OpenGL KartRider 모작",
    "period": "2024.11 ~ 2024.12",
    "subtitle": "컴퓨터그래픽스 수업 · 2인 팀 · C++·OpenGL 레이싱 게임",
    "bullets": [
      "모델 로딩 수정, 인트로·맵 선택, 두 맵의 충돌 영역·반응과 UI·사운드 연결 담당",
      "모델을 그리기 전에 변환·법선 행렬을 갱신해 이전 모델의 상태가 다음 출력에 섞이던 오류 수정",
      "Bullet의 접촉 법선·침투 깊이를 위치 보정에 연결하고 벽 충돌 감속·결승선 판정 통합",
      "카트 이동과 추적 카메라는 팀원과 공동 작업"
    ],
    "tags": [
      "C++",
      "OpenGL",
      "GLM",
      "Bullet Physics"
    ],
    "links": [
      {
        "label": "팀 GitHub",
        "href": "https://github.com/zhaominn/24-2-KartRider"
      },
      {
        "label": "플레이 영상",
        "href": "https://youtu.be/FTfmZc3j5fU"
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
    "title": "Devil-Codex",
    "period": "2026.06 시작 · 개인 프로젝트",
    "subtitle": "생성형 AI의 도움을 받아 개발한 AI 에이전트 데스크톱 앱",
    "bullets": [
      "Codex app-server 기반 UI에 외부 모델 공급자와 Unreal MCP 연결",
      "연결이 끊겼을 때 세션 복구를 요청하고, 조회 도구의 재시도와 변경 도구의 재실행을 구분"
    ],
    "tags": [
      "Electron",
      "React",
      "TypeScript",
      "Node.js",
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
    "period": "2025.10 ~ 2026.07",
    "subtitle": "3인 팀 졸업작품 · Unreal Engine 기반 멀티플레이 TPS",
    "bullets": [
      "강화학습 기반 드론 연구를 주도하고 Unreal Engine–Python FSocket 학습 환경 구성",
      "PyBullet·PPO 사전학습 → Unreal Engine 파인튜닝으로 전환하고 두 환경의 조건·실행 결과 확인",
      "학습 정책을 보조 제어와 함께 드론에 적용하고 이동·공격 패턴 연결",
      "FPS에서 스킬 중심 TPS로의 전환을 제안하고 비교 자료와 수정 계획 공유"
    ],
    "tags": [
      "C++",
      "Python",
      "Unreal Engine",
      "PyBullet",
      "PPO",
      "ONNX/NNE"
    ],
    "links": [
      {
        "label": "팀 GitHub",
        "href": "https://github.com/zhaominn/Readapt_Project"
      },
      {
        "label": "전체 플레이 영상",
        "href": "https://youtu.be/Kpv_XP2TXwA"
      }
    ],
    "image": "readapt-project.png",
    "category": "game"
  },
  {
    "id": "agent-chat",
    "title": "Agent Chat",
    "period": "2025.11 시작 · 개발 중단",
    "subtitle": "생성형 AI의 도움을 받아 개발한 Unreal Editor 개인 프로토타입",
    "bullets": [
      "필요한 기능과 작업 흐름을 정하고 C++·Slate 기반 에디터 플러그인 기획·개발",
      "모델의 요청을 선택 액터·에셋 조회와 Blueprint 편집 도구에 연결",
      "조회 결과를 다음 모델 응답으로 전달하고 변경 작업은 사용자 승인 후 실행",
      "선택 정보 조회와 승인 후 Blueprint 노드 삭제 흐름 구현"
    ],
    "tags": [
      "C++",
      "Unreal Engine",
      "Slate",
      "AI 도구"
    ],
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/neneee0181/Agent-Chat"
      }
    ],
    "image": "agent-chat-selection.png",
    "category": "ai"
  }
];

export const activities = [
  {
    "id": "stanty",
    "title": "Stanty",
    "period": "해커톤 기획",
    "subtitle": "IoT 스마트 안전벨트 기획",
    "bullets": [
      "공군 해커톤 사업 계획서"
    ],
    "tags": [],
    "links": [],
    "image": "stanty.png"
  },
  {
    "id": "rest-api-course",
    "title": "Spring Boot와 React로 배우는 초간단 REST API 게시판 만들기",
    "period": "온라인 강의",
    "subtitle": "직접 제작해 인프런에 게시한 웹 개발 강의",
    "bullets": [],
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
    "period": "온라인 강의",
    "subtitle": "직접 제작해 인프런에 게시한 웹 개발 강의",
    "bullets": [],
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
    "period": "온라인 강의",
    "subtitle": "직접 제작해 인프런에 게시한 웹 개발 강의",
    "bullets": [],
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

export const achievements = [
  {
    "id": "protopia-2026",
    "type": "수상",
    "title": "2026년 AI·SW캡스톤디자인 경진대회(PROTOPIA) 우수상",
    "period": "2026.10.14",
    "subtitle": "RE:ADAPT · 3인 팀 공동 수상",
    "bullets": [
      "한국공학대학교 SW중심대학사업단 주최"
    ],
    "tags": [],
    "links": []
  },
  {
    "id": "drone-paper-2026",
    "type": "논문",
    "title": "PyBullet 사전학습과 Unreal Engine 파인튜닝을 이용한 강화학습 기반 드론 몬스터 제어",
    "period": "2026.05",
    "subtitle": "한국게임학회 춘계 학술발표대회 논문집 · 공동저자",
    "bullets": [
      "학술발표대회 논문집 수록, pp.665–670"
    ],
    "tags": [],
    "links": [
      {
        "label": "공식 논문집 수록 안내",
        "href": "https://kcgs.or.kr/board/presentation/article/276828"
      }
    ]
  },
  {
    "id": "industrial-engineer",
    "type": "자격",
    "title": "정보처리산업기사",
    "period": "2020.06",
    "subtitle": "한국산업인력공단 · 취득",
    "bullets": [],
    "tags": [],
    "links": []
  },
  {
    "id": "atc-cad",
    "type": "자격",
    "title": "ATC캐드마스터 2급",
    "period": "2018.11",
    "subtitle": "한국ATC센터 · 2급 취득",
    "bullets": [],
    "tags": [],
    "links": []
  },
  {
    "id": "computer-technician",
    "type": "자격",
    "title": "전자계산기기능사",
    "period": "2018.07",
    "subtitle": "한국산업인력공단 · 취득",
    "bullets": [],
    "tags": [],
    "links": []
  }
];
