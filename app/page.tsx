"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";

type RequestPost = {
  id: string;
  team: string;
  title: string;
  content: string;
  createdAt: string;
};

function toPost(record: { id: string; team: string; title: string; content: string; created_at: string }): RequestPost {
  return {
    id: record.id,
    team: record.team,
    title: record.title,
    content: record.content,
    createdAt: new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(record.created_at)),
  };
}

export default function Home() {
  const [posts, setPosts] = useState<RequestPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<RequestPost | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [view, setView] = useState<"card" | "list">("card");
  const [page, setPage] = useState(0);
  const [form, setForm] = useState({ team: "", title: "", content: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const formRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowWelcome(false);
        setSelectedPost(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch("/api/requests", { cache: "no-store" });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.message);
        setPosts(payload.posts.map(toPost));
      } catch (error) {
        setRequestError(error instanceof Error ? error.message : "요청 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
    void loadPosts();
  }, []);

  const openForm = () => {
    setShowWelcome(false);
    window.setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const pageSize = 3;
  const totalPages = Math.ceil(posts.length / pageSize);
  const visiblePosts = posts.slice(page * pageSize, page * pageSize + pageSize);

  const submitRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setRequestError(null);
    try {
      const response = await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message);
      setPosts((current) => [toPost(payload.post), ...current]);
      setPage(0);
      setForm({ team: "", title: "", content: "" });
      setSubmitted(true);
      window.setTimeout(() => setSubmitted(false), 3500);
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "요청을 저장하지 못했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="AI 요청 게시판 처음으로">
          <span aria-hidden="true">▲</span>
          <span>AI 요청 게시판</span>
        </a>
        <button className="pill-button" type="button" onClick={openForm}>요청 남기기</button>
      </header>

      <div id="top" className="container">
        <section className="hero" aria-labelledby="hero-heading">
          <div>
            <p className="eyebrow">AI ENABLEMENT BOARD</p>
            <h1 id="hero-heading">우리 부서에 필요한<br />AI를 이야기해주세요.</h1>
          </div>
          <div className="hero-image-wrap">
            <Image src="/images/ai-hero.png" alt="연결된 AI 네트워크를 표현한 추상 이미지" width={1024} height={1024} priority className="hero-image" />
          </div>
        </section>

        <section className="intro-panel" aria-label="게시판 안내">
          <span className="terminal-prefix">▲</span>
          <div>
            <p>필요한 업무, 반복되는 불편, 떠오르는 아이디어를 남겨주세요.</p>
            <span>작성된 요청은 AI 활용 과제 발굴에만 사용됩니다.</span>
          </div>
        </section>

        <section className="board-section" aria-labelledby="board-heading">
          <div className="section-heading board-heading">
            <div>
              <p className="eyebrow">OPEN REQUESTS</p>
              <h2 id="board-heading">등록된 AI 요청</h2>
            </div>
            <div className="board-actions">
              <span className="post-count">{posts.length} REQUESTS</span>
              <div className="view-toggle" role="group" aria-label="게시글 보기 방식">
                <button type="button" className={view === "card" ? "active" : ""} onClick={() => setView("card")}>카드</button>
                <button type="button" className={view === "list" ? "active" : ""} onClick={() => setView("list")}>리스트</button>
              </div>
            </div>
          </div>
          <div className={view === "card" ? "post-grid" : "post-list"}>
            {isLoading && <p className="post-empty">요청을 불러오는 중입니다…</p>}
            {!isLoading && requestError && posts.length === 0 && <p className="post-empty">{requestError}</p>}
            {!isLoading && !requestError && posts.length === 0 && <p className="post-empty">등록된 AI 요청이 아직 없습니다.</p>}
            {visiblePosts.map((post, index) => (
              <button className={view === "card" ? "post-card" : "post-row"} type="button" key={post.id} onClick={() => setSelectedPost(post)}>
                <span className="post-index">{String(posts.length - (page * pageSize + index)).padStart(2, "0")}</span>
                <span className="post-main"><span className="post-team">{post.team}</span><strong>{post.title}</strong></span>
                <span className="post-date">{post.createdAt}</span>
                <span className="arrow" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <span>{page + 1} / {totalPages}</span>
              <button type="button" className="triangle-next" onClick={() => setPage((current) => (current - 1 + totalPages) % totalPages)} aria-label="이전 요청 3개 보기">◀</button>
              <button type="button" className="triangle-next" onClick={() => setPage((current) => (current + 1) % totalPages)} aria-label="다음 요청 3개 보기">▶</button>
            </div>
          )}
        </section>

        <section className="request-section" ref={formRef} aria-labelledby="request-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">NEW REQUEST</p>
              <h2 id="request-heading">AI 요청 남기기</h2>
            </div>
            <p>개인 정보 없이 팀과 업무의 맥락만 알려주세요.</p>
          </div>

          <form className="request-form" onSubmit={submitRequest}>
            <label>
              <span>TEAM NAME</span>
              <input required maxLength={40} value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })} placeholder="예: 경영지원팀" />
            </label>
            <label>
              <span>TITLE</span>
              <input required maxLength={100} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="어떤 AI 도움이 필요하신가요?" />
            </label>
            <label className="full-width">
              <span>MESSAGE</span>
              <textarea required maxLength={1000} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="현재 겪는 어려움이나 AI로 해결하고 싶은 일을 자유롭게 적어주세요." rows={5} />
            </label>
            <div className="form-footer full-width">
              <span># 익명으로 등록됩니다.</span>
              <button className="primary-button" type="submit" disabled={isSubmitting}>{isSubmitting ? "등록 중…" : "요청 등록하기"} <span aria-hidden="true">↗</span></button>
            </div>
          </form>
          {submitted && <p className="success-message" role="status">✓ 요청이 게시판에 등록되었습니다.</p>}
          {requestError && <p className="error-message" role="alert">{requestError}</p>}
        </section>
      </div>

      {showWelcome && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowWelcome(false)}>
          <section className="welcome-modal" role="dialog" aria-modal="true" aria-labelledby="welcome-title" onMouseDown={(e) => e.stopPropagation()}>
            <button className="close-button" type="button" onClick={() => setShowWelcome(false)} aria-label="안내 닫기">×</button>
            <p className="eyebrow">WELCOME</p>
            <div className="large-mark" aria-hidden="true">▲</div>
            <h2 id="welcome-title">당신의 부서는<br />AI가 필요하신가요?</h2>
            <p>편하게 이야기해주세요!</p>
            <button className="primary-button modal-action" type="button" onClick={openForm}>신청하기 <span aria-hidden="true">↗</span></button>
          </section>
        </div>
      )}

      {selectedPost && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelectedPost(null)}>
          <article className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title" onMouseDown={(e) => e.stopPropagation()}>
            <button className="close-button" type="button" onClick={() => setSelectedPost(null)} aria-label="상세 내용 닫기">×</button>
            <p className="eyebrow">REQUEST DETAIL</p>
            <div className="detail-meta"><span>{selectedPost.team}</span><span>{selectedPost.createdAt}</span></div>
            <h2 id="detail-title">{selectedPost.title}</h2>
            <div className="detail-content"><span className="terminal-prefix">▲</span><p>{selectedPost.content}</p></div>
          </article>
        </div>
      )}
    </main>
  );
}
