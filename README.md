# AI 요청 게시판

부서별 AI 활용 요청을 익명으로 등록하고 공유하는 Next.js 웹사이트입니다.

## 주요 기능

- 초기 안내 팝업과 요청 작성 폼
- 팀명, 제목, 내용을 통한 익명 요청 등록
- Supabase에 저장되는 요청 목록과 상세 보기
- 카드/리스트 보기 전환 및 3개 단위 페이지 이동

## 로컬 실행

```bash
npm install
npm run dev
```

## 환경 변수

`.env.example`을 참고해 프로젝트 루트에 `.env.local`을 만들고 Supabase 연결 정보를 설정합니다.

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key
```

데이터베이스 테이블과 RLS 정책은 `supabase/requests.sql`을 Supabase SQL Editor에서 실행해 설정합니다.
