SET search_path TO ims;

create table ims.governance
(
    version           serial
        unique,
    changedon         timestamp(6),
    id                bigserial
        primary key,
    title             varchar(256),
    changedescription varchar(2048),
    description       varchar(1048576)
);

alter table ims.governance
    owner to ims;

create table ims.governance_group_interfaces
(
    id             bigserial
        primary key,
    comment        varchar(1024),
    interfaceswith varchar(255)
);

alter table ims.governance_group_interfaces
    owner to ims;

create table ims.governance_groups
(
    id             bigserial
        primary key,
    body           varchar(10240),
    composition    varchar(10240),
    decisionvoting varchar(10240),
    meeting        varchar(10240)
);

alter table ims.governance_groups
    owner to ims;

create table ims.governance_group_interfaces_map
(
    group_id     bigint not null
        constraint fk2ap67a1smr8343k4qppvobxei
            references ims.governance_groups,
    interface_id bigint not null
        constraint fkpswjy46td3d0sbptj1uoxjokl
            references ims.governance_group_interfaces,
    primary key (group_id, interface_id)
);

alter table ims.governance_group_interfaces_map
    owner to ims;

create table ims.governance_groups_map
(
    governance_id bigint not null
        constraint fk5rjbel9uh4o4h7pwftn2en123
            references ims.governance,
    group_id      bigint not null
        constraint fkkpgcqcw700kc2v0ul0geyl2uw
            references ims.governance_groups,
    primary key (governance_id, group_id)
);

alter table ims.governance_groups_map
    owner to ims;

create table ims.process
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
    changedescription varchar(2048),
    description       varchar(10240),
    contact           varchar(255)
);

alter table ims.process
    owner to ims;

create table ims.process_interfaces
(
    direction        varchar(5),
    id               bigserial
        primary key,
    description      varchar(2048),
    relevantmaterial varchar(2048),
    interfaceswith   varchar(255)
);

alter table ims.process_interfaces
    owner to ims;

create table ims.process_interfaces_map
(
    interface_id bigint not null
        constraint fk1punfx5ugrk0dpiielsdo9wpj
            references ims.process_interfaces,
    process_id   bigint not null
        constraint fkj3fck5er4jx0tpslrqlsa3t8p
            references ims.process,
    primary key (interface_id, process_id)
);

alter table ims.process_interfaces_map
    owner to ims;

create table ims.process_requirements
(
    id          bigserial
        primary key,
    code        varchar(10),
    source      varchar(1024),
    requirement varchar(2048)
);

alter table ims.process_requirements
    owner to ims;

create table ims.process_requirements_map
(
    process_id     bigint not null
        constraint fkhqpciuptc7x7ursfhbn2l1i1
            references ims.process,
    requirement_id bigint not null
        constraint fkolxrmtgcpfy81qgfnuwliid0e
            references ims.process_requirements,
    primary key (process_id, requirement_id)
);

alter table ims.process_requirements_map
    owner to ims;

create table ims.responsibility
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
    changedescription varchar(2048),
    description       varchar(10240)
);

alter table ims.responsibility
    owner to ims;

create table ims.rolelog
(
    assigned  boolean not null,
    changedon timestamp(6),
    id        bigserial
        primary key,
    role      varchar(50)
);

alter table ims.rolelog
    owner to ims;

create table ims.roles
(
    assignable        boolean not null,
    category          integer not null,
    handover          boolean not null,
    status            integer not null,
    version           integer not null,
    changedon         timestamp(6),
    id                bigserial
        primary key,
    name              varchar(50),
    role              varchar(50),
    recommendation    varchar(1024),
    changedescription varchar(2048),
    tasks             varchar(4096)
);

alter table ims.roles
    owner to ims;

create table ims.users
(
    id            bigserial
        primary key,
    checkinuserid varchar(120)
        unique,
    email         varchar(255),
    fullname      varchar(255)
);

alter table ims.users
    owner to ims;

create table ims.governance_editor_map
(
    governance_id bigint not null
        primary key
        constraint fkc1i82uu0ciqcg3bs33yilvdgm
            references ims.governance,
    user_id       bigint
        constraint fkandscob79c0svshl694bn0rla
            references ims.users
);

alter table ims.governance_editor_map
    owner to ims;

create table ims.process_editor_map
(
    process_id bigint not null
        primary key
        constraint fk5gt0wfbl9mkovq1eh9fu8e21
            references ims.process,
    user_id    bigint
        constraint fkqug6qwf4l87h47srh85w77gaw
            references ims.users
);

alter table ims.process_editor_map
    owner to ims;

create table ims.process_requirement_responsibles_map
(
    requirement_id bigint not null
        constraint fk2s7vw5x1430mbfh0r8j131vdb
            references ims.process_requirements,
    user_id        bigint not null
        constraint fkht7dahwt6ikyxjaxde88gnhtd
            references ims.users,
    primary key (requirement_id, user_id)
);

alter table ims.process_requirement_responsibles_map
    owner to ims;

create table ims.responsibility_editor_map
(
    responsibility_id bigint not null
        primary key
        constraint fkh9m2eeeqq62ap3ayha7p2n0di
            references ims.responsibility,
    user_id           bigint
        constraint fkkyj1788bk6qvpt3hoqbdgxyh0
            references ims.users
);

alter table ims.responsibility_editor_map
    owner to ims;

create table ims.role_assigner_map
(
    role_id bigint not null
        primary key
        constraint fk2cl53me0lqurej7tlx0jfw6da
            references ims.rolelog,
    user_id bigint
        constraint fk1asnxm7yd3p4nm98slgnr4nyp
            references ims.users
);

alter table ims.role_assigner_map
    owner to ims;

create table ims.role_editor_map
(
    role_id bigint not null
        primary key
        constraint fkm3nhtqyd5j24kvjx20prixg04
            references ims.roles,
    user_id bigint
        constraint fk5mc71wctl1cj5aucqbg4ptohi
            references ims.users
);

alter table ims.role_editor_map
    owner to ims;

create table ims.role_holder_map
(
    role_id bigint not null
        primary key
        constraint fkssb2t484wqqyg9bb5k36pwmuj
            references ims.rolelog,
    user_id bigint
        constraint fk8gsow6t99flb6bnq6i2pul4e4
            references ims.users
);

alter table ims.role_holder_map
    owner to ims;

create sequence ims.governance_version_seq
    as integer;

alter sequence ims.governance_version_seq owner to ims;

alter sequence ims.governance_version_seq owned by ims.governance.version;

create sequence ims.governance_id_seq;

alter sequence ims.governance_id_seq owner to ims;

alter sequence ims.governance_id_seq owned by ims.governance.id;

create sequence ims.governance_group_interfaces_id_seq;

alter sequence ims.governance_group_interfaces_id_seq owner to ims;

alter sequence ims.governance_group_interfaces_id_seq owned by ims.governance_group_interfaces.id;

create sequence ims.governance_groups_id_seq;

alter sequence ims.governance_groups_id_seq owner to ims;

alter sequence ims.governance_groups_id_seq owned by ims.governance_groups.id;

create sequence ims.process_version_seq
    as integer;

alter sequence ims.process_version_seq owner to ims;

alter sequence ims.process_version_seq owned by ims.process.version;

create sequence ims.process_id_seq;

alter sequence ims.process_id_seq owner to ims;

alter sequence ims.process_id_seq owned by ims.process.id;

create sequence ims.process_interfaces_id_seq;

alter sequence ims.process_interfaces_id_seq owner to ims;

alter sequence ims.process_interfaces_id_seq owned by ims.process_interfaces.id;

create sequence ims.process_requirements_id_seq;

alter sequence ims.process_requirements_id_seq owner to ims;

alter sequence ims.process_requirements_id_seq owned by ims.process_requirements.id;

create sequence ims.responsibility_version_seq
    as integer;

alter sequence ims.responsibility_version_seq owner to ims;

alter sequence ims.responsibility_version_seq owned by ims.responsibility.version;

create sequence ims.responsibility_id_seq;

alter sequence ims.responsibility_id_seq owner to ims;

alter sequence ims.responsibility_id_seq owned by ims.responsibility.id;

create sequence ims.rolelog_id_seq;

alter sequence ims.rolelog_id_seq owner to ims;

alter sequence ims.rolelog_id_seq owned by ims.rolelog.id;

create sequence ims.roles_id_seq;

alter sequence ims.roles_id_seq owner to ims;

alter sequence ims.roles_id_seq owned by ims.roles.id;

create sequence ims.users_id_seq;

alter sequence ims.users_id_seq owner to ims;

alter sequence ims.users_id_seq owned by ims.users.id;
