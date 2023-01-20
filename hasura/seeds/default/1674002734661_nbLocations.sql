SET check_function_bodies = false;
INSERT INTO public.locations (id, uuid, name) VALUES (1, 'dd982b3d-70d2-4f47-912b-2ea3a5ef8115', 'North Berkeley BART -> SF Financial District');
INSERT INTO public.locations (id, uuid, name) VALUES (2, 'fe4b4a8a-bbcc-456a-a072-1f679e116b6e', 'North Berkeley BART -> SF Civic Center');
SELECT pg_catalog.setval('public.locations_id_seq', 4, true);
