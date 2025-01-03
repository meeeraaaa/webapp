--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: Difficulty; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Difficulty" AS ENUM (
    'Easy',
    'Medium',
    'Hard'
);


ALTER TYPE public."Difficulty" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'admin',
    'employee'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- Name: Sex; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Sex" AS ENUM (
    'm',
    'f'
);


ALTER TYPE public."Sex" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Course; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Course" (
    id integer NOT NULL,
    title text NOT NULL,
    difficulty_level public."Difficulty" NOT NULL,
    no_of_chapters integer NOT NULL,
    duration double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Course" OWNER TO postgres;

--
-- Name: CourseSkill; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CourseSkill" (
    id integer NOT NULL,
    "courseId" integer NOT NULL,
    "skillId" integer NOT NULL
);


ALTER TABLE public."CourseSkill" OWNER TO postgres;

--
-- Name: CourseSkill_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CourseSkill_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CourseSkill_id_seq" OWNER TO postgres;

--
-- Name: CourseSkill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CourseSkill_id_seq" OWNED BY public."CourseSkill".id;


--
-- Name: Course_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Course_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Course_id_seq" OWNER TO postgres;

--
-- Name: Course_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Course_id_seq" OWNED BY public."Course".id;


--
-- Name: Designation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Designation" (
    id integer NOT NULL,
    title text NOT NULL
);


ALTER TABLE public."Designation" OWNER TO postgres;

--
-- Name: DesignationSkill; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DesignationSkill" (
    id integer NOT NULL,
    "designationId" integer NOT NULL,
    "skillId" integer NOT NULL
);


ALTER TABLE public."DesignationSkill" OWNER TO postgres;

--
-- Name: DesignationSkill_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."DesignationSkill_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DesignationSkill_id_seq" OWNER TO postgres;

--
-- Name: DesignationSkill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."DesignationSkill_id_seq" OWNED BY public."DesignationSkill".id;


--
-- Name: Designation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Designation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Designation_id_seq" OWNER TO postgres;

--
-- Name: Designation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Designation_id_seq" OWNED BY public."Designation".id;


--
-- Name: Progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Progress" (
    id integer NOT NULL,
    "courseId" integer NOT NULL,
    "userId" integer NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    chapters_completed integer NOT NULL,
    percentage_completed double precision NOT NULL,
    certificate text
);


ALTER TABLE public."Progress" OWNER TO postgres;

--
-- Name: Progress_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Progress_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Progress_id_seq" OWNER TO postgres;

--
-- Name: Progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Progress_id_seq" OWNED BY public."Progress".id;


--
-- Name: Skill; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Skill" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Skill" OWNER TO postgres;

--
-- Name: Skill_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Skill_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Skill_id_seq" OWNER TO postgres;

--
-- Name: Skill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Skill_id_seq" OWNED BY public."Skill".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    name text NOT NULL,
    mail text NOT NULL,
    role public."Role" NOT NULL,
    "designationId" integer NOT NULL,
    sex public."Sex" NOT NULL,
    experience integer NOT NULL,
    joindate timestamp(3) without time zone NOT NULL,
    "Hashedpassword" text NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: UserSkill; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserSkill" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "skillId" integer NOT NULL
);


ALTER TABLE public."UserSkill" OWNER TO postgres;

--
-- Name: UserSkill_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."UserSkill_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserSkill_id_seq" OWNER TO postgres;

--
-- Name: UserSkill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."UserSkill_id_seq" OWNED BY public."UserSkill".id;


--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Course id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Course" ALTER COLUMN id SET DEFAULT nextval('public."Course_id_seq"'::regclass);


--
-- Name: CourseSkill id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CourseSkill" ALTER COLUMN id SET DEFAULT nextval('public."CourseSkill_id_seq"'::regclass);


--
-- Name: Designation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Designation" ALTER COLUMN id SET DEFAULT nextval('public."Designation_id_seq"'::regclass);


--
-- Name: DesignationSkill id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DesignationSkill" ALTER COLUMN id SET DEFAULT nextval('public."DesignationSkill_id_seq"'::regclass);


--
-- Name: Progress id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Progress" ALTER COLUMN id SET DEFAULT nextval('public."Progress_id_seq"'::regclass);


--
-- Name: Skill id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Skill" ALTER COLUMN id SET DEFAULT nextval('public."Skill_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: UserSkill id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserSkill" ALTER COLUMN id SET DEFAULT nextval('public."UserSkill_id_seq"'::regclass);


--
-- Data for Name: Course; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Course" (id, title, difficulty_level, no_of_chapters, duration, "createdAt") FROM stdin;
32	Data Science with Python	Hard	8	25	2024-10-03 07:06:49.338
33	Web Development Basics	Easy	5	15	2024-10-03 07:06:49.341
34	Advanced Java Programming	Hard	6	20	2024-10-03 07:06:49.343
35	Introduction to SQL	Easy	4	10	2024-10-03 07:06:49.347
31	Full Stack Development	Easy	8	20	2024-10-03 07:06:49.332
36	Java Swing	Easy	4	3.5	2024-10-04 14:25:11.692
\.


--
-- Data for Name: CourseSkill; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CourseSkill" (id, "courseId", "skillId") FROM stdin;
301	31	61
302	31	62
303	31	63
304	31	64
305	31	65
306	31	66
307	31	67
308	31	68
309	31	69
310	31	70
311	32	61
312	32	62
313	32	63
314	32	64
315	32	65
316	32	66
317	32	67
318	32	68
319	32	69
320	32	70
321	33	61
322	33	62
323	33	63
324	33	64
325	33	65
326	33	66
327	33	67
328	33	68
329	33	69
330	33	70
331	34	61
332	34	62
333	34	63
334	34	64
335	34	65
336	34	66
337	34	67
338	34	68
339	34	69
340	34	70
341	35	61
342	35	62
343	35	63
344	35	64
345	35	65
346	35	66
347	35	67
348	35	68
349	35	69
350	35	70
351	36	67
352	36	66
353	36	63
\.


--
-- Data for Name: Designation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Designation" (id, title) FROM stdin;
31	SDE
32	SDE2
33	Enabler
34	Consultant
35	Architect
\.


--
-- Data for Name: DesignationSkill; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DesignationSkill" (id, "designationId", "skillId") FROM stdin;
301	31	61
302	31	62
303	31	63
304	31	64
305	31	65
306	31	66
307	31	67
308	31	68
309	31	69
310	31	70
311	32	61
312	32	62
313	32	63
314	32	64
315	32	65
316	32	66
317	32	67
318	32	68
319	32	69
320	32	70
321	33	61
322	33	62
323	33	63
324	33	64
325	33	65
326	33	66
327	33	67
328	33	68
329	33	69
330	33	70
331	34	61
332	34	62
333	34	63
334	34	64
335	34	65
336	34	66
337	34	67
338	34	68
339	34	69
340	34	70
341	35	61
342	35	62
343	35	63
344	35	64
345	35	65
346	35	66
347	35	67
348	35	68
349	35	69
350	35	70
\.


--
-- Data for Name: Progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Progress" (id, "courseId", "userId", "updatedAt", chapters_completed, percentage_completed, certificate) FROM stdin;
1	35	18	2024-10-03 07:11:54.311	4	100	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9RL32F8U1YP9Sm9zeAUSpEWYsMJVItkdidA&s
4	33	21	2024-10-03 07:40:26.358	0	0	\N
6	33	21	2024-10-03 07:43:03.63	3	60	\N
7	33	21	2024-10-03 07:44:09.691	5	100	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9RL32F8U1YP9Sm9zeAUSpEWYsMJVItkdidA&s
8	32	21	2024-10-04 04:01:36.895	0	0	\N
9	32	21	2024-10-04 05:39:06.905	1	12.5	\N
10	32	21	2024-10-04 06:21:02.571	2	25	\N
11	32	21	2024-10-04 06:21:04.067	3	37.5	\N
12	32	21	2024-10-04 08:26:51.047	4	50	\N
13	32	21	2024-10-04 08:26:51.974	5	62.5	\N
14	32	21	2024-10-04 08:26:52.997	6	75	\N
15	32	21	2024-10-04 08:26:54.966	7	87.5	\N
16	32	21	2024-10-04 09:03:47.518	8	100	\N
17	32	21	2024-10-04 09:03:48.173	8	100	\N
18	32	21	2024-10-04 09:03:50.462	8	100	\N
19	32	21	2024-10-04 09:03:51.606	8	100	\N
20	32	21	2024-10-04 09:03:51.981	8	100	\N
21	32	21	2024-10-04 09:03:52.429	8	100	\N
22	32	21	2024-10-04 09:03:53.047	8	100	\N
23	32	21	2024-10-04 09:03:53.469	8	100	\N
24	32	19	2024-10-05 11:28:26.867	0	0	\N
25	34	19	2024-10-06 04:54:26.996	0	0	\N
26	31	20	2024-10-06 11:24:17.587	0	0	\N
27	31	20	2024-10-06 11:24:43.162	1	12.5	\N
28	31	20	2024-10-06 11:27:33.551	2	25	\N
29	31	20	2024-10-06 11:27:34.547	3	37.5	\N
30	31	20	2024-10-06 11:27:35.138	4	50	\N
31	31	20	2024-10-06 11:27:35.698	5	62.5	\N
32	31	20	2024-10-06 11:27:36.164	6	75	\N
33	31	20	2024-10-06 11:27:36.602	7	87.5	\N
34	31	20	2024-10-06 11:27:37.098	8	100	\N
35	31	20	2024-10-06 11:27:37.961	8	100	\N
36	35	20	2024-10-06 11:41:42.466	0	0	\N
37	35	20	2024-10-06 11:41:54.924	4	100	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9RL32F8U1YP9Sm9zeAUSpEWYsMJVItkdidA&s
\.


--
-- Data for Name: Skill; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Skill" (id, name) FROM stdin;
61	JavaScript
62	Python
63	Java
64	C#
65	SQL
66	HTML
67	CSS
68	React
69	Node.js
70	Django
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, mail, role, "designationId", sex, experience, joindate, "Hashedpassword") FROM stdin;
17	admin	adminnnn@jmangroup.com	admin	35	f	14	2010-01-01 00:00:00	$2a$10$1WGo8UWxl5lC.IbL4YujfO3afEQG65SX14azKZQUnVvy7yHV3EZfK
18	purnima	purnima@jmangroup.com	employee	33	f	4	2024-10-03 07:06:49.678	$2a$10$1WGo8UWxl5lC.IbL4YujfO3afEQG65SX14azKZQUnVvy7yHV3EZfK
19	harsh	harsh@jmangroup.com	employee	32	m	4	2024-10-03 07:06:49.682	$2a$10$1WGo8UWxl5lC.IbL4YujfO3afEQG65SX14azKZQUnVvy7yHV3EZfK
20	aishwarya	aishwarya@jmangroup.com	employee	35	f	12	2024-10-03 07:06:49.685	$2a$10$1WGo8UWxl5lC.IbL4YujfO3afEQG65SX14azKZQUnVvy7yHV3EZfK
21	ashwin	ashwin@jmangroup.com	employee	31	m	3	2024-10-03 07:06:49.687	$2a$10$1WGo8UWxl5lC.IbL4YujfO3afEQG65SX14azKZQUnVvy7yHV3EZfK
23	ishita	ishita@jmangroup.com	employee	33	f	4	2024-10-06 05:05:09.594	$2b$10$TkgJaF9lOPAlSQ3GgISfMu0ybgwiLlm38w3Z6ROEiJoxLdo58ZfCW
27	ishant	ishant@jmangroup.com	employee	35	m	7	2024-10-06 05:20:09.692	$2b$10$R/TDS2/WpvEuuy33528wGObuQ5DEF02vUVU0VQzpd.yma5sVzZrLe
\.


--
-- Data for Name: UserSkill; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserSkill" (id, "userId", "skillId") FROM stdin;
1	20	61
2	20	62
3	20	63
4	20	64
5	20	65
6	20	66
7	20	67
8	20	68
9	20	69
10	20	70
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
e0f6f83c-55cc-4156-bc28-ff34a48745bc	e6a5f10891ed99dee090d04bb8bb393899c8bae1ad71facf1185bd5dbac0ba1f	2024-10-03 11:33:23.939264+05:30	20240930104240_init	\N	\N	2024-10-03 11:33:23.877973+05:30	1
107ec4db-6c94-4ee2-aa3b-1218040e6fa8	1737fc0678a09dd5b9c707d03966248ef912a5b26e692a7692da3c72354bfebb	2024-10-03 11:33:23.945377+05:30	20240930123245_init	\N	\N	2024-10-03 11:33:23.940748+05:30	1
774cb097-8fd1-41a2-84e5-6b38ae90e95d	67bc5e68759765861850f5baa56bd827f9c799d4151b87fff6d5455980a86c3f	2024-10-03 11:33:23.952251+05:30	20241003042624_init	\N	\N	2024-10-03 11:33:23.946781+05:30	1
d4a32ba4-1cae-4eab-ad5c-c8141dbca8d9	f65fb3787aba6d046208a9c6089b406ac13197758570ff2f856b97eddca73b02	2024-10-03 11:33:23.959029+05:30	20241003042729_init	\N	\N	2024-10-03 11:33:23.953339+05:30	1
c67aed33-c3ec-4ec4-a769-f38d1e8a0711	465f9bda88782b75bda111f259f69703f06966e74399c1ffe0fb978a4d4b1a73	2024-10-03 11:33:23.965714+05:30	20241003042859_init	\N	\N	2024-10-03 11:33:23.960646+05:30	1
c796be28-dd80-450f-8bf0-8c531cb84869	b0295b4820b31eb1c1c6d4f87d0019ab812ac282358a8d0c86c7c56c944cf3cf	2024-10-03 11:33:23.971609+05:30	20241003055907_add_unique_constraint	\N	\N	2024-10-03 11:33:23.966941+05:30	1
d1ba500e-279a-4b04-bb96-3b1801168543	e539a590c7713967cde264c18c15a67c61c65fff328657bf0c0b9994cf51f53f	2024-10-03 13:11:53.870478+05:30	20241003074153_init	\N	\N	2024-10-03 13:11:53.859254+05:30	1
\.


--
-- Name: CourseSkill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CourseSkill_id_seq"', 353, true);


--
-- Name: Course_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Course_id_seq"', 36, true);


--
-- Name: DesignationSkill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DesignationSkill_id_seq"', 350, true);


--
-- Name: Designation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Designation_id_seq"', 35, true);


--
-- Name: Progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Progress_id_seq"', 37, true);


--
-- Name: Skill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Skill_id_seq"', 70, true);


--
-- Name: UserSkill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."UserSkill_id_seq"', 10, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 27, true);


--
-- Name: CourseSkill CourseSkill_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CourseSkill"
    ADD CONSTRAINT "CourseSkill_pkey" PRIMARY KEY (id);


--
-- Name: Course Course_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_pkey" PRIMARY KEY (id);


--
-- Name: DesignationSkill DesignationSkill_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DesignationSkill"
    ADD CONSTRAINT "DesignationSkill_pkey" PRIMARY KEY (id);


--
-- Name: Designation Designation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Designation"
    ADD CONSTRAINT "Designation_pkey" PRIMARY KEY (id);


--
-- Name: Progress Progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Progress"
    ADD CONSTRAINT "Progress_pkey" PRIMARY KEY (id);


--
-- Name: Skill Skill_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Skill"
    ADD CONSTRAINT "Skill_pkey" PRIMARY KEY (id);


--
-- Name: UserSkill UserSkill_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserSkill"
    ADD CONSTRAINT "UserSkill_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Course_title_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Course_title_key" ON public."Course" USING btree (title);


--
-- Name: Designation_title_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Designation_title_key" ON public."Designation" USING btree (title);


--
-- Name: Skill_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Skill_name_key" ON public."Skill" USING btree (name);


--
-- Name: User_mail_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_mail_key" ON public."User" USING btree (mail);


--
-- Name: CourseSkill CourseSkill_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CourseSkill"
    ADD CONSTRAINT "CourseSkill_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CourseSkill CourseSkill_skillId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CourseSkill"
    ADD CONSTRAINT "CourseSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES public."Skill"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DesignationSkill DesignationSkill_designationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DesignationSkill"
    ADD CONSTRAINT "DesignationSkill_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES public."Designation"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DesignationSkill DesignationSkill_skillId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DesignationSkill"
    ADD CONSTRAINT "DesignationSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES public."Skill"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Progress Progress_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Progress"
    ADD CONSTRAINT "Progress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Progress Progress_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Progress"
    ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserSkill UserSkill_skillId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserSkill"
    ADD CONSTRAINT "UserSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES public."Skill"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserSkill UserSkill_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserSkill"
    ADD CONSTRAINT "UserSkill_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_designationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES public."Designation"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

