<div align="center">

# DCoderHub

**해커톤 운영 플랫폼 — 정보, 팀빌딩, 랭킹을 한 곳에서**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/Zustand-5-orange?style=flat-square)](https://zustand-demo.pmnd.rs)

</div>

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| **해커톤 목록 · 상세** | 진행 중 / 예정 / 종료 필터, 일정·상금·심사 기준 확인 |
| **팀 모집 (캠프)** | 팀 생성, 지원, AI 팀 매칭 |
| **제출 관리** | 기간별 제출 창 잠금, 팀/참가자 자동 입력, 제출 이력 |
| **랭킹** | 누적 포인트 기반 개발자 랭킹보드 |
| **AI 어시스턴트** | 해커톤 정보 챗봇 (일 20회), AI 팀 매칭 (일 5회) |
| **Google OAuth** | 구글 계정 로그인 / 이메일 인증 회원가입 |
| **다크 모드** | 라이트 / 다크 테마 전환 |
| **Command Palette** | `Cmd+K` / `Ctrl+K` 빠른 탐색 |

---

## 시작하기

### 요구사항

- Node.js 18+
- npm 9+

### 설치

```bash
git clone https://github.com/<your-username>/DCoderHub.git
cd DCoderHub/daker-hub
npm install
```

### 환경변수 설정

`.env.local` 파일을 생성하고 아래 값을 입력합니다.

```env
# Google OAuth (선택 — 미설정 시 이메일/비밀번호 로그인만 가능)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# OpenAI (선택 — 미설정 시 AI 기능 비활성화)
OPENAI_API_KEY=your_openai_api_key

# Gmail 이메일 인증 (선택 — 미설정 시 이메일 발송 불가)
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

> **Gmail 앱 비밀번호 발급**: Google 계정 → 보안 → 2단계 인증 활성화 → "앱 비밀번호" 검색 → 생성

### 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인

### 프로덕션 빌드

```bash
npm run build
npm run start
```

---

## 프로젝트 구조

```
daker-hub/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API Routes
│   │   │   ├── chat/           # AI 챗봇
│   │   │   ├── team-match/     # AI 팀 매칭
│   │   │   └── send-verify-email/  # 이메일 인증 발송
│   │   ├── hackathons/         # 해커톤 목록 · 상세
│   │   ├── camp/               # 팀 모집
│   │   ├── rankings/           # 랭킹
│   │   └── profile/            # 프로필
│   ├── components/
│   │   ├── auth/               # 로그인 · 회원가입 모달
│   │   ├── hackathons/         # 해커톤 섹션 컴포넌트
│   │   ├── camp/               # 팀 · AI 매칭 컴포넌트
│   │   ├── ai/                 # AI 챗봇
│   │   ├── layout/             # Navbar · Footer
│   │   └── common/             # Command Palette 등 공통
│   ├── store/
│   │   └── useStore.ts         # Zustand 전역 상태 (persist)
│   └── lib/
│       ├── types.ts            # 타입 정의
│       ├── seed-data.ts        # 초기 시드 데이터
│       └── utils.ts            # 유틸리티 함수
└── public/
    └── favicon.svg
```

---

## 기술 스택

**Frontend**
- [Next.js 16](https://nextjs.org) — App Router, Server Components
- [React 19](https://react.dev) — UI 라이브러리
- [TypeScript 5](https://www.typescriptlang.org) — 타입 안전성
- [Tailwind CSS 4](https://tailwindcss.com) — 유틸리티 스타일링
- [Framer Motion](https://www.framer.com/motion) — 애니메이션
- [Recharts](https://recharts.org) — 데이터 시각화

**상태 관리**
- [Zustand 5](https://zustand-demo.pmnd.rs) — 전역 상태 + localStorage 퍼시스트

**인증**
- [@react-oauth/google](https://github.com/MomenSherif/react-oauth) — Google OAuth 2.0
- [Nodemailer](https://nodemailer.com) — 이메일 인증 (Gmail SMTP)

**AI**
- [OpenAI SDK](https://github.com/openai/openai-node) — GPT 기반 챗봇 · 팀 매칭

---

## 데이터 관리

모든 데이터는 **브라우저 localStorage**에 Zustand persist로 저장됩니다. 별도 DB 없이 동작하는 클라이언트 사이드 앱입니다.

- **시드 데이터**: `src/lib/seed-data.ts` — 해커톤, 팀, 리더보드 초기 데이터
- **데이터 초기화**: `DATA_VERSION` 상수를 올리면 사용자 생성 데이터(가입, 제출, 팀 지원 등)가 초기화되고 시드 데이터만 남습니다.

---

## 배포

### Vercel

1. GitHub 저장소에 Push
2. [Vercel](https://vercel.com) → New Project → 저장소 연결
3. **Root Directory**: `daker-hub`
4. **Environment Variables** 설정 (위 `.env.local` 참고)
5. Deploy

> 배포 후 Google Cloud Console에서 Authorized JavaScript origins에 Vercel 도메인 추가 필요

---

## 라이선스

MIT
