# Supabase 연결 절차

1. Supabase Dashboard의 **SQL Editor**에서 `supabase/requests.sql` 내용을 실행합니다.
2. **Project Settings → API → Data API**에서 `public` 스키마를 노출합니다. (신규 테이블은 Data API에 자동 노출되지 않을 수 있습니다.)
3. `.env.example`을 복사해 프로젝트 루트에 `.env.local`을 만들고 아래 두 값을 채웁니다.

   ```env
   SUPABASE_URL=https://<project-ref>.supabase.co
   SUPABASE_PUBLISHABLE_KEY=<publishable_key>
   ```

   이 게시판은 공개 읽기·익명 등록을 RLS 정책으로 허용하므로 publishable 키를 사용합니다. 개인 정보나 비공개 게시글을 다루게 되면 인증과 별도 정책을 추가해야 합니다.

4. 개발 서버를 재시작합니다. 이후 새 요청은 `public.ai_requests`에 저장되고, 페이지를 새로 열면 저장된 요청을 다시 불러옵니다.
