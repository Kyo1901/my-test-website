-- ================================================================
-- Roundit 커뮤니티 - DB 마이그레이션
-- Supabase Dashboard > SQL Editor에서 실행
-- ================================================================

-- roundit_users 테이블 (Supabase Auth와 연동)
CREATE TABLE IF NOT EXISTS roundit_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  profile_img TEXT,
  karma INTEGER DEFAULT 0,
  theme TEXT DEFAULT 'light',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- roundit_boards 테이블
CREATE TABLE IF NOT EXISTS roundit_boards (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_img TEXT,
  created_by UUID REFERENCES roundit_users(id) ON DELETE SET NULL,
  member_cnt INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- roundit_posts 테이블
CREATE TABLE IF NOT EXISTS roundit_posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  post_type TEXT DEFAULT 'text' CHECK (post_type IN ('text', 'image', 'link')),
  image_url TEXT,
  link_url TEXT,
  flair TEXT,
  author_id UUID REFERENCES roundit_users(id) ON DELETE SET NULL,
  board_id BIGINT REFERENCES roundit_boards(id) ON DELETE CASCADE,
  vote_score INTEGER DEFAULT 0,
  comment_cnt INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- roundit_comments 테이블
CREATE TABLE IF NOT EXISTS roundit_comments (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  author_id UUID REFERENCES roundit_users(id) ON DELETE SET NULL,
  post_id BIGINT REFERENCES roundit_posts(id) ON DELETE CASCADE,
  parent_id BIGINT REFERENCES roundit_comments(id) ON DELETE CASCADE,
  vote_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- roundit_votes 테이블
CREATE TABLE IF NOT EXISTS roundit_votes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES roundit_users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment')),
  target_id BIGINT NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

-- roundit_bookmarks 테이블
CREATE TABLE IF NOT EXISTS roundit_bookmarks (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES roundit_users(id) ON DELETE CASCADE,
  post_id BIGINT REFERENCES roundit_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- roundit_board_members 테이블
CREATE TABLE IF NOT EXISTS roundit_board_members (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES roundit_users(id) ON DELETE CASCADE,
  board_id BIGINT REFERENCES roundit_boards(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, board_id)
);

-- ================================================================
-- RLS (Row Level Security) 정책 설정
-- ================================================================

-- roundit_users RLS
ALTER TABLE roundit_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles" ON roundit_users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON roundit_users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON roundit_users FOR INSERT WITH CHECK (auth.uid() = id);

-- roundit_boards RLS
ALTER TABLE roundit_boards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view boards" ON roundit_boards FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create boards" ON roundit_boards FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Board creator can update" ON roundit_boards FOR UPDATE USING (auth.uid() = created_by);

-- roundit_posts RLS
ALTER TABLE roundit_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view posts" ON roundit_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON roundit_posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Post author can update" ON roundit_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Post author can delete" ON roundit_posts FOR DELETE USING (auth.uid() = author_id);

-- roundit_comments RLS
ALTER TABLE roundit_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view comments" ON roundit_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON roundit_comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Comment author can update" ON roundit_comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Comment author can delete" ON roundit_comments FOR DELETE USING (auth.uid() = author_id);

-- roundit_votes RLS
ALTER TABLE roundit_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view votes" ON roundit_votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can vote" ON roundit_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own votes" ON roundit_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own votes" ON roundit_votes FOR DELETE USING (auth.uid() = user_id);

-- roundit_bookmarks RLS
ALTER TABLE roundit_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookmarks" ON roundit_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookmarks" ON roundit_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON roundit_bookmarks FOR DELETE USING (auth.uid() = user_id);

-- roundit_board_members RLS
ALTER TABLE roundit_board_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view members" ON roundit_board_members FOR SELECT USING (true);
CREATE POLICY "Users can join boards" ON roundit_board_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave boards" ON roundit_board_members FOR DELETE USING (auth.uid() = user_id);

-- ================================================================
-- 기본 게시판 데이터 삽입 (익명 사용자용)
-- ================================================================
-- 주의: 아래 INSERT는 roundit_users에 먼저 사용자가 있어야 함
-- 초기 게시판은 Supabase Dashboard에서 수동으로 추가하거나
-- 앱에서 로그인 후 생성 가능

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- roundit_posts updated_at 트리거
CREATE TRIGGER update_roundit_posts_updated_at
  BEFORE UPDATE ON roundit_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- roundit_comments updated_at 트리거
CREATE TRIGGER update_roundit_comments_updated_at
  BEFORE UPDATE ON roundit_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
