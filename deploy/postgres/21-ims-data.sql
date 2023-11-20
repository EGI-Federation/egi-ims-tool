insert into ims.users (checkinuserid, fullname, email)
values ('e9c37aa0d1cf14c56e560f9f9915da6761f54383badb501a2867bc43581b835c@egi.eu', 'Levente Farkas', 'levente.farkas@egi.eu');

insert into ims.responsibility (status, reviewfrequency, frequencyunit, nextreview, changedon, changedescription, description)
VALUES (0, 1, 'year', '2024-05-14', '2023-10-19T21:05:22', 'First draft',
'### Table of contents
- [Goals](#goals)
- [Roles, responsibilities, and communication](#roles-responsibilities-and-communication)
    - [IMS-specific roles and assignment](#role-category-ims)
    - [Process-specific roles and assignment](#role-category-process)
    - [Service-specific roles and assignment](#role-category-service)

### Goals
This is a description of the roles and responsibilities within EGI Integrated Management System (IMS).

### Roles, responsibilities, and communication
The following image shows the EGI IMS role hierarchy (indicating the line of reporting).<br/>
**Note**: In the case of communication between the IMS Manager and the Process Manager, the Process Owner should be always informed.

<p style="text-align:center;"><img src="/images/SMS-roles-hierarchy.png" alt="SMS roles hierarchy" style="max-width:40rem;"/></p>

Communication should go through the following:

- The mailing list [ims@mailman.egi.eu](mailto:ims@mailman.egi.eu), with the following membership:
    - Service owners
    - Process owners
    - Process managers
    - IMS manager
    - IMS owner
- Task queue EGI Jira IMS
- Slack channel [#office-ims](https://egiteam.slack.com/messages/office-ims/)');

insert into ims.responsibility_editor_map (responsibility_id, user_id)
values (1, 1);

insert into ims.roles (role, name, version, status, category, changedon, changedescription, assignable, handover, recommendation, tasks)
values ('process-staff', 'Process Staff', 1, 1, 1, '2021-02-19T19:23:18', 'First version', false, false, '1 or more per process',
'- Carry out defined activities according to the process and, as applicable, its procedures
- Report to the case owner and/or process manager'),

       ('process-owner', 'Process Owner', 1, 1, 1, '2021-02-19T19:23:18', 'First version', false, true, '1 per process',
'Act as the primary contact point for concerns in the context of governing one specific IMS process.
- Define and approve goals and policies in the context of the process according to the overall IMS goals and policies
- Nominate the process manager, and ensure he/she is competent to fulfill this role
- Approve changes/improvements to the operational process, such as (significant) changes to the process definition
- Decide on the provision of resources dedicated to the process and its activities
- Based on process monitoring and reviews, decide on necessary changes in the process-specific goals, policies and provided resources'),

       ('process-manager', 'Process Manager', 1, 1, 1, '2021-02-19T19:23:18', 'First version', false, true, '1 per process',
'Act as the primary contact point for operational concerns in the context of the process.
- Maintain the process definition/description and ensure it is available to relevant persons
- Maintain an adequate level of awareness and competence of the people involved in the process
- Monitor and keep track of the process execution and results (incl. process reviews)
- Report on process performance to the process owner
- Escalate to the process owner, if necessary
- Identify opportunities for improving the effectiveness and efficiency of the process'),

       ('report-owner', 'Report Owner', 1, 1, 1, '2021-02-19T19:23:18', 'First version', false, false, null,
'TBD'),

       ('service-owner', 'Service Owner', 1, 1, 2, '2021-02-19T19:23:18', 'First version', false, true,
'1 per service in the service portfolio',
'Overall responsibility for one specific service which is part of the service portfolio.
- Act as the primary contact point for all (process-independent) concerns in the context of that specific service
- Act as an “expert” for the service in technical and non-technical concerns
- Maintain the core service documentation, such as the service specification/description
- Be kept informed of every event, situation or change connected to the service
- Be involved in tasks significantly related to the service as part of selected IMS processes, in particular, SPM and SLM (see: process-specific role models)
- Report on the service to the IMS owner
- Define and maintain individual service roadmap with annual objectives for a 3-year period, a summary of resources needed (including financial), usage and satisfaction statistics'),

       ('ims-owner', 'IMS Owner', 1, 1, 0, '2021-02-19T19:23:18', 'First version', true, true, '1 for the overall IMS',
'Senior accountable owner of the entire Integrated Management System (IMS).
- Overall accountability for all IMS-related activities
- Act as the primary contact point for concerns in the context of governing the entire IMS
- Define and approve goals and policies for the entire IMS
- Nominate the process owners and/or managers, and ensure they are competent to fulfill their roles
- Approve the first definition of processes/procedures
- Approve changes to the overall IMS
- Decide on the provision of resources dedicated to IMS
- Based on monitoring and reviews, decide on necessary changes in the goals, policies and provide resources for the IMS
- Appoint and approve service owners'),

       ('ims-manager', 'IMS Manager', 1, 1, 0, '2021-02-19T19:23:18', 'First version', true, true, '1 for the overall IMS',
'Act as the primary contact point for all tactical concerns (including planning and development) in the context of the entire IMS.
- Maintain the service management plan and ensure it is available to relevant stakeholders
- Ensure service management processes are implemented according to approved goals and policies
- Maintain an adequate level of awareness and competence of the people involved in the IMS, in particular, the process managers
- Monitor and keep track of the suitability, effectiveness and maturity of the entire IMS
- Report and, if necessary, escalate to the IMS owner
- Identify opportunities for improving the effectiveness and efficiency of the IMS'),

       ('ims-developer', 'IMS Developer', 1, 0, 0, '2023-09-02T19:23:18', 'First version', true, false, null,
'- Make the necessary software changes to Management System API so that requested changes to the management system,
governance body, budget, policy, task, workshop, procedure, KPI, report, and role entities are implemented
- Improve the IMS front-end to allow exploiting all features of the Management System API'),

       ('strategy-coordinator', 'Strategy Coordinator', 1, 1, 0, '2021-02-19T19:23:18', 'First version', true, false,
'Membership:
- IMS Owner
- IMS Manager',
'Is part of the IMS coordination team responsible for strategic decisions related to the IMS, chaired by the IMS owner.
- Support the IMS owner at the strategic level of IMS
- Maintain a formal communication channel between the IMS owner and the IMS manager'),

       ('operations-coordinator', 'Operations Coordinator', 1, 1, 0, '2021-02-19T19:23:18', 'First version', true, false,
'Membership:
- IMS Manager
- CSI Manager
- ISM Manager',
'Is part of the team responsible for overall monitoring of the IMS, chaired by the IMS manager.
- Support the IMS owner at the operations level of IMS
- Maintain a formal communication channel between the CSI process and the IMS manager');

insert into ims.role_editor_map (role_id, user_id)
values (1, 1),
       (2, 1),
       (3, 1),
       (4, 1),
       (5, 1),
       (6, 1),
       (7, 1),
       (8, 1),
       (9, 1),
       (10, 1);

insert into ims.process (status, reviewfrequency, frequencyunit, nextreview, changedon, changedescription, contact, description)
VALUES (0, 1, 'year', '2024-05-14', '2021-02-19T19:23:18', 'First draft', 'contact@egi.eu', null);

insert into ims.process_editor_map (process_id, user_id)
values (1, 1);

insert into ims.governance (changedon, changedescription, title, description)
VALUES ('2023-10-19T19:23:18', 'First draft', 'EGI Foundation Governance',
'### Table of contents
- [EGI.eu Statutes and Governance Bodies](#egieu-statutes-and-governance-bodies)
    - [Council](#council)
    - [Executive Board](#executive-board)
    - [EGI Foundation Participants](#egi-foundation-participants)
- [Other relevant groups](#other-relevant-groups)
    - [Strategy and Innovation Board (SIB)](#strategy-and-innovation-board-(sib))
    - [Project Advisory Committee (PAC)](#project-advisory-committee-(pac))
    - [User Community Board (UCB)](#user-community-board-(ucb))
    - [Community Managers Group (CMG)](#community-managers-group-(cmg))
    - [Operations Management Board (OMB)](#operations-management-board-(omb))
    - [Technology Coordination Board (TCB)](#technology-coordination-board-(tcb))
    - [UMD Release Team (URT)](#umd-release-team-(urt))
    - [Services and Solutions Board (SSB)](#services-and-solutions-board-(ssb))
    - [Security Policy Group (SPG)](#security-policy-group-(spg))
    - [Software Vulnerability Group (SVG)](#software-vulnerability-group-(svg))
    - [Computer Security and Incident Response Team (CSIRT)](#computer-security-and-incident-response-team-(csirt))
- [Annexes](#annexes)

### EGI.eu Statutes and Governance Bodies
The EGI Foundation (a.k.a. EGI.eu) has adopted the legal form of a ‘Foundation’ under Dutch law. Its statutes were updated during 2015 and define the objectives of the foundation, the composition in terms of participants and associated participants, the organisation and tasks of the Council and Executive Board (EB), the role of the Director. For more information about benefits and options for joining the EGI Federation, please check the dedicated brochure [_Joining the EGI Federation_](https://go.egi.eu/join).

<p style="text-align:center;"><img src="/images/EGI-governing-bodies.png" alt="EGI Governing Bodies" style="max-width:40rem;"/></p>

#### Council
The [Council](https://www.egi.eu/about/egi-council/) is the supervisory authority and monitors the general course of affairs in the Foundation. It consists of participants and associated participants of the foundation. Only participants have voting rights proportional to the paid fee, while associated participants cannot vote. The Council is also responsible for appointing the chairperson and the members of the Executive Board. The Terms of Reference (ToR) for the Council is defined by the EGI.eu Statutes and by a [dedicated ToR](https://documents.egi.eu/document/152).

#### Executive Board
The Executive Board is charged with the management of the foundation, for which it is accountable to the Council. It is composed from minimally five and maximally nine members appointed for a maximum period of two years. A number of resolutions of the Executive Board are subject to the approval of the Council (e.g. adoption of the budget, employment conditions of the personnel employed by the foundation). The Executive Board devolves financial and organisational responsibility to the EGI.eu Director, who is supported by a staff of ~20 people based at the EGI.eu headquarters in Amsterdam with some limited remote working staff. The Terms of Reference for the EB is defined by the EGI.eu Statutes and by a [dedicated ToR](https://documents.egi.eu/document/151).

#### EGI Foundation Participants
Participants and Associated Participants can be NGIs, EIROs, ERICs and such other legal entities, in their own capacity or as representative of a consortium, that contribute to the objective of the foundation. In the case of consortium representatives, membership is subject to there being a letter of support from the appropriate relevant authority indicating how the identified organisation represents the National e-Infrastructure strategy. Representation within the EGI Council would be determined by the lead member within the organisation or as defined in its statutes or within a Memorandum of Understanding (MoU) for membership with EGI. By being an EGI.eu participant, an organisation benefits from a set of activities that are delivered by EGI.eu in collaboration with a sub-set of participants listed in the [EGI Internal Service Portfolio](https://confluence.egi.eu/display/IMS/EGI+Internal+Service+Portfolio).

### Other relevant groups

#### Strategy and Innovation Board (SIB)
The Strategy and Innovation Board is an external advisory body that provides advice and guidance to the EGI council and to EGI.eu leadership about the strategy in the area of: relationship and service provision to user communities, relationship to other e-Infrastructures, relationship to industry, technology and innovation; e-Infrastructure organisation and management. The SIB will have ownership of strategy and innovation recommendations, which are intended to be formalised within a living document that will be maintained and updated through regular meetings. Members of the SIB will be appointed during 2017 by the EB.

#### Project Advisory Committee (PAC)
The Project Advisory Committee is an advisory body to the EGI Executive Board and through the Executive Board the Council, on the EGI Federation priorities regarding the participation in projects. It provides directly or indirectly input to external funding agencies on EGI Federation priorities in consultation with the Executive Board, gathers input from EGI Participants on priorities and orientations, oversees the EGI Federation response to the various calls and project funding opportunities, advises the EGI Federation on the medium and long term strategic issues related to the participation in foreseeable funding programmes initiated by the European Commission and other funding bodies in Europe and beyond.

#### User Community Board (UCB)
The User Community Board gathers feedback from the user community relating to the quality of the production infrastructure and prioritises issues requiring management attention for resolution through the OMB. It also defines and prioritises requirements relating to new functionality in the production infrastructure or the user-facing operational tools. The UCB includes representatives from the research communities and projects served by EGI.

#### Community Managers Group (CMG)
EGI members (NGIs, EIROs, RIs and institutes) can delegate contacts to the [EGI Community Managers](https://confluence.egi.eu/display/EGIBG/Community+Managers) network. The EGI Community Managers network is an information-sharing network about user engagement, training, technical support and partner liaison activities in the EGI context. Members of the network have regular meetings and an email list to share information about their activities, and to exchange success stories and best practices between the European and national/community/institutional landscapes.

#### Operations Management Board (OMB)
The Operations Management Board is an advisory body, which develops strategy and technical priorities concerning the deployment and operation of the production infrastructure, oversees the status and progress of the global EGI operational services and of the NGI operational services. Responsibilities of the OMB include the development of policies and procedures that require formal consensus from the NGI operations managers and their respective resource providers, the collection of requirements from the EGI resource providers, the definition of work plans the long-term development of the EGI operations.

#### Technology Coordination Board (TCB)
The TCB (“the Group”) has been established to coordinate the identification, testing, validation, adoption, provisioning, and decommissioning of existing and future technologies relevant to the delivery of the EGI Service Portfolio. Specific responsibilities include:

1. the appointment of technical area coordinators in ICT domains identified to be relevant to the EGI Service Portfolio;
1. the definition and maintenance of the EGI Federation Technical Plan, defining the EGI Federation service architecture, the technical specifications of the EGI portfolio services and their interoperability guidelines in collaboration with working groups, technology providers, service providers and user communities;
1. The setup and coordination of working groups contributing to the definition of the technical plan in specific areas relevant to the EGI service portfolio;
1. The consultation with relevant stakeholders for any matter that concerns the EGI technical plan, through face to face meetings and online channels (webinars, surveys, etc.);
1. The liaison with external e-Infrastructures and research infrastructures on matters concerning the adoption, integration with and evolution of the technical solutions adopted by the EGI service portfolio;
1. The advice and report to the Executive Board and the Council.

The Group contributes to IT Service Management activities according to EGI’s Service Management Policy. See [ToR](https://documents.egi.eu/document/109) and related [confluence space](https://confluence.egi.eu/display/EGIBG/Technology+Coordination+Board).

#### UMD Release Team (URT)
The [Unified Middleware Distribution](https://confluence.egi.eu/display/EGIG/Unified+Middleware+Distribution) (UMD) Release Team is a coordination group, under the EGI Operations umbrella. The goal of URT is to continue some of the coordination activities carried out by the European middleware projects, keep the communications active between product teams and to open a new communication channel between the EGI and the middleware developers.

The ultimate aim of URT is to keep releasing quality software, to be distributed in UMD.

#### Services and Solutions Board (SSB)
The [Services and Solutions Board](https://confluence.egi.eu/display/IMS/Services+and+Solutions+Board+-+SSB) is responsible for managing the portfolio of services and solutions regarding EGI.eu and the EGI federated services. This includes all services and solutions that are planned, active or to be retired. The SSB also conducts regularly scheduled management reviews of both services and solutions portfolios and related ITSM processes. It also collects inputs from the UCB concerning the services and solutions for the research communities, from the TCB concerning the evolution of technology and how this can affect services and solutions; from the OMB concerning the services and solutions for resource providers.

#### Security Policy Group (SPG)
The Security Policy Group is responsible for developing the policy needed to provide a secure, trustworthy distributed computing infrastructure. The SPG output defines the behaviour expected from NGIs, Sites, Users and other participants to maintain a beneficial and effective working environment. The SPG also seeks to prepare and maintain simple and general policies which are not only applicable to EGI, but also to other distributed computing infrastructures.

#### Software Vulnerability Group (SVG)
The purpose of the EGI Software Vulnerability Group is to minimise the risk to all service providers, infrastructures, users and other parties which interact with the EOSC-hub, arising from vulnerabilities in software deployed on the constituents of the distributed infrastructure. In essence, to minimise the risk of security incidents due to software vulnerabilities.

#### Computer Security and Incident Response Team (CSIRT)
The EGI Computer Security and Incident Response Team provides operational security for the EGI Infrastructure. This includes responding to computer security incidents affecting the infrastructure, which is carried out by coordinating the incident handling activities in the NGIs/EIROs, RCs, VOs, and where applicable interacting with partner Infrastructures CSIRTs and CSIRT communities with which EGI-CSIRT has a trust relationship. If needed RCs are provided with expert level forensics support for the incident resolution. EGI-CSIRT also provides preventive and educational services such as security monitoring, vulnerability assessment, advisories to mitigate risks due to vulnerabilities, and security training. To improve collaboration in the field of IT-Security EGI-CSIRT actively reaches out to CSIRT communities and is an active member of TI TF-CSIRT. The EGI CSIRT is led and coordinated by the EGI Security Officer.');

insert into ims.governance_editor_map (governance_id, user_id)
values (1, 1);

insert into ims.governance_groups (body, composition, meeting, decisionVoting)
VALUES ('**Council** ([ToR](https://documents.egi.eu/document/152))',
'The core participants of the Council consist of national based e-Infrastructure federations called NGIs.

Countries (be they EU member states, associate countries or third countries – as recognised by the European Commission) may become members of the Council represented by the lead or other appropriate organisation within a given NGI.

International Research Infrastructures (e.g. EIROs, ESFRIs) may also become members of the Council where there is a legally recognised Intergovernmental Organisation such as an ERIC or an EIRO.',
'The Council meets at least twice a year, face-to-face: first within six months after the expiry of any financial year in order to adopt the annual account of the past year and then in the second six month period in order to approve the budget for the following calendar year.

The Council will furthermore meet whenever deemed necessary by the chairperson, or by two representatives of Participants or a member of the Executive Board.

Virtual meetings are not possible, only face-to-face meetings are envisioned.',
'Generally by consensus with a required quorum in some cases.

1 vote submission per representative (number of votes counted per submission differ by participation level).'),

       ('**Executive Board** ([ToR](https://documents.egi.eu/document/151))',
'The Council will appoint, suspend and dismiss the members of the Executive Board.

The Executive Board shall consist of minimally five (5) and maximally nine (9) members, currently comprised of 7 members. The members of the Executive Board are natural persons within EGI.eu. The Council determines the number of members of the Executive Board.',
'Regular virtual meetings (via telephone and web conferencing) will take place. These meetings will take place monthly.

At least one face-to-face meeting per year to be presented the findings of the FA auditor and approve the annual accounts.

The Group deliberations happen by face-to-face meetings, phone/video conferences or via the Group mailing list.',
'Generally by consensus

1 vote per representative'),

       ('**Strategy and Innovation Board** ([SIB](https://documents.egi.eu/document/2131))',
'The Group is composed by maximum 9 members. Membership should involve high-level experts in areas relevant for the EGI Federation strategy.

Members are appointed for a 2-year term renewable once.  The renewal of members is organised in a staged way to ensure that only a subset of representatives is renewed.

When members need to be appointed, the EGI Executive Board Chair issues an invitation to propose candidates to the EGI Executive Board and EGI Council.',
'The Group deliberations happen by face-to-face meetings, phone/video conferences or via the Group mailing list.',
'Generally by consensus

1 vote per representative'),

       ('**Project Advisory Committee** ([PAC](https://confluence.egi.eu/x/VxImBg))',
'The PAC is formed by:

- High-level experts from the organizations represented in the EGI Council by the EGI Participants',
'See ToR',
'Generally by consensus

1 vote per representative'),

       ('**User and Community Board** ([UCB](https://documents.egi.eu/document/120))',
'The UCB is formed by:

- VRC representatives (via MoU)
- Large research communities representatives
- Competence Centre representatives
- Champions representatives',
'Regular virtual meetings (via telephone and web conferencing) will take place. These meetings will take place every 3 months.',
'Generally by consensus

1 vote per representative'),

       ('**Operations Management Board** ([OMB](https://documents.egi.eu/document/117))',
'The OMB is formed by:

- Operations Manager for each NGI and integrated/peer infrastructure
- Virtual Research Communities (VRC) representatives',
'Regular virtual meetings (via telephone and web conferencing) will take place. These meetings will take place once a month.

The Group deliberations happen by face-to-face meetings, phone/video conferences or via the Group mailing list.',
'Generally by consensus

1 vote per representative'),

       ('**Technical Coordination Board** ([TCB](https://documents.egi.eu/document/109))',
'The TCB is formed by:

- Area Coordinators
- TCB Working Group Coordinators
- The EGI Foundation Technical Solutions Lead (Chair)
- The EGI Foundation Community Support Lead (ex officio member)
- The EGI Foundation Service Delivery and Information Security Lead (ex officio member)
- The SSB Chair (ex officio member)',
'Regular virtual meetings (via telephone and web conferencing) will take place. These meetings will take place once every 3 months.

The Group deliberations happen by face-to-face meetings, phone/video conferences or via the Group mailing list.',
'Generally by consensus

1 vote per representative'),

       ('**UMD Release Team** ([URT](https://documents.egi.eu/document/1618))',
'All the product teams contributing with their software to the [UMD](https://confluence.egi.eu/display/EGIG/Unified+Middleware+Distribution) releases should join the URT.
More in general, the product team influenced by products released in UMD may be interested in following the URT.',
'URT members meet every two weeks in a phone meeting.',
'Generally by consensus'),

       ('**Services and Solutions Board** ([SSB](https://confluence.egi.eu/x/LALhBw))',
'The SSB is formed by:

- EGI IMS:
    - IMS Owner
    - IMS Manager
    - Process Owners
    - Process Managers
- Service Owners
- Appointed representative from the UCB, TCB and OMB (one per board)',
'Regular virtual meetings (via telephone and web conferencing) will take place. These meetings will take place once a month.

The Group deliberations happen by face-to-face meetings, phone/video conferences or via the Group mailing list.',
'Generally by consensus

1 vote per representative'),

       ('**Security Policy Group** ([SPG](https://documents.egi.eu/document/64))',
'The SPG is formed by:

- Participants and Associate Participants of EGI.eu',
'The Group will meet as often as the work requires but this will be at least twice per year, at least one of which will be face to face (ideally during the annual EGI technical forum)

The Group deliberations happen by face-to-face meetings, phone/video conferences or via the Group mailing list.',
'Generally by consensus

1 vote per representative'),

       ('**Computer Security and Incident Response Team** ([CSIRT](https://documents.egi.eu/document/385))',
'EGI CSIRT is formed by:

- NGI security officers and their deputies
- The NGI security officer is the voting member, their deputies can only vote if the full member is not available
- EGI Directorate and EGI Chief Operations Manager',
'The Group will meet face to face at least once per year; ideally three times per year and one of them will be at one of the bi-annual EGI Forums where practicable. The team will meet virtually (online/phone/video) once per month where practicable.',
'Generally by consensus

1 vote per representative');

insert into ims.governance_groups_map (governance_id, group_id)
values (1, 1),
       (1, 2),
       (1, 3),
       (1, 4),
       (1, 5),
       (1, 6),
       (1, 7),
       (1, 8),
       (1, 9),
       (1, 10),
       (1, 11);

insert into ims.governance_group_interfaces (interfacesWith, comment)
VALUES ('BDS', null),
       ('CAPM', null),
       ('SPM', 'via the SSB'),
       ('FA', null),
       ('PPM', null),
       ('CRM', 'consulted to evaluate business opportunities'),
       ('ISRM', null),
       ('SUPPM', null),
       ('CHM', null),
       ('SPM', 'as board to discuss/approve changes to service portfolios'),
       ('ISM', null);

insert into ims.governance_group_interfaces_map (group_id, interface_id)
values (1, 1),
       (1, 2),
       (1, 3),
       (2, 1),
       (2, 4),
       (3, 1),
       (4, 5),
       (5, 6),
       (6, 7),
       (7, 8),
       (8, 9),
       (9, 10),
       (10, 11),
       (11, 11),
       (11, 7);
