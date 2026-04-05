import { NextResponse } from "next/server";
import type { Team, UserProfile, TeamMatchResult } from "@/lib/types";

function fallbackMatch(profile: UserProfile, teams: Team[]): TeamMatchResult[] {
  return teams
    .filter((t) => t.isOpen)
    .map((t) => {
      const roleMatch = profile.roles.filter((r) => t.lookingFor.includes(r)).length;
      const totalLooking = t.lookingFor.length;
      const matchRate =
        totalLooking === 0 ? 50 : Math.min(100, Math.round((roleMatch / totalLooking) * 100));

      const matchedRoles = profile.roles.filter((r) => t.lookingFor.includes(r));
      const reason =
        matchedRoles.length > 0
          ? `이 팀은 ${matchedRoles.join(", ")} 포지션을 찾고 있으며, 귀하의 역할과 일치합니다.`
          : `이 팀은 현재 팀원을 모집 중입니다. 팀 소개를 확인하고 지원해보세요.`;

      return {
        teamCode: t.teamCode,
        teamName: t.name,
        matchRate,
        reason,
      };
    })
    .sort((a, b) => b.matchRate - a.matchRate)
    .slice(0, 5);
}

export async function POST(req: Request) {
  try {
    const { profile, teams } = await req.json() as { profile: UserProfile; teams: Team[] };

    if (!process.env.OPENAI_API_KEY) {
      const results = fallbackMatch(profile, teams);
      return NextResponse.json({ results });
    }

    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const openTeams = teams.filter((t) => t.isOpen);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `너는 해커톤 팀 매칭 AI야. 사용자 프로필과 팀 목록을 분석해서 최적의 팀을 추천해줘.
응답은 반드시 JSON 배열로만 해: [{"teamCode":"...","teamName":"...","matchRate":숫자,"reason":"한국어 설명"}]
matchRate는 0-100 사이 정수. reason은 왜 이 팀이 매칭되는지 한국어로 2-3문장으로 설명.`,
        },
        {
          role: "user",
          content: `사용자 프로필:\n${JSON.stringify(profile, null, 2)}\n\n팀 목록:\n${JSON.stringify(openTeams, null, 2)}`,
        },
      ],
      max_tokens: 1000,
      temperature: 0.5,
    });

    const content = completion.choices[0].message.content ?? "[]";
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const results: TeamMatchResult[] = jsonMatch ? JSON.parse(jsonMatch[0]) : fallbackMatch(profile, teams);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Team match API error:", error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
