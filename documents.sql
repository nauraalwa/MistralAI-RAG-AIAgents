create table handbook_docs (
    id bigserial primary key,
    content text,
    embedding vector(1024)
);