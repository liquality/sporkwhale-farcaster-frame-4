-- Create sql db
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    wallet_address VARCHAR(255),
    channel VARCHAR(255),
    fid VARCHAR(255)
);

CREATE TABLE questions (
    question_id SERIAL PRIMARY KEY,
    question VARCHAR(255)
);

CREATE TABLE user_question_responses (
    question_response_id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(question_id),
    user_id INTEGER REFERENCES users(user_id),
    correct_response BOOLEAN,
    response VARCHAR(255)
);

CREATE TABLE trait_displayed (
    trait_response_id SERIAL PRIMARY KEY,
    trait VARCHAR(255),
    channel VARCHAR(255)
);

--IF YOU WANT TO DROP:
DROP TABLE IF EXISTS user_question_responses CASCADE;

DROP TABLE IF EXISTS trait_displayed CASCADE;

DROP TABLE IF EXISTS questions CASCADE;

DROP TABLE IF EXISTS users CASCADE;