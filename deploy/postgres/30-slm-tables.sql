SET search_path TO slm;

create table slm.process
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

alter table slm.process
    owner to ims;

create table slm.process_interfaces
(
    direction        varchar(5),
    id               bigserial
        primary key,
    description      varchar(2048),
    relevantmaterial varchar(2048),
    interfaceswith   varchar(255)
);

alter table slm.process_interfaces
    owner to ims;

create table slm.process_interfaces_map
(
    interface_id bigint not null
        constraint fk1punfx5ugrk0dpiielsdo9wpj
            references slm.process_interfaces,
    process_id   bigint not null
        constraint fkj3fck5er4jx0tpslrqlsa3t8p
            references slm.process,
    primary key (interface_id, process_id)
);

alter table slm.process_interfaces_map
    owner to ims;

create table slm.process_requirements
(
    id          bigserial
        primary key,
    code        varchar(10),
    source      varchar(1024),
    requirement varchar(2048)
);

alter table slm.process_requirements
    owner to ims;

create table slm.process_requirements_map
(
    process_id     bigint not null
        constraint fkhqpciuptc7x7ursfhbn2l1i1
            references slm.process,
    requirement_id bigint not null
        constraint fkolxrmtgcpfy81qgfnuwliid0e
            references slm.process_requirements,
    primary key (process_id, requirement_id)
);

alter table slm.process_requirements_map
    owner to ims;

create table slm.responsibility
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

alter table slm.responsibility
    owner to ims;

create table slm.rolelog
(
    assigned  boolean not null,
    changedon timestamp(6),
    id        bigserial
        primary key,
    role      varchar(50)
);

alter table slm.rolelog
    owner to ims;

create table slm.roles
(
    handover          boolean not null,
    status            integer not null,
    version           integer not null,
    changedon         timestamp(6),
    globalroleid      bigint,
    id                bigserial
        primary key,
    globalrolename    varchar(50),
    name              varchar(50),
    role              varchar(50),
    changedescription varchar(2048),
    globalroletasks   varchar(4096),
    tasks             varchar(4096)
);

alter table slm.roles
    owner to ims;

create table slm.users
(
    id            bigserial
        primary key,
    checkinuserid varchar(120)
        unique,
    email         varchar(255),
    fullname      varchar(255)
);

alter table slm.users
    owner to ims;

create table slm.process_editor_map
(
    process_id bigint not null
        primary key
        constraint fk5gt0wfbl9mkovq1eh9fu8e21
            references slm.process,
    user_id    bigint
        constraint fkqug6qwf4l87h47srh85w77gaw
            references slm.users
);

alter table slm.process_editor_map
    owner to ims;

create table slm.process_requirement_responsibles_map
(
    requirement_id bigint not null
        constraint fk2s7vw5x1430mbfh0r8j131vdb
            references slm.process_requirements,
    user_id        bigint not null
        constraint fkht7dahwt6ikyxjaxde88gnhtd
            references slm.users,
    primary key (requirement_id, user_id)
);

alter table slm.process_requirement_responsibles_map
    owner to ims;

create table slm.responsibility_editor_map
(
    responsibility_id bigint not null
        primary key
        constraint fkh9m2eeeqq62ap3ayha7p2n0di
            references slm.responsibility,
    user_id           bigint
        constraint fkkyj1788bk6qvpt3hoqbdgxyh0
            references slm.users
);

alter table slm.responsibility_editor_map
    owner to ims;

create table slm.role_assigner_map
(
    role_id bigint not null
        primary key
        constraint fk2cl53me0lqurej7tlx0jfw6da
            references slm.rolelog,
    user_id bigint
        constraint fk1asnxm7yd3p4nm98slgnr4nyp
            references slm.users
);

alter table slm.role_assigner_map
    owner to ims;

create table slm.role_editor_map
(
    role_id bigint not null
        primary key
        constraint fkm3nhtqyd5j24kvjx20prixg04
            references slm.roles,
    user_id bigint
        constraint fk5mc71wctl1cj5aucqbg4ptohi
            references slm.users
);

alter table slm.role_editor_map
    owner to ims;

create table slm.role_holder_map
(
    role_id bigint not null
        primary key
        constraint fkssb2t484wqqyg9bb5k36pwmuj
            references slm.rolelog,
    user_id bigint
        constraint fk8gsow6t99flb6bnq6i2pul4e4
            references slm.users
);

alter table slm.role_holder_map
    owner to ims;

create sequence slm.process_version_seq
    as integer;

alter sequence slm.process_version_seq owner to ims;

alter sequence slm.process_version_seq owned by slm.process.version;

create sequence slm.process_id_seq;

alter sequence slm.process_id_seq owner to ims;

alter sequence slm.process_id_seq owned by slm.process.id;

create sequence slm.process_interfaces_id_seq;

alter sequence slm.process_interfaces_id_seq owner to ims;

alter sequence slm.process_interfaces_id_seq owned by slm.process_interfaces.id;

create sequence slm.process_requirements_id_seq;

alter sequence slm.process_requirements_id_seq owner to ims;

alter sequence slm.process_requirements_id_seq owned by slm.process_requirements.id;

create sequence slm.responsibility_version_seq
    as integer;

alter sequence slm.responsibility_version_seq owner to ims;

alter sequence slm.responsibility_version_seq owned by slm.responsibility.version;

create sequence slm.responsibility_id_seq;

alter sequence slm.responsibility_id_seq owner to ims;

alter sequence slm.responsibility_id_seq owned by slm.responsibility.id;

create sequence slm.rolelog_id_seq;

alter sequence slm.rolelog_id_seq owner to ims;

alter sequence slm.rolelog_id_seq owned by slm.rolelog.id;

create sequence slm.roles_id_seq;

alter sequence slm.roles_id_seq owner to ims;

alter sequence slm.roles_id_seq owned by slm.roles.id;

create sequence slm.users_id_seq;

alter sequence slm.users_id_seq owner to ims;

alter sequence slm.users_id_seq owned by slm.users.id;

