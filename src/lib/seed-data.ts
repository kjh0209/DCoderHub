import type { Hackathon, HackathonDetail, Team, LeaderboardData, RankingEntry } from "./types";

export const DATA_VERSION = 7;

export const SEED_HACKATHONS: Hackathon[] = [
  {
    slug: "aimers-8-model-lite",
    title: "Aimers 8기 : 모델 경량화 온라인 해커톤",
    status: "ended",
    tags: ["LLM", "Compression", "vLLM"],
    thumbnailUrl: "/thumbnails/aimers8.png",
    period: {
      timezone: "Asia/Seoul",
      submissionDeadlineAt: "2026-02-25T10:00:00+09:00",
      endAt: "2026-02-26T10:00:00+09:00",
    },
    links: {
      detail: "/hackathons/aimers-8-model-lite",
      rules: "https://example.com/public/rules/aimers8",
      faq: "https://example.com/public/faq/aimers8",
    },
  },
  {
    slug: "monthly-vibe-coding-2026-02",
    title: "월간 해커톤 : 바이브 코딩 개선 AI 아이디어 공모전 (2026.02)",
    status: "ended",
    tags: ["Idea", "GenAI", "Workflow"],
    thumbnailUrl: "/thumbnails/vibe202602.png",
    period: {
      timezone: "Asia/Seoul",
      submissionDeadlineAt: "2026-03-03T10:00:00+09:00",
      endAt: "2026-03-09T10:00:00+09:00",
    },
    links: {
      detail: "/hackathons/monthly-vibe-coding-2026-02",
      rules: "https://example.com/public/rules/vibe202602",
      faq: "https://example.com/public/faq/vibe202602",
    },
  },
  {
    slug: "daker-handover-2026-03",
    title: "긴급 인수인계 해커톤: 명세서만 보고 구현하라",
    status: "ongoing",
    tags: ["VibeCoding", "Web", "Vercel", "Handover"],
    thumbnailUrl: "/thumbnails/handover.png",
    period: {
      timezone: "Asia/Seoul",
      submissionDeadlineAt: "2026-03-30T10:00:00+09:00",
      endAt: "2026-04-27T10:00:00+09:00",
    },
    links: {
      detail: "/hackathons/daker-handover-2026-03",
      rules: "https://example.com/public/rules/daker-handover-202603",
      faq: "https://example.com/public/faq/daker-handover-202603",
    },
  },
];

export const SEED_HACKATHON_DETAILS: Record<string, HackathonDetail> = {
  "daker-handover-2026-03": {
    slug: "daker-handover-2026-03",
    title: "긴급 인수인계 해커톤: 명세서만 보고 구현하라",
    sections: {
      overview: {
        summary:
          "기능 명세서만 남기고 사라진 개발자의 문서를 기반으로 바이브 코딩을 통해 웹서비스를 구현·배포하는 해커톤입니다. 예시 문서/제공 자료만 남기고 사라진 개발자의 기록을 바탕으로, 바이브 코딩으로 웹 서비스를 구현하고 Vercel로 배포하는 해커톤입니다. 목표: 제공된 자료를 기반으로 웹페이지 완성. 자료를 바탕으로 팀의 아이디어로 확장 기능/UX 개선을 목표로 합니다. 기술/환경: 기술 제한 없이 바이브 코딩 도구 활용. 배포는 Vercel 필수.",
        teamPolicy: { allowSolo: true, maxTeamSize: 5 },
      },
      info: {
        notice: [
          "예시 자료 외 데이터는 제공되지 않습니다.",
          "더미 데이터/로컬 저장소(localStorage 등)를 활용해 구현하세요.",
          "배포 URL은 외부에서 접속 가능해야하며 심사 기간동안 접근 가능해야합니다.",
          "외부 API/외부 DB를 쓰는 경우에도 심사자가 별도 키 없이 확인 가능해야 합니다. (키가 필요한 기능은 평가에서 확인이 제한될 수 있음)",
        ],
        links: {
          rules: "https://example.com/public/rules/daker-handover-202603",
          faq: "https://example.com/public/faq/daker-handover-202603",
        },
      },
      eval: {
        metricName: "FinalScore",
        description: "참가팀/심사위원 투표 점수를 가중치로 합산한 최종 점수",
        scoreSource: "vote",
        scoreDisplay: {
          label: "투표 점수",
          breakdown: [
            { key: "participant", label: "참가자", weightPercent: 30 },
            { key: "judge", label: "심사위원", weightPercent: 70 },
          ],
        },
        evalCriteria: [
          {
            category: "기본 구현",
            points: 30,
            description: "웹 페이지 구현도, 데이터 기반 렌더링, 탐색/정렬 동작, 빈 상태 UI",
          },
          {
            category: "확장(아이디어)",
            points: 30,
            description:
              "팀 고유 기능/UX 개선의 참신한 실용성, '서비스로서 가치'가 드러나는 확장, 일관된 흐름",
          },
          {
            category: "완성도",
            points: 25,
            description: "사용성(동선/가독성), 안정성(오류/에러 처리), 성능(로딩/반응성), 접근성/반응형",
          },
          {
            category: "문서/설명",
            points: 15,
            description: "기획서의 명확성, PPT의 설계/구현 설명역, 실제/검증 방법(재현성)",
          },
        ],
      },
      schedule: {
        timezone: "Asia/Seoul",
        milestones: [
          { name: "접수/기획서 제출 기간", at: "2026-03-04T10:00:00+09:00", tag: "접수" },
          { name: "접수/기획서 제출 마감", at: "2026-03-30T10:00:00+09:00", tag: "접수" },
          { name: "최종 웹링크 제출 마감", at: "2026-04-06T10:00:00+09:00", tag: "제출" },
          { name: "최종 솔루션 PDF 제출 마감", at: "2026-04-13T10:00:00+09:00", tag: "제출" },
          { name: "1차 투표평가 시작", at: "2026-04-13T12:00:00+09:00", tag: "평가" },
          { name: "1차 투표평가 마감", at: "2026-04-17T10:00:00+09:00", tag: "평가" },
          { name: "2차 내부평가 종료", at: "2026-04-24T23:59:00+09:00", tag: "기타" },
          { name: "최종 결과 발표", at: "2026-04-27T10:00:00+09:00", tag: "기타" },
        ],
      },
      prize: {
        totalKRW: 1000000,
        items: [
          { place: "1위", amountKRW: 500000 },
          { place: "2위", amountKRW: 300000 },
          { place: "3위", amountKRW: 200000 },
        ],
      },
      teams: { campEnabled: true, listUrl: "/camp?hackathon=daker-handover-2026-03" },
      submit: {
        allowedArtifactTypes: ["text", "url", "pdf"],
        submissionUrl: "/hackathons/daker-handover-2026-03#submit",
        guide: [
          "기획서(PDF) → 최종 웹링크 → 솔루션 PPT(PDF) 순으로 단계별 제출합니다.",
          "배포 URL(Vercel)은 외부에서 접속 가능해야 하며 심사 기간 동안 접근 가능해야 합니다.",
          "외부 API/DB 사용 시 심사자가 별도 키 없이 확인 가능해야 합니다.",
          "PPT는 PDF로 변환하여 제출합니다.",
        ],
        submissionItems: [
          {
            key: "plan",
            title: "기획서",
            format: "text_or_url",
            note: "각 항목을 작성 후 저장하세요.",
            openAt: "2026-03-04T10:00:00+09:00",
            deadlineAt: "2026-03-30T10:00:00+09:00",
            fields: [
              { key: "title", label: "프로젝트 제목", type: "text", placeholder: "프로젝트 제목을 입력하세요", required: true },
              { key: "team", label: "팀/참가자", type: "text", placeholder: "팀명 또는 참가자 이름", required: true, autoFill: "userName" },
              { key: "overview", label: "서비스 개요", type: "textarea", placeholder: "서비스가 해결하는 문제와 핵심 기능을 설명하세요", required: true },
              { key: "pages", label: "페이지 구성", type: "textarea", placeholder: "주요 페이지 목록과 각 페이지의 역할을 설명하세요", required: true },
              { key: "system", label: "시스템 구성", type: "textarea", placeholder: "기술 스택, 아키텍처, 데이터 흐름을 설명하세요", required: true },
              { key: "features", label: "핵심 기능 명세", type: "textarea", placeholder: "각 기능의 입력/출력/동작 방식을 명세하세요", required: true },
              { key: "flow", label: "주요 사용 흐름", type: "textarea", placeholder: "사용자 시나리오 기반의 주요 흐름을 작성하세요" },
              { key: "plan", label: "개발 및 개선 계획", type: "textarea", placeholder: "향후 개발 방향과 개선 계획을 작성하세요" },
            ],
          },
          {
            key: "web_link",
            title: "최종 웹링크",
            format: "url",
            note: "GitHub, YouTube, 데모 URL을 각각 입력하세요.",
            openAt: "2026-03-30T10:00:00+09:00",
            deadlineAt: "2026-04-06T10:00:00+09:00",
            fields: [
              { key: "title", label: "프로젝트 제목", type: "text", placeholder: "프로젝트 제목을 입력하세요", required: true },
              { key: "team", label: "팀/참가자", type: "text", placeholder: "팀명 또는 참가자 이름", required: true, autoFill: "userName" },
              { key: "github", label: "GitHub URL", type: "url", placeholder: "https://github.com/..." },
              { key: "youtube", label: "YouTube URL", type: "url", placeholder: "https://youtube.com/..." },
              { key: "demo", label: "데모 URL (Vercel)", type: "url", placeholder: "https://your-project.vercel.app", required: true },
            ],
          },
          {
            key: "solution_pdf",
            title: "최종 솔루션 PPT (PDF)",
            format: "pdf_file",
            note: "프로젝트 정보와 PDF 파일을 함께 제출하세요.",
            openAt: "2026-03-30T10:00:00+09:00",
            deadlineAt: "2026-04-13T10:00:00+09:00",
            fields: [
              { key: "title", label: "프로젝트 제목", type: "text", placeholder: "프로젝트 제목을 입력하세요", required: true },
              { key: "team", label: "팀/참가자", type: "text", placeholder: "팀명 또는 참가자 이름", required: true, autoFill: "userName" },
              { key: "pdf", label: "PDF 파일", type: "file", accept: ".pdf", required: true },
            ],
          },
        ],
        checklistItems: [
          "기획서에 서비스 개요, 시스템 구성, 핵심 기능 명세가 모두 포함되어 있나요?",
          "배포 URL(Vercel)이 외부에서 접속 가능하며 심사 기간 동안 유지되나요?",
          "심사자가 별도 API 키 없이 서비스 전체를 확인할 수 있나요?",
          "최종 솔루션 PPT를 PDF로 변환하여 준비했나요?",
          "GitHub, YouTube, 데모 URL을 웹링크란에 모두 작성했나요?",
        ],
      },
      leaderboard: {
        publicLeaderboardUrl: "/hackathons/daker-handover-2026-03#leaderboard",
        note: "아이디어 해커톤의 점수(score)는 투표 결과를 기반으로 표시됩니다.",
      },
    },
  },
  "aimers-8-model-lite": {
    slug: "aimers-8-model-lite",
    title: "Aimers 8기 : 모델 경량화 온라인 해커톤",
    sections: {
      overview: {
        summary:
          "제한된 평가 환경에서 모델의 성능과 추론 속도를 함께 최적화합니다. LLM 추론 최적화, 양자화, 프루닝 등 다양한 경량화 기법을 활용하여 vLLM 환경에서의 성능을 극대화하는 것이 목표입니다.",
        teamPolicy: { allowSolo: true, maxTeamSize: 5 },
      },
      info: {
        notice: [
          "제출 마감 이후 추가 제출은 불가합니다.",
          "평가 환경은 고정이며, 제출물은 별도 설치 없이 실행 가능해야 합니다.",
        ],
        links: {
          rules: "https://example.com/public/rules/aimers8",
          faq: "https://example.com/public/faq/aimers8",
        },
      },
      eval: {
        metricName: "FinalScore",
        description: "성능과 속도를 종합한 점수(세부 산식은 규정 참고).",
        limits: { maxRuntimeSec: 1200, maxSubmissionsPerDay: 5 },
      },
      schedule: {
        timezone: "Asia/Seoul",
        milestones: [
          { name: "리더보드 제출 마감", at: "2026-02-25T10:00:00+09:00" },
          { name: "대회 종료", at: "2026-02-26T10:00:00+09:00" },
        ],
      },
      prize: {
        totalKRW: 5300000,
        items: [
          { place: "1st", amountKRW: 3000000 },
          { place: "2nd", amountKRW: 1500000 },
          { place: "3rd", amountKRW: 800000 },
        ],
      },
      teams: { campEnabled: true, listUrl: "/camp?hackathon=aimers-8-model-lite" },
      submit: {
        allowedArtifactTypes: ["zip"],
        submissionUrl: "/hackathons/aimers-8-model-lite#submit",
        guide: [
          "submit.zip에 허깅페이스(Hugging Face) 표준 형식의 모델 가중치 및 설정 파일을 포함하세요.",
          "제출된 모델은 운영진이 제공하는 고정된 추론 스크립트에서 평가됩니다.",
          "하루 최대 5회 제출 가능하며, 마감 이후 추가 제출은 불가합니다.",
        ],
        submissionItems: [
          {
            key: "model_zip",
            title: "모델 가중치 파일 (submit.zip)",
            format: "zip_file",
            note: "허깅페이스 표준 형식의 모델 가중치 + 설정 파일 포함 필수",
            fields: [
              { key: "zip", label: "submit.zip 파일", type: "file", accept: ".zip", required: true },
            ],
          },
        ],
        checklistItems: [
          "submit.zip에 허깅페이스 표준 형식의 모델 가중치가 포함되어 있나요?",
          "운영진이 제공한 고정 추론 스크립트에서 실행 가능한지 확인했나요?",
          "일일 제출 횟수 제한(5회)을 초과하지 않았나요?",
          "제출 마감 시각 이전인지 확인했나요?",
        ],
      },
      leaderboard: {
        publicLeaderboardUrl: "/hackathons/aimers-8-model-lite#leaderboard",
        note: "Public 리더보드는 제출 마감 시점 기준으로 고정될 수 있습니다(규정 참고).",
      },
    },
  },
  "monthly-vibe-coding-2026-02": {
    slug: "monthly-vibe-coding-2026-02",
    title: "월간 해커톤 : 바이브 코딩 개선 AI 아이디어 공모전 (2026.02)",
    sections: {
      overview: {
        summary:
          "바이브 코딩 개선을 위한 AI 아이디어를 제안하는 공모전입니다. 생성형 AI 워크플로우 개선 아이디어를 자유롭게 제안해 주세요. 프로토타입 구현은 선택사항이며, 아이디어의 참신성과 실현 가능성을 중심으로 평가합니다.",
        teamPolicy: { allowSolo: true, maxTeamSize: 3 },
      },
      info: {
        notice: ["아이디어 중심 평가입니다.", "프로토타입 구현은 선택사항입니다."],
        links: {
          rules: "https://example.com/public/rules/vibe202602",
          faq: "https://example.com/public/faq/vibe202602",
        },
      },
      eval: {
        metricName: "IdeaScore",
        description: "아이디어의 참신성, 실현 가능성, 임팩트를 종합 평가합니다.",
      },
      schedule: {
        timezone: "Asia/Seoul",
        milestones: [
          { name: "제출 마감", at: "2026-03-03T10:00:00+09:00" },
          { name: "결과 발표", at: "2026-03-09T10:00:00+09:00" },
        ],
      },
      prize: {
        totalKRW: 1000000,
        items: [
          { place: "1위", amountKRW: 500000 },
          { place: "2위", amountKRW: 300000 },
          { place: "3위", amountKRW: 200000 },
        ],
      },
      teams: { campEnabled: true, listUrl: "/camp?hackathon=monthly-vibe-coding-2026-02" },
      submit: {
        allowedArtifactTypes: ["pdf"],
        submissionUrl: "/hackathons/monthly-vibe-coding-2026-02#submit",
        guide: [
          "기획서(PDF) → 최종 기획서(PDF) 순으로 제출합니다.",
          "아이디어의 참신성과 실현 가능성 중심으로 평가됩니다.",
          "프로토타입 구현은 선택사항입니다.",
        ],
        submissionItems: [
          {
            key: "plan_doc",
            title: "기획서",
            format: "text_or_url",
            note: "각 항목을 작성 후 저장하세요.",
            openAt: "2026-02-01T00:00:00+09:00",
            deadlineAt: "2026-03-03T10:00:00+09:00",
            fields: [
              { key: "title", label: "프로젝트 제목", type: "text", placeholder: "프로젝트/아이디어 제목", required: true },
              { key: "team", label: "팀/참가자", type: "text", placeholder: "팀명 또는 참가자 이름", required: true, autoFill: "userName" },
              { key: "problem", label: "문제 정의", type: "textarea", placeholder: "해결하고자 하는 바이브 코딩의 문제점을 정의하세요", required: true },
              { key: "cause", label: "문제의 원인 분석", type: "textarea", placeholder: "문제가 발생하는 근본 원인을 분석하세요", required: true },
              { key: "idea", label: "개선 아이디어 핵심 제안", type: "textarea", placeholder: "AI를 활용한 개선 아이디어를 구체적으로 제안하세요", required: true },
              { key: "scenario", label: "적용 시나리오 및 기대 효과", type: "textarea", placeholder: "실제 적용 시나리오와 기대되는 효과를 작성하세요" },
              { key: "limits", label: "한계 및 확장 가능성", type: "textarea", placeholder: "아이디어의 한계점과 향후 확장 가능성을 작성하세요" },
            ],
          },
          {
            key: "final_plan",
            title: "최종 기획서 (PDF)",
            format: "pdf_file",
            note: "최종 기획서를 PDF로 제출하세요.",
            openAt: "2026-02-01T00:00:00+09:00",
            deadlineAt: "2026-03-03T10:00:00+09:00",
            fields: [
              { key: "title", label: "프로젝트 제목", type: "text", placeholder: "프로젝트/아이디어 제목", required: true },
              { key: "team", label: "팀/참가자", type: "text", placeholder: "팀명 또는 참가자 이름", required: true, autoFill: "userName" },
              { key: "tagline", label: "한 줄 소개", type: "text", placeholder: "아이디어를 한 문장으로 소개하세요", required: true },
              { key: "pdf", label: "PDF 파일", type: "file", accept: ".pdf", required: true },
            ],
          },
        ],
        checklistItems: [
          "기획서에 문제 정의와 개선 아이디어 핵심 제안이 명확히 기술되어 있나요?",
          "최종 기획서에 한 줄 소개가 포함되어 있나요?",
          "모든 문서에 프로젝트 제목과 팀/참가자 정보가 포함되어 있나요?",
          "PDF로 변환하여 제출 준비가 완료되었나요?",
        ],
      },
      leaderboard: {
        publicLeaderboardUrl: "/hackathons/monthly-vibe-coding-2026-02#leaderboard",
        note: "결과는 심사 후 공개됩니다.",
      },
    },
  },
};

export const SEED_TEAMS: Team[] = [
  {
    teamCode: "T-ALPHA",
    hackathonSlug: "aimers-8-model-lite",
    name: "Team Alpha",
    isOpen: true,
    memberCount: 3,
    lookingFor: ["Backend", "ML Engineer"],
    intro: "추론 최적화/경량화 실험을 함께 진행할 팀원을 찾습니다.",
    contact: { type: "link", url: "https://open.kakao.com/o/example1" },
    createdAt: "2026-02-20T11:00:00+09:00",
  },
  {
    teamCode: "T-BETA",
    hackathonSlug: "monthly-vibe-coding-2026-02",
    name: "PromptRunners",
    isOpen: true,
    memberCount: 1,
    lookingFor: ["Frontend", "Designer"],
    intro: "프롬프트 품질 점수화 + 개선 가이드 UX를 기획합니다.",
    contact: { type: "link", url: "https://forms.gle/example2" },
    createdAt: "2026-02-18T18:30:00+09:00",
  },
  {
    teamCode: "T-HANDOVER-01",
    hackathonSlug: "daker-handover-2026-03",
    name: "404found",
    isOpen: true,
    memberCount: 3,
    lookingFor: ["Frontend", "Designer"],
    intro: "명세서 기반으로 기본 기능을 빠르게 완성하고 UX 확장을 노립니다.",
    contact: { type: "link", url: "https://open.kakao.com/o/example3" },
    createdAt: "2026-03-04T11:00:00+09:00",
  },
  {
    teamCode: "T-HANDOVER-02",
    hackathonSlug: "daker-handover-2026-03",
    name: "LGTM",
    isOpen: false,
    memberCount: 5,
    lookingFor: [],
    intro: "기획서-구현-문서화를 깔끔하게 맞추는 방향으로 진행합니다.",
    contact: { type: "link", url: "https://forms.gle/example4" },
    createdAt: "2026-03-05T09:20:00+09:00",
  },
  {
    teamCode: "T-HANDOVER-03",
    hackathonSlug: "daker-handover-2026-03",
    name: "ByteBuilder",
    isOpen: true,
    memberCount: 2,
    lookingFor: ["Backend", "PM"],
    intro: "AI 기능 확장에 관심 있는 백엔드/PM 팀원을 찾습니다.",
    contact: { type: "link", url: "https://open.kakao.com/o/example5" },
    createdAt: "2026-03-06T14:00:00+09:00",
  },
  {
    teamCode: "T-HANDOVER-04",
    hackathonSlug: "daker-handover-2026-03",
    name: "CodeCrafters",
    isOpen: true,
    memberCount: 2,
    lookingFor: ["ML Engineer", "Data Scientist"],
    intro: "AI/ML 기반으로 명세서를 해석하고 자동화 파이프라인을 구축합니다.",
    contact: { type: "link", url: "https://open.kakao.com/o/example6" },
    createdAt: "2026-03-07T10:00:00+09:00",
  },
  {
    teamCode: "T-VIBE-01",
    hackathonSlug: "monthly-vibe-coding-2026-02",
    name: "AIde",
    isOpen: true,
    memberCount: 2,
    lookingFor: ["Frontend", "PM"],
    intro: "바이브 코딩 중 막히는 순간을 AI가 실시간으로 도와주는 서비스를 제안합니다.",
    contact: { type: "link", url: "https://forms.gle/example7" },
    createdAt: "2026-02-22T09:00:00+09:00",
  },
];

export const SEED_LEADERBOARDS: Record<string, LeaderboardData> = {
  "aimers-8-model-lite": {
    hackathonSlug: "aimers-8-model-lite",
    updatedAt: "2026-02-26T10:00:00+09:00",
    entries: [
      { rank: 1, teamName: "Team Alpha", score: 0.7421, submittedAt: "2026-02-24T21:05:00+09:00" },
      { rank: 2, teamName: "Team Gamma", score: 0.7013, submittedAt: "2026-02-25T09:40:00+09:00" },
      { rank: 3, teamName: "Team Delta", score: 0.6845, submittedAt: "2026-02-25T09:55:00+09:00" },
      { rank: 4, teamName: "Team Epsilon", score: 0.6512, submittedAt: "2026-02-24T18:30:00+09:00" },
      { rank: 5, teamName: "Team Zeta", score: 0.6201, submittedAt: "2026-02-25T09:58:00+09:00" },
      { rank: 6, teamName: "NeuralNinjas", score: 0.5987, submittedAt: "2026-02-25T08:12:00+09:00" },
      { rank: 7, teamName: "QuantumLeap", score: 0.5741, submittedAt: "2026-02-24T17:45:00+09:00" },
    ],
  },
  "daker-handover-2026-03": {
    hackathonSlug: "daker-handover-2026-03",
    updatedAt: "2026-04-17T10:00:00+09:00",
    entries: [
      {
        rank: 1,
        teamName: "404found",
        score: 87.5,
        submittedAt: "2026-04-13T09:58:00+09:00",
        scoreBreakdown: { participant: 82, judge: 90 },
        artifacts: {
          webUrl: "https://404found.vercel.app",
          pdfUrl: "https://example.com/404found-solution.pdf",
          planTitle: "404found 기획서",
        },
      },
      {
        rank: 2,
        teamName: "LGTM",
        score: 84.2,
        submittedAt: "2026-04-13T09:40:00+09:00",
        scoreBreakdown: { participant: 79, judge: 88 },
        artifacts: {
          webUrl: "https://lgtm-hack.vercel.app",
          pdfUrl: "https://example.com/lgtm-solution.pdf",
          planTitle: "LGTM 기획서",
        },
      },
      {
        rank: 3,
        teamName: "ByteBuilder",
        score: 78.9,
        submittedAt: "2026-04-13T09:50:00+09:00",
        scoreBreakdown: { participant: 75, judge: 81 },
        artifacts: {
          webUrl: "https://bytebuilder.vercel.app",
          pdfUrl: "https://example.com/bytebuilder-solution.pdf",
          planTitle: "ByteBuilder 기획서",
        },
      },
      {
        rank: 4,
        teamName: "CodeCrafters",
        score: 72.1,
        submittedAt: "2026-04-12T23:30:00+09:00",
        scoreBreakdown: { participant: 70, judge: 73 },
        artifacts: {
          webUrl: "https://codecrafters.vercel.app",
          pdfUrl: "https://example.com/codecrafters-solution.pdf",
          planTitle: "CodeCrafters 기획서",
        },
      },
      {
        rank: 5,
        teamName: "DevDreamers",
        score: 68.5,
        submittedAt: "2026-04-13T09:30:00+09:00",
        scoreBreakdown: { participant: 65, judge: 70 },
        artifacts: {
          webUrl: "https://devdreamers.vercel.app",
          pdfUrl: "https://example.com/devdreamers-solution.pdf",
          planTitle: "DevDreamers 기획서",
        },
      },
    ],
  },
  "monthly-vibe-coding-2026-02": {
    hackathonSlug: "monthly-vibe-coding-2026-02",
    updatedAt: "2026-03-09T10:00:00+09:00",
    entries: [
      {
        rank: 1,
        teamName: "PromptRunners",
        score: 91.0,
        submittedAt: "2026-03-03T09:45:00+09:00",
        scoreBreakdown: { participant: 88, judge: 93 },
        artifacts: {
          webUrl: "#",
          pdfUrl: "https://example.com/promptrunners-plan.pdf",
          planTitle: "PromptRunners 최종 기획서",
        },
      },
      {
        rank: 2,
        teamName: "AIde",
        score: 85.5,
        submittedAt: "2026-03-03T09:30:00+09:00",
        scoreBreakdown: { participant: 83, judge: 87 },
        artifacts: {
          webUrl: "#",
          pdfUrl: "https://example.com/aide-plan.pdf",
          planTitle: "AIde 최종 기획서",
        },
      },
      {
        rank: 3,
        teamName: "NeuralNinjas",
        score: 78.0,
        submittedAt: "2026-03-03T08:50:00+09:00",
        scoreBreakdown: { participant: 76, judge: 79 },
        artifacts: {
          webUrl: "#",
          pdfUrl: "https://example.com/neuralninja-plan.pdf",
          planTitle: "NeuralNinjas 최종 기획서",
        },
      },
    ],
  },
};

export const SEED_RANKINGS: RankingEntry[] = [
  { rank: 1, nickname: "Team Alpha", points: 1580, hackathonCount: 5, firstPlaceCount: 2, lastActiveAt: "2026-04-04T10:00:00+09:00" },
  { rank: 2, nickname: "404found", points: 1420, hackathonCount: 4, firstPlaceCount: 1, lastActiveAt: "2026-04-03T10:00:00+09:00" },
  { rank: 3, nickname: "LGTM", points: 1350, hackathonCount: 6, firstPlaceCount: 1, lastActiveAt: "2026-04-02T10:00:00+09:00" },
  { rank: 4, nickname: "Team Gamma", points: 1200, hackathonCount: 4, firstPlaceCount: 0, lastActiveAt: "2026-04-01T10:00:00+09:00" },
  { rank: 5, nickname: "ByteBuilder", points: 1100, hackathonCount: 3, firstPlaceCount: 0, lastActiveAt: "2026-03-30T10:00:00+09:00" },
  { rank: 6, nickname: "PromptRunners", points: 980, hackathonCount: 3, firstPlaceCount: 0, lastActiveAt: "2026-03-20T10:00:00+09:00" },
  { rank: 7, nickname: "CodeCrafters", points: 870, hackathonCount: 2, firstPlaceCount: 0, lastActiveAt: "2026-03-15T10:00:00+09:00" },
  { rank: 8, nickname: "Team Delta", points: 750, hackathonCount: 2, firstPlaceCount: 0, lastActiveAt: "2026-03-10T10:00:00+09:00" },
  { rank: 9, nickname: "DevDreamers", points: 620, hackathonCount: 2, firstPlaceCount: 0, lastActiveAt: "2026-02-28T10:00:00+09:00" },
  { rank: 10, nickname: "AIde", points: 540, hackathonCount: 2, firstPlaceCount: 0, lastActiveAt: "2026-02-15T10:00:00+09:00" },
  { rank: 11, nickname: "NeuralNinjas", points: 480, hackathonCount: 1, firstPlaceCount: 0, lastActiveAt: "2026-01-20T10:00:00+09:00" },
  { rank: 12, nickname: "QuantumLeap", points: 390, hackathonCount: 1, firstPlaceCount: 0, lastActiveAt: "2026-01-10T10:00:00+09:00" },
];
