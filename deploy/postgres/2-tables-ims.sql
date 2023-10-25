SET search_path TO ims;

create table ims.governance
(
    version           serial
        unique,
    changedon         timestamp(6),
    id                bigserial
        primary key,
    title             varchar(256),
    changedescription varchar(1024),
    description       varchar(255)
);

alter table ims.governance
    owner to ims;

create table ims.governance_annex_interfaces
(
    id             bigserial
        primary key,
    comment        varchar(1024),
    interfaceswith varchar(255)
);

alter table ims.governance_annex_interfaces
    owner to ims;

create table ims.governance_annexes
(
    id             bigserial
        primary key,
    body           varchar(255),
    composition    varchar(255),
    decisionvoting varchar(255),
    meeting        varchar(255)
);

alter table ims.governance_annexes
    owner to ims;

create table ims.governance_annex_interfaces_map
(
    annex_id     bigint not null
        constraint fkq6efm4apbmwltwuvmoxrcl1xg
            references ims.governance_annexes,
    interface_id bigint not null
        constraint fk40wnbqbvp5cwsemjptuarfjfl
            references ims.governance_annex_interfaces,
    primary key (annex_id, interface_id)
);

alter table ims.governance_annex_interfaces_map
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
    changedescription varchar(1024),
    goals             varchar(4096),
    scope             varchar(4096),
    contact           varchar(255),
    urldiagram        varchar(255)
);

alter table ims.process
    owner to ims;

create table ims.process_annexes_map
(
    annex_id   bigint not null
        constraint fkc9h7te73r7k0val8efwqw4x4p
            references ims.governance_annexes,
    process_id bigint not null
        constraint fkcxj85mk4e3j249m1v79pmhxdi
            references ims.governance,
    primary key (annex_id, process_id)
);

alter table ims.process_annexes_map
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
    status            integer not null,
    version           integer not null,
    changedon         timestamp(6),
    id                bigserial
        primary key,
    name              varchar(50),
    role              varchar(50),
    changedescription varchar(1024),
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
    process_id bigint not null
        primary key
        constraint fk4e7ha0784ijdqtdbp0xytr522
            references ims.governance,
    user_id    bigint
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
