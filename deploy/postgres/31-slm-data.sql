SET search_path TO slm;

insert into slm.users (checkinuserid, fullname, email)
values ('e9c37aa0d1cf14c56e560f9f9915da6761f54383badb501a2867bc43581b835c@egi.eu', 'Levente Farkas', 'levente.farkas@egi.eu'),
       ('025166931789a0f57793a6092726c2ad89387a4cc167e7c63c5d85fc91021d18@egi.eu', 'Giuseppe La Rocca', 'giuseppe.larocca@egi.eu');

insert into slm.responsibility (status, reviewfrequency, frequencyunit, nextreview, changedon, changedescription, description)
VALUES (0, 1, 'year', '2024-05-14', '2023-10-19T21:05:22', 'First draft',
'### Table of contents
- [Goals](#goals)
- [Roles and responsibilities](#roles-and-responsibilities)
    - [Process-specific roles and assignment](#role-category-process)

### Goals
This is a description of the roles and responsibilities within the Service Level Management (SLM) process, and an overview of all active roles holders in the process. For an overview of the role hierarchy in the EGI Integrated Management System (IMS), [look here](/ims/plan/roles).

### Roles and responsibilities
The following roles are relevant in the context of this process and need to be assigned to persons or teams/groups involved in the process.');

insert into slm.responsibility_editor_map (responsibility_id, user_id)
values (1, 1);

insert into slm.roles (role, name, version, status, changedon, changedescription, handover, globalRole, globalRoleName, globalRoleTasks, tasks)
values ('process-staff', 'Process Staff', 1, 1, '2021-02-19T19:23:18', 'First version', false, 'process-staff', 'Process Staff',
'- Carry out defined activities according to the process and, as applicable, its procedures
- Report to the process manager', null),

       ('process-owner', 'Process Owner', 1, 1, '2021-02-19T19:23:18', 'First version', true, 'process-owner', 'Process Owner',
'Act as the primary contact point for concerns in the context of governing one specific IMS process.
- Define and approve goals and policies in the context of the process according to the overall IMS goals and policies
- Nominate the process manager, and ensure he/she is competent to fulfill this role
- Approve changes/improvements to the operational process, such as (significant) changes to the process definition
- Decide on the provision of resources dedicated to the process and its activities
- Based on process monitoring and reviews, decide on necessary changes in the process-specific goals, policies and provided resources', null),

       ('process-manager', 'Process Manager', 1, 0, '2021-02-19T19:23:18', 'First version', true, 'process-manager', 'Process Manager',
'Act as the primary contact point for operational concerns in the context of the process.
- Maintain the process definition/description and ensure it is available to relevant persons
- Maintain an adequate level of awareness and competence of the people involved in the process
- Monitor and keep track of the process execution and results (incl. process reviews)
- Report on process performance to the process owner
- Escalate to the process owner, if necessary
- Identify opportunities for improving the effectiveness and efficiency of the process', null),

       ('report-owner', 'Report Owner', 1, 1, '2021-02-19T19:23:18', 'First version', false, 'report-owner', 'Report Owner',
'TBD', null),

       ('process-developer', 'Process Developer', 1, 1, '2023-09-02T19:23:18', 'First version', false, null, null, null,
'- Make the necessary software changes to the SLM API so that requested changes to process, procedure, KPI, and role entities are implemented
- Improve the IMS front-end to allow exploiting all features of the SLM API'),

       ('catalog-owner', 'Service Catalog Owner', 1, 1, '2021-02-19T19:23:18', 'First version', false, null, null, null,
'- Maintain Service Catalogue
- Provide access to appropriate parts of the service catalogue(s) to its customers, users and other interested parties'),

       ('sla-owner', 'Service Level Agreement Owner', 1, 1, '2021-02-19T19:23:18', 'First version', false, null, null, null,
'- Maintain the SLA under his/her ownership and ensure it is specified and documented according to relevant specifications
- Evaluate the fulfillment of the SLA
- Ensure that violations of the targets defined in the SLA are identified and investigated to prevent future recurrence
- Perform regular reviews of the SLA
- Understand new or changed requirements of the SLA under his/her ownership, and initiate necessary updates or other follow-up actions'),

       ('ola-owner', 'Operational Level Agreement Owner', 1, 1, '2021-02-19T19:23:18', 'First version', false, null, null, null,
'- Maintain the OLA under his/her ownership and ensure it is specified and documented according to relevant specifications
- Evaluate the fulfillment of the OLA
- Ensure that violations of the targets defined in the OLA are identified and investigated to prevent future recurrence
- Perform regular reviews of the OLA
- Understand new or changed requirements of the OLA under his/her ownership, and initiate necessary updates or other follow-up actions'),

       ('ua-owner', 'Underpinning Agreement Owner', 1, 1, '2021-02-19T19:23:18', 'First version', false, null, null, null,
'- Maintain the UA under his/her ownership and ensure it is specified and documented according to relevant specifications
- Evaluate the fulfillment of the UA
- Ensure that violations of the targets defined in the UA are identified and investigated to prevent future recurrence
- Perform regular reviews of the UA
- Understand new or changed requirements of the UA under his/her ownership, and initiate necessary updates or other follow-up actions'),

       ('process-manager', 'Process Manager', 2, 1, '2021-02-19T19:23:18', 'Second version', true, 'process-manager', 'Process Manager',
'Act as the primary contact point for operational concerns in the context of the process.
- Maintain the process definition/description and ensure it is available to relevant persons
- Maintain an adequate level of awareness and competence of the people involved in the process
- Monitor and keep track of the process execution and results (incl. process reviews)
- Report on process performance to the process owner
- Escalate to the process owner, if necessary
- Identify opportunities for improving the effectiveness and efficiency of the process', null);

insert into slm.role_editor_map (role_id, user_id)
values (1, 2),
       (2, 2),
       (3, 2),
       (4, 1),
       (5, 2),
       (6, 2),
       (7, 2),
       (8, 2),
       (9, 2),
       (10, 1);

insert into slm.process (description, status, reviewfrequency, frequencyunit, nextreview, changedon, changedescription, contact)
VALUES ('The primary purpose of this process is...',
        0, 1, 'year', '2021-05-14', '2021-02-19T19:23:18', 'First draft', null),

       ('### Table of contents
- [Goals](#goals)
    - [Scope](#scope)
    - [Requirements](#requirements)
    - [Roles and responsibilities](/slm/roles)
    - [Inputs and Outputs](#inputs-and-outputs)

### Goals
The primary purpose of this process is to
- Define, agree (with customers), and monitor service level agreements (SLAs)
- Define, agree (with federation members and suppliers), and monitor operation level agreements (OLAs)
- Define, agree (with suppliers), and monitor underpinning agreements (UA).

#### Scope
- **Internal catalogue** - services are covered by Corporate SLA, no custom SLAs are foreseen.
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

insert into slm.process_editor_map (process_id, user_id)
values (1, 2),
       (2, 2);

insert into slm.process_requirements (code, source, requirement)
values ('PR2.2', 'FitSM', 'For all _services_ delivered to customers, **SLAs** shall be in place.'),
       ('PR2.3', 'FitSM', '**SLAs** shall be reviewed at planned intervals.'),
       (null, 'ISO20K:2018', 'The catalogue of services shall include:
- the dependencies between services, and
- service components.');

insert into slm.process_requirements_map(process_id, requirement_id)
values (1, 1),
       (2, 1),
       (2, 2),
       (2, 3);

insert into slm.process_requirement_responsibles_map(requirement_id, user_id)
values (1, 1),
       (2, 1),
       (2, 2),
       (3, 2);

insert into slm.process_interfaces(direction, interfaceswith, description, relevantmaterial)
values ('In', 'CAPM', 'Reflecting demands, planned upgrades, downgrades and re-allocations of resources.', 'Capacity Plan Database'),
       ('Out', 'Internal', 'Data is gathered by [ARGO](http://argo.egi.eu/)',
'Records of monitoring the performance of services and internal groups providing service components

EGI OLA Services reporting data'),
       ('Out', 'ISRM, SRM, CRM, SACM, CAPM, IS', 'Agreed Service Level Agreement, Operational Level Agreement, Underpinning Agreements',
'**SLA/OLA/UA** database

- VO SLA OLAs
- OLA and UA
- [Agreements](https://egi.eu)');

insert into slm.process_interfaces_map(process_id, interface_id)
values (1, 2),
       (2, 1),
       (2, 2),
       (2, 3);
