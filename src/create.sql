-- Create sql db
CREATE TABLE channel (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    followers INTEGER
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    wallet_address VARCHAR(255),
    fid INTEGER
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    question VARCHAR(255)
);

CREATE TABLE user_question_responses (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    correct_response BOOLEAN,
    response VARCHAR(255),
    channel_id INTEGER REFERENCES channel(id) ON DELETE CASCADE
);

CREATE TABLE trait_displayed (
    id SERIAL PRIMARY KEY,
    trait VARCHAR(255),
    channel_id INTEGER REFERENCES channel(id) ON DELETE CASCADE
);

--IF YOU WANT TO DROP:
DROP TABLE IF EXISTS user_question_responses CASCADE;

DROP TABLE IF EXISTS trait_displayed CASCADE;

DROP TABLE IF EXISTS questions CASCADE;

DROP TABLE IF EXISTS users CASCADE;

DROP TABLE IF EXISTS channel CASCADE;

--Tester data
INSERT INTO
    questions (question)
VALUES
    ('What is Johanna''s last name?');

INSERT INTO
    channel (name, followers)
VALUES
    ('cryptostocks', 230);

INSERT INTO
    trait_displayed (trait, channel_id)
VALUES
    (
        'glasses_bracelet_chain_bathingSuit_whale.png',
        2
    );