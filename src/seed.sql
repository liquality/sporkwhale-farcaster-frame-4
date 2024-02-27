INSERT INTO questions (id, question, expires_at, correct_response, options) 
    select 1, 'What is Farcaster’s most frequently used word?', '2024-02-29 10:00:00-00'::timestamp AT TIME ZONE 'MST', 'DEGEN', '["MINT", "ATTACK", "DEGEN", "NFT"]'::json union all
    select 2, 'What is Farcaster’s most followed channel?', '2024-03-01 10:00:00-00'::timestamp AT TIME ZONE 'MST', 'BASE', '["FARCASTER", "BASE", "MEMES", "NOUNS"]'::json union all
    select 3, 'which of the following is NOT yet composable with Airstack''s APIs?', '2024-03-02 10:00:00-00'::timestamp AT TIME ZONE 'MST', 'ARBITRUM', '["FARCASTER", "ZORA", "ARBITRUM", "BASE"]'::json union all
    select 4, 'Which idea contributed significantly to optimistic roll-up DESIGN?', '2024-03-03 10:00:00-00'::timestamp AT TIME ZONE 'MST', 'PLASMA', '["PLASMA", "GPU ACCELERATION", "PROOF OF WORK"]'::json;
    