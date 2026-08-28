import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const limits = { team: 40, title: 100, content: 1000 };

function validate(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const input = body as Record<string, unknown>;
  const team = typeof input.team === "string" ? input.team.trim() : "";
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const content = typeof input.content === "string" ? input.content.trim() : "";

  if (!team || !title || !content || team.length > limits.team || title.length > limits.title || content.length > limits.content) {
    return null;
  }
  return { team, title, content };
}

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("ai_requests")
      .select("id, team, title, content, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ posts: data });
  } catch (error) {
    console.error("Failed to load AI requests", error);
    return NextResponse.json({ message: "요청 목록을 불러오지 못했습니다." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const input = validate(await request.json().catch(() => null));
  if (!input) {
    return NextResponse.json({ message: "팀명, 제목, 내용을 확인해 주세요." }, { status: 400 });
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("ai_requests")
      .insert(input)
      .select("id, team, title, content, created_at")
      .single();

    if (error) throw error;
    return NextResponse.json({ post: data }, { status: 201 });
  } catch (error) {
    console.error("Failed to create AI request", error);
    return NextResponse.json({ message: "요청을 저장하지 못했습니다." }, { status: 500 });
  }
}
