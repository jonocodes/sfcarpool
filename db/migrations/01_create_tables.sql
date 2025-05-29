
-- psql "postgresql://postgres:password@localhost:65432/electric" -f db/migrations/01_create_accounts.sql



-- needed for uuid generation
CREATE extension IF NOT EXISTS pgcrypto;
-- locations definition
-- Drop table
-- DROP TABLE locations;
CREATE TABLE locations (
    id serial4 NOT NULL,
    "uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
    "name" text NOT NULL,
    constraint locations_pkey primary key (id)
);
ALTER TABLE
    locations ENABLE ELECTRIC;
-- events definition
    -- Drop table
    -- DROP TABLE events;
    CREATE TABLE events (
        id serial4 NOT NULL,
        "uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
        created_at timestamptz DEFAULT now() NOT NULL,
        updated_at timestamptz DEFAULT now() NOT NULL,
        "date" DATE NOT NULL,
        passenger bool NOT NULL,
        likelihood int4 NOT NULL,
        active bool DEFAULT TRUE NOT NULL,
        location_id int4 NOT NULL,
        "label" text NULL,
        "start" TIME NOT NULL,
        "end" TIME NOT NULL,
        constraint events_pkey primary key (id)
    );
ALTER TABLE
    events ENABLE ELECTRIC;
-- Table Triggers
    -- CREATE TRIGGER audit_trigger_row after
    -- INSERT
    --     OR
    -- DELETE
    --     OR
    -- UPDATE
    --     ON events for each ROW EXECUTE FUNCTION audit.if_modified_func('true');
    -- CREATE TRIGGER audit_trigger_stm after TRUNCATE
    --     ON events for each statement EXECUTE FUNCTION audit.if_modified_func('true');
    -- CREATE TRIGGER set_public_events_updated_at before
    -- UPDATE
    --     ON events for each ROW EXECUTE FUNCTION set_current_timestamp_updated_at();
    -- events foreign keys
ALTER TABLE
    events
ADD
    constraint events_location_id_fkey foreign key (location_id) references locations(id)
    ON
DELETE
    restrict
    ON
UPDATE
    restrict;
INSERT INTO
    locations (
        uuid,
        NAME
    )
VALUES
    (
        'dd982b3d-70d2-4f47-912b-2ea3a5ef8115' :: uuid,
        'North Berkeley BART -> SF Financial District'
    ),
    (
        'fe4b4a8a-bbcc-456a-a072-1f679e116b6e' :: uuid,
        'North Berkeley BART -> SF Civic Center'
    ),
    (
        '4a00348f-2428-4d46-afb4-0a7bdc5975f5' :: uuid,
        'Encinal Ave & Park Ave -> SF Financial District'
    ),
    (
        '5577489d-11dc-4c4b-8025-441d8337dff1' :: uuid,
        'Webster St & Santa Clara Ave -> SF Financial District'
    ),
    (
        'c3371402-0298-4311-8c07-fb7963357b29' :: uuid,
        'Buchanan & I-80 -> SF Financial District'
    ),
    (
        'b1f77d71-a3d0-474f-b2ca-f9ee37c32c49' :: uuid,
        'Del Norte BART -> SF Financial District'
    ),
    (
        '25688b7e-9ec7-49e1-a87e-2f16ee605920' :: uuid,
        'Marina -> SF Financial District'
    ),
    (
        '70bcf130-adb2-40ff-a5c6-2f0214bac731' :: uuid,
        'Fairfield Transportation Center -> SF Financial District'
    ),
    (
        '4c8c6c1d-ea33-48e3-8ab0-87f678da129c' :: uuid,
        'Hercules Transit Center -> SF Financial District'
    ),
    (
        '6223e8dd-a776-4073-b69a-ed5f4c4131ef' :: uuid,
        'Lafayette BART -> SF Financial District'
    );
INSERT INTO
    locations (
        uuid,
        NAME
    )
VALUES
    (
        'bcb4dca0-8bac-4234-8cd1-b8350efede12' :: uuid,
        'Moraga -> SF Financial District'
    ),
    (
        '23a9e886-1d85-4e97-be90-dacf2df28b87' :: uuid,
        'Grand Ave & Perkins St -> SF Financial District'
    ),
    (
        '8d75c681-af8f-4405-b625-93ea9210faaf' :: uuid,
        'Park Blvd & Hollywood Ave -> SF Financial District'
    ),
    (
        'ed039119-90ab-48a8-9281-78e82b16eb11' :: uuid,
        'Park Blvd at Hampel St -> SF Financial District'
    ),
    (
        '184e4847-6a55-471d-8bb5-e7364fe593c6' :: uuid,
        'Grand Ave & Lakeshore Ave -> SF Financial District'
    ),
    (
        '1d18d9b6-85ce-49a3-a7f4-9c257923f59e' :: uuid,
        'MacArthur Blvd & High St -> SF Financial District'
    ),
    (
        '4d61405a-23d4-4497-8742-c3b7c37aa144' :: uuid,
        'Fruitvale Ave & Montana St -> SF Financial District'
    ),
    (
        'd7ed1a19-77bd-4b82-b4ab-17b9d937d676' :: uuid,
        'Oakland Ave & Monte Vista Ave -> SF Financial District'
    );
