-- TimeLens DB スキーマ

-- プロジェクト
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text not null default '#3B82F6',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- タスクカテゴリ（デザイン、コーディング、MTG など）
create table if not exists task_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text,
  color text not null default '#6B7280',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- 時間記録
create table if not exists time_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  category_id uuid not null references task_categories(id),
  sub_task text,
  started_at timestamptz not null,
  ended_at timestamptz,
  duration_seconds integer,
  note text,
  created_at timestamptz not null default now()
);

-- インデックス
create index if not exists idx_time_entries_project_id on time_entries(project_id);
create index if not exists idx_time_entries_started_at on time_entries(started_at desc);
create index if not exists idx_time_entries_ended_at on time_entries(ended_at);

-- サンプルデータ
insert into task_categories (name, icon, color, sort_order) values
  ('コーディング', '💻', '#3B82F6', 1),
  ('デザイン', '🎨', '#8B5CF6', 2),
  ('MTG', '🤝', '#10B981', 3),
  ('企画・設計', '📐', '#F59E0B', 4),
  ('リサーチ', '🔍', '#EC4899', 5),
  ('ライティング', '✍️', '#14B8A6', 6),
  ('その他', '📦', '#6B7280', 7)
on conflict do nothing;
