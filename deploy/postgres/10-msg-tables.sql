create table msg.messages
(
    wasread       boolean,
    changedon     timestamp(6),
    id            bigserial
        primary key,
    senton        timestamp(6),
    category      varchar(10),
    checkinuserid varchar(120),
    link          varchar(256),
    message       varchar(2048)
);

alter table msg.messages
    owner to ims;
