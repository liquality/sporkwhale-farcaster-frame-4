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

CREATE TABLE question_responses (
    question_response_id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(question_id),
    user_id INTEGER REFERENCES users(user_id),
    response VARCHAR(255)
);

CREATE TABLE trait_responses (
    trait_response_id SERIAL PRIMARY KEY,
    trait VARCHAR(255),
    user_id INTEGER REFERENCES users(user_id)
);