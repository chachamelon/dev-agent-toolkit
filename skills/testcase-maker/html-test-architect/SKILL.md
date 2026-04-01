# 범용 HTML 테스트 아키텍트 (Universal HTML Test Architect) - Full TC Edition

이 스킬은 어떤 웹사이트의 HTML 소스라도 분석하여 요구사항을 역공학하고, 프로젝트 표준(`GEMINI.md`)에 따라 **기능별로 구조화된 개별 테스트 케이스(TC) 세트**를 생성합니다.

## 📋 핵심 분석 및 생성 지침

에이전트는 모든 웹 도메인(커뮤니티, 이커머스, SaaS 등)에 대해 다음 원칙을 엄격히 준수합니다.

### 1. 전역 레이아웃 및 계층 분석 (Site Audit)
- **Top-down 분석**: `<body>`의 직계 자식부터 분석하여 전역(Global) 영역과 지역(Local) 영역을 명확히 구분합니다.
- **전역 요소 판단**: 2개 이상의 페이지에서 공통으로 나타나는 요소(Header, Footer, SideNav, Global Widgets)는 반드시 `Common` 페이지로 분류합니다.
- **시맨틱 태그 우선**: HTML5 표준 태그(`<header>`, `<nav>`, `<main>`, `<footer>` 등)를 식별의 최우선 기준으로 삼습니다.

### 2. 기능 중심의 범용 네이밍 (Functional Naming)
- **경로**: `test_cases/{site_name}/{functional_page_name}/{section_name}/`
- **페이지 네이밍 표준 (도메인 적응형)**:
    - `Common`: 전역 레이아웃 및 공통 위젯 (로그인 위젯, 검색바 등 포함).
    - `Main` 또는 `Dashboard`: 서비스의 진입점.
    - `Listing`: 목록형 데이터와 검색/필터가 집중된 페이지 (BoardList, ProductList 등).
    - `ContentDetail`: 상세 보기 페이지 (PostDetail, ProductView 등).
    - `Transaction`: 흐름이 있는 기능 (Checkout, Register, WritePost 등).
    - `User`: 개인화 영역 (Profile, Settings, MyPage 등).
- **파일명**: `TC_{section_name}_{function_name}.md`

### 3. BDD 스타일의 원자적 거킨 (Atomic Gherkin)
- **포맷**: `Given-When-Then` 구조의 한국어 작성.
- **원자성**: 하나의 파일/시나리오는 반드시 **단 하나의 동작(Single Action)**만 검증합니다.

### 4. 분석의 4대 필러 (The 4 Pillars)
모든 시나리오는 다음 요소를 반드시 포함하여 검증합니다.
1. **폼 입력 필드**: 데이터 유효성, 필수값, 입력 제약.
2. **버튼 활성화/상태**: 상호작용 및 조건에 따른 로직.
3. **내비게이션 흐름**: 페이지 간의 전이 및 목적지 도달성.
4. **접근성(ARIA)**: 스크린 리더 지원 및 키보드 네비게이션.

## 🛠️ 실행 워크플로우 (Loop Task)

1. **사이트 성격 식별**: HTML을 통해 사이트의 도메인과 주요 기능을 파악합니다.
2. **전체 구조 지도(Map) 보고**: 식별된 페이지 및 섹션 구조를 사용자에게 먼저 보고하고 네이밍을 승인받습니다.
3. **섹션별 루프 수행**: 승인된 구조에 따라 섹션별로 TC 파일과 `README.md`를 생성합니다.
4. **팩트 검증**: 생성된 모든 내용은 HTML 소스의 실제 속성(`id`, `class`, `data-*`, `onclick` 등)에 기반해야 합니다.

## ⚖️ 평가 루브릭
- **범용성**: 특정 사이트에 종속된 용어가 아닌 기능적 명칭을 사용했는가.
- **구조화**: 전역(Common)과 지역(Page) 요소가 명확히 분리되었는가.
- **정밀도**: HTML 속성을 역공학하여 기획 의도를 정확히 추론했는가.
