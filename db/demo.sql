INSERT INTO
    PUBLIC.events (
        "uuid",
        created_at,
        updated_at,
        "date",
        passenger,
        likelihood,
        active,
        location_id,
        "label",
        "start",
        "end"
    )
VALUES
    (
        'b87edcda-e5f6-4abf-9bab-4e0342853a35' :: uuid,
        '2025-05-28 15:07:52.810788-07',
        '2025-05-28 15:07:52.810788-07',
        '2025-05-27',
        TRUE,
        87,
        TRUE,
        1,
        'alice',
        '08:00:00',
        '08:15:00'
    ),
    (
        '86b4a689-eecf-4cee-ae13-b4b8485b3bb4' :: uuid,
        '2025-05-28 15:08:49.628995-07',
        '2025-05-28 15:08:49.628995-07',
        '2025-05-27',
        FALSE,
        40,
        TRUE,
        2,
        'bob',
        '08:00:00',
        '08:30:00'
    );
