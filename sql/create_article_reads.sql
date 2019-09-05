create table article_reads (
  id serial primary key,
  visitor_id text not null,
  article_id int not null,
  created_at timestamp default now()
);
create index idx_article_reads_on_visitor_id on article_reads(visitor_id);