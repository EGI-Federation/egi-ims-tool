SET search_path TO slm;

create table interfaces
(
    direction        varchar(5),
    id               bigserial
        primary key,
    description      varchar(2048),
    relevantmaterial varchar(2048),
    interfaceswith   varchar(255)
);

alter table interfaces
    owner to ims;

create table processes
(
    reviewfrequency   integer not null,
    status            integer not null,
    version           serial
        unique,
    changedon         timestamp(6),
    id                bigserial
        primary key,
    nextreview        timestamp(6),
    frequencyunit     varchar(10),
    changedescription varchar(1024),
    goals             varchar(4096),
    scope             varchar(4096),
    contact           varchar(255),
    urldiagram        varchar(255)
);

alter table processes
    owner to ims;

create table process_interfaces
(
    interface_id bigint not null
        constraint fkhtqfio2svocxmn17rajgkxq5o
            references interfaces,
    process_id   bigint not null
        constraint fkj8uvharrbljiuq5osjagbuuvn
            references processes,
    primary key (interface_id, process_id)
);

alter table process_interfaces
    owner to ims;

create table requirements
(
    id          bigserial
        primary key,
    code        varchar(10),
    source      varchar(1024),
    requirement varchar(2048)
);

alter table requirements
    owner to ims;

create table process_requirements
(
    process_id     bigint not null
        constraint fk4y0k90arly1qubeerlqcco58j
            references processes,
    requirement_id bigint not null
        constraint fka40ogckcmv1u8ebxjfmtl7i88
            references requirements,
    primary key (process_id, requirement_id)
);

alter table process_requirements
    owner to ims;

create table roles
(
    status            integer not null,
    version           integer not null,
    changedon         timestamp(6),
    globalroleid      bigint,
    id                bigserial
        primary key,
    role              varchar(20),
    globalrolename    varchar(50),
    name              varchar(50),
    changedescription varchar(1024),
    globalroletasks   varchar(4096),
    tasks             varchar(4096)
);

alter table roles
    owner to ims;

create table users
(
    checkinuserid bigint
        unique,
    id            bigserial
        primary key,
    email         varchar(255),
    fullname      varchar(255)
);

alter table users
    owner to ims;

create table process_editor
(
    process_id bigint not null
        primary key
        constraint fk43b0ffjifp66nq86kg3dabsyy
            references processes,
    user_id    bigint
        constraint fk83qivfemtxg7yamrtuj45gj30
            references users
);

alter table process_editor
    owner to ims;

create table requirement_responsibles
(
    requirement_id bigint not null
        constraint fkmce0lkhgf0s9v8fencxrs0e4r
            references requirements,
    user_id        bigint not null
        constraint fk7jjckvf6y2wil3ga45lknfsuw
            references users,
    primary key (requirement_id, user_id)
);

alter table requirement_responsibles
    owner to ims;

create table role_editor
(
    role_id bigint not null
        primary key
        constraint fkax95q3nsieq76qv3ga31ggri7
            references roles,
    user_id bigint
        constraint fkb1fdp3fm9x9vpe589dfl58bum
            references users
);

alter table role_editor
    owner to ims;


insert into slm.users (checkinuserid, fullname, email)
values (6166, 'Levente Farkas', 'levente@egi.eu'),
       (171, 'Giuseppe La Rocca', 'giuseppe@egi.eu');

insert into slm.roles (role, name, version, status, changedon, changedescription, tasks, globalRoleId)
values ('process-owner', 'Process Owner', 1, 1, '2021-02-19T19:23:18', 'First version', 'Inherited', 1),
       ('process-manager', 'Process Manager', 1, 1, '2021-02-19T19:23:18', 'First version', 'Inherited', 2),
       ('process-staff', 'Process Staff', 1, 1, '2021-02-19T19:23:18', 'First version', 'Inherited', 3),
       ('report-owner', 'Report Owner', 1, 1, '2021-02-19T19:23:18', 'First version', 'Inherited', 4),
       ('catalog-owner', 'Service Catalog Owner', 1, 1, '2021-02-19T19:23:18', 'First version',
        '- Maintain Service Catalogue
- Provide access to appropriate parts of the service catalogue(s) to its customers, users and other interested parties', null),
       ('sla-owner', 'Service Level Agreement Owner', 1, 1, '2021-02-19T19:23:18', 'First version',
        '- Maintain the SLA under his/her ownership and ensure it is specified and documented according to relevant specifications
- Evaluate the fulfillment of the SLA
- Ensure that violations of the targets defined in the SLA are identified and investigated to prevent future recurrence
- Perform regular reviews of the SLA
- Understand new or changed requirements of the SLA under his/her ownership, and initiate necessary updates or other follow-up actions', null),
       ('ola-owner', 'Operational Level Agreement Owner', 1, 1, '2021-02-19T19:23:18', 'First version',
        '- Maintain the OLA under his/her ownership and ensure it is specified and documented according to relevant specifications
- Evaluate the fulfillment of the OLA
- Ensure that violations of the targets defined in the OLA are identified and investigated to prevent future recurrence
- Perform regular reviews of the OLA
- Understand new or changed requirements of the OLA under his/her ownership, and initiate necessary updates or other follow-up actions', null),
       ('ua-owner', 'Underpinning Agreement Owner', 1, 1, '2021-02-19T19:23:18', 'First version',
        '- Maintain the UA under his/her ownership and ensure it is specified and documented according to relevant specifications
- Evaluate the fulfillment of the UA
- Ensure that violations of the targets defined in the UA are identified and investigated to prevent future recurrence
- Perform regular reviews of the UA
- Understand new or changed requirements of the UA under his/her ownership, and initiate necessary updates or other follow-up actions', null),
       ('process-developer', 'Process Developer', 1, 0, '2023-09-02T19:23:18', 'First version', '...', null),
       ('process-developer', 'Process Developer', 2, 0, '2023-09-02T19:23:18', 'Second version',
        '- Make the necessary software changes to the SLM API so that requested changes to process, procedure, KPI, and role entities are implemented
- Improve the IMS front-end to allow exploiting all features of the SLM API', null);

insert into slm.role_editor (role_id, user_id)
values (1, 2),
       (2, 2),
       (3, 2),
       (4, 2),
       (5, 2),
       (6, 2),
       (7, 2),
       (8, 1),
       (9, 1),
       (10, 2);

insert into slm.processes (goals, scope, status, reviewfrequency, frequencyunit, nextreview, changedon, changedescription, contact)
VALUES ('The primary purpose of this process is...',
        'The scope of this process is...',
        0, 1, 'year', '2021-05-14', '2021-02-19T19:23:18', 'First draft', null),

       ('The primary purpose of this process is to
- Define, agree (with customers), and monitor service level agreements (SLAs)
- Define, agree (with federation members and suppliers), and monitor operation level agreements (OLAs)
- Define, agree (with suppliers), and monitor underpinning agreements (UA).',
        '- **Internal catalogue** - services are covered by Corporate SLA, no custom SLAs are foreseen.
- **External catalogue**:
    - **Category**:  dedicated custom SLA (VO SLA) upon customer request. If no VO SLA in place, Corporate SLA is applicable.
        - Online Storage
        - Check-in
        - EGI Notebooks
        - Cloud Compute
        - Cloud Container Compute
        - High-Throughput Compute
    - **Training**: Corporate SLA together with contract signed for training delivery
        - FitSM training
        - ISO27k training
    - **Other**: Corporate SLA, no custom SLAs are foreseen.',
        2, 8, 'day', '2023-11-14', '2021-05-14T22:03:18', 'Updated version', 'contact@egi.eu');

insert into slm.process_editor (process_id, user_id)
values (1, 2),
       (2, 2);

insert into slm.requirements (code, source, requirement)
values ('PR2.2', 'FitSM', 'For all _services_ delivered to customers, **SLAs** shall be in place.'),
       ('PR2.3', 'FitSM', '**SLAs** shall be reviewed at planned intervals.'),
       (null, 'ISO20K:2018', 'The catalogue of services shall include:
- the dependencies between services, and
- service components.');

insert into slm.process_requirements(process_id, requirement_id)
values (1, 1),
       (2, 1),
       (2, 2),
       (2, 3);

insert into slm.requirement_responsibles(requirement_id, user_id)
values (1, 1),
       (2, 1),
       (2, 2),
       (3, 2);

insert into slm.interfaces(direction, interfaceswith, description, relevantmaterial)
values ('In', 'CAPM', 'Reflecting demands, planned upgrades, downgrades and re-allocations of resources.', 'Capacity Plan Database'),
       ('Out', 'Internal', 'Data is gathered under http://argo.egi.eu/', 'Records of monitoring the performance of services and internal groups providing service components

EGI OLA Services reporting data'),
       ('Out', 'ISRM, SRM, CRM, SACM, CAPM, IS', 'Agreed Service Level Agreement, Operational Level Agreement, Underpinning Agreements', '**SLA/OLA/UA** database

- VO SLA OLAs
- OLA and UA
- [Agreements](https://egi.eu)');

insert into slm.process_interfaces(process_id, interface_id)
values (1, 2),
       (2, 1),
       (2, 2),
       (2, 3);


