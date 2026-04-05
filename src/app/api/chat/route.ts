import { NextResponse } from "next/server";

function generateFallbackAnswer(message: string, data: any): string {
  const msg = message.toLowerCase();

  if (msg.includes("마감") || msg.includes("언제") || msg.includes("일정")) {
    const milestones = data?.sections?.schedule?.milestones ?? [];
    if (milestones.length === 0) return "일정 정보를 찾을 수 없습니다.";
    return milestones
      .map((m: any) => `• ${m.name}: ${new Date(m.at).toLocaleDateString("ko-KR")}`)
      .join("\n");
  }

  if (msg.includes("팀") || msg.includes("인원") || msg.includes("몇 명") || msg.includes("몇명")) {
    const policy = data?.sections?.overview?.teamPolicy;
    if (!policy) return "팀 정책 정보를 찾을 수 없습니다.";
    return `최대 팀원 수: ${policy.maxTeamSize}명\n개인 참가: ${policy.allowSolo ? "가능" : "불가"}`;
  }

  if (msg.includes("상금") || msg.includes("prize") || msg.includes("상")) {
    const prizes = data?.sections?.prize?.items ?? [];
    if (prizes.length === 0) return "상금 정보를 찾을 수 없습니다.";
    const total = data?.sections?.prize?.totalKRW;
    const lines = prizes.map((p: any) => `• ${p.place}: ${p.amountKRW.toLocaleString()}원`).join("\n");
    return total ? `총 상금: ${total.toLocaleString()}원\n\n${lines}` : lines;
  }

  if (msg.includes("제출") || msg.includes("submit")) {
    const guides = data?.sections?.submit?.guide ?? [];
    if (guides.length === 0) return "제출 가이드를 찾을 수 없습니다.";
    return guides.map((g: string, i: number) => `${i + 1}. ${g}`).join("\n");
  }

  if (msg.includes("평가") || msg.includes("점수") || msg.includes("기준") || msg.includes("채점")) {
    const criteria = data?.sections?.eval?.evalCriteria ?? [];
    if (criteria.length > 0) {
      return criteria.map((c: any) => `• ${c.category} (${c.points}점): ${c.description}`).join("\n");
    }
    return data?.sections?.eval?.description ?? "평가 기준 정보를 찾을 수 없습니다.";
  }

  if (msg.includes("주의") || msg.includes("공지") || msg.includes("notice")) {
    const notices = data?.sections?.info?.notice ?? [];
    if (notices.length === 0) return "주의사항 정보를 찾을 수 없습니다.";
    return notices.map((n: string, i: number) => `${i + 1}. ${n}`).join("\n");
  }

  if (msg.includes("소개") || msg.includes("개요") || msg.includes("overview")) {
    return data?.sections?.overview?.summary ?? "개요 정보를 찾을 수 없습니다.";
  }

  return "해당 질문에 대한 정보를 명세에서 찾지 못했습니다. 일정, 상금, 팀 구성, 평가 기준, 제출 방법 등에 대해 질문해보세요!";
}

export async function POST(req: Request) {
  try {
    const { message, hackathonSlug, hackathonData } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      const fallbackAnswer = generateFallbackAnswer(message, hackathonData);
      return NextResponse.json({ reply: fallbackAnswer });
    }

    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `너는 "${hackathonData?.title ?? hackathonSlug}" 해커톤의 AI 안내 도우미야.
아래 해커톤 데이터를 기반으로 참가자 질문에 정확하게 한국어로 답변해.
데이터에 없는 정보는 "해당 정보는 제공된 명세에 포함되어 있지 않습니다"라고 답변.
간결하고 친절하게 답변해.

해커톤 데이터:
${JSON.stringify(hackathonData, null, 2)}`,
        },
        { role: "user", content: message },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return NextResponse.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { reply: "오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
