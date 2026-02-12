# 다른 PC에서 프로젝트 이어서 작업하기

이 문서는 `my-test-website` 프로젝트를 새로운 PC에서 클론하고 개발 환경을 세팅하는 전체 과정을 안내합니다.

---

## 1단계: 사전 준비 (필수 프로그램 설치)

새 PC에 아래 프로그램들이 설치되어 있어야 합니다.

### 1-1. Git 설치
```bash
# 다운로드: https://git-scm.com/downloads
# 설치 후 확인
git --version
```

### 1-2. Node.js 설치 (v20 권장)
```bash
# 다운로드: https://nodejs.org/
# LTS 버전 설치 후 확인
node --version
npm --version
```

### 1-3. Claude Code (CLI) 설치
```bash
npm install -g @anthropic-ai/claude-code
```

### 1-4. VS Code 설치 (선택사항)
```bash
# 다운로드: https://code.visualstudio.com/
```

---

## 2단계: GitHub에서 프로젝트 클론

### 2-1. 작업할 폴더로 이동
```bash
# 원하는 작업 디렉토리로 이동 (예시)
cd D:\AI바이브웹
```

### 2-2. 레포지토리 클론
```bash
git clone https://github.com/Kyo1901/my-test-website.git my_ai_web
```

### 2-3. 프로젝트 폴더로 이동
```bash
cd my_ai_web
```

---

## 3단계: Git 사용자 정보 설정

```bash
git config user.name "kyo1901"
git config user.email "skadnjs153@naver.com"
```

---

## 4단계: 서브 프로젝트 의존성 설치 (npm install)

프로젝트 내에 여러 서브 프로젝트가 있습니다. 각각 `npm install`을 실행해야 합니다.

```bash
# it-info-community (메인 프로젝트)
cd lecture1/it-info-community
npm install
cd ../..

# _template_settings
cd lecture1/_template_settings
npm install
cd ../..

# ui_test
cd lecture1/ui_test
npm install
cd ../..

# my-portfolio
cd lecture1/my-portfolio
npm install
cd ../..
```

> 한 줄로 한번에 실행하려면:
> ```bash
> cd lecture1/it-info-community && npm install && cd ../.. && cd lecture1/_template_settings && npm install && cd ../.. && cd lecture1/ui_test && npm install && cd ../.. && cd lecture1/my-portfolio && npm install && cd ../..
> ```

---

## 5단계: MCP 설정 파일 생성 (.mcp.json)

`.mcp.json` 파일은 보안상 Git에 포함되지 않으므로 **직접 생성**해야 합니다.

프로젝트 루트(`my_ai_web/`)에 `.mcp.json` 파일을 만들고 아래 내용을 입력하세요:

```json
{
  "mcpServers": {
    "git": {
      "type": "stdio",
      "command": "npx",
      "args": ["@cyanheads/git-mcp-server@latest"],
      "env": {
        "GIT_USERNAME": "kyo1901",
        "GIT_EMAIL": "skadnjs153@naver.com",
        "GITHUB_TOKEN": "여기에_깃허브_토큰_입력"
      }
    },
    "supabase": {
      "type": "stdio",
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--project-ref=cizusiaqkymgiicmgsqs"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "여기에_수파베이스_토큰_입력"
      }
    }
  }
}
```

> **주의:** 토큰 값은 보안 정보이므로 이 문서에 직접 적지 않았습니다.
> 기존 PC의 `.mcp.json` 파일에서 토큰 값을 확인하거나, 새로 발급받으세요.
>
> - **GitHub Token 발급:** GitHub > Settings > Developer settings > Personal access tokens
> - **Supabase Token 확인:** https://supabase.com/dashboard/account/tokens

---

## 6단계: Claude Code 실행 및 확인

```bash
# 프로젝트 루트에서 Claude Code 실행
cd D:\AI바이브웹\my_ai_web
claude
```

Claude Code가 실행되면 `.mcp.json`을 자동으로 인식하고 MCP 서버들이 연결됩니다.

### 연결 확인용 프롬프트
Claude Code에서 아래를 입력해 정상 연결을 확인하세요:

```
Supabase 테이블 목록을 조회해줘
```

정상이면 테이블 목록(또는 빈 목록)이 표시됩니다.

---

## 7단계: 개발 서버 실행 (선택)

### it-info-community (메인 프로젝트) 실행
```bash
cd lecture1/it-info-community
npm run dev
```

### 기타 서브 프로젝트 실행
```bash
# _template_settings
cd lecture1/_template_settings
npm run dev

# ui_test
cd lecture1/ui_test
npm run dev

# my-portfolio
cd lecture1/my-portfolio
npm run dev
```

---

## 프로젝트 구조 요약

```
my_ai_web/
├── .github/workflows/    # GitHub Pages 자동 배포 설정
│   └── deploy.yml
├── .gitignore            # Git 제외 파일 목록
├── .mcp.json             # MCP 서버 설정 (Git 제외 - 직접 생성 필요)
├── CLAUDE.md             # Claude Code 설정
├── index.html            # 루트 랜딩 페이지
└── lecture1/
    ├── it-info-community/   # 메인 React 프로젝트 (GitHub Pages 배포)
    ├── _template_settings/  # 템플릿 설정 프로젝트
    ├── ui_test/             # UI 테스트 프로젝트
    ├── my-portfolio/        # 포트폴리오 프로젝트
    └── lecture1/my-react-app/ # React+TypeScript 학습용
```

---

## 빠른 복사용 - 전체 명령어 한번에

새 PC에서 아래를 순서대로 복사해서 실행하면 됩니다:

```bash
# 1. 클론
cd D:\AI바이브웹
git clone https://github.com/Kyo1901/my-test-website.git my_ai_web
cd my_ai_web

# 2. Git 설정
git config user.name "kyo1901"
git config user.email "skadnjs153@naver.com"

# 3. 의존성 설치
cd lecture1/it-info-community && npm install && cd ../..
cd lecture1/_template_settings && npm install && cd ../..
cd lecture1/ui_test && npm install && cd ../..
cd lecture1/my-portfolio && npm install && cd ../..

# 4. .mcp.json 파일 직접 생성 (위 5단계 참고)

# 5. Claude Code 실행
claude
```

---

## 문제 해결

| 증상 | 해결 방법 |
|------|-----------|
| `git clone` 실패 | GitHub 로그인 확인, 토큰 또는 SSH 키 설정 |
| `npm install` 에러 | Node.js 버전 확인 (v20 권장), `npm cache clean --force` 후 재시도 |
| Claude Code MCP 연결 실패 | `.mcp.json` 파일 위치(프로젝트 루트)와 토큰 값 확인 |
| 개발 서버 안 열림 | 해당 서브 프로젝트 폴더에서 `npm install` 완료 여부 확인 |
