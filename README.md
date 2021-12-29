This project is a question web site done for the course web software development
in Aalto University.

App can be used on site https://wsd-2.herokuapp.com/

When using locally use the command 'deno run --allow-all --unstable
run-locally.js'. Deno should be installed to run this locally.

Before trying this application locally add these tables and index to your
postgres. Also remember to add your database information to database/database.js

CREATE TABLE users ( id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE, password
CHAR(60) );

CREATE TABLE questions ( id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES
users(id), title VARCHAR(256) NOT NULL, question_text TEXT NOT NULL );

CREATE TABLE question_answer_options ( id SERIAL PRIMARY KEY, question_id
INTEGER REFERENCES questions(id), option_text TEXT NOT NULL, is_correct BOOLEAN
DEFAULT false );

CREATE TABLE question_answers ( id SERIAL PRIMARY KEY, user_id INTEGER
REFERENCES users(id), question_id INTEGER REFERENCES questions(id),
question_answer_option_id INTEGER REFERENCES question_answer_options(id),
correct BOOLEAN DEFAULT false );

CREATE UNIQUE INDEX ON users((lower(email))); Tests can be used with command:
deno test --allow-all --unstable
