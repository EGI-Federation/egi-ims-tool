
# EGI Integrated Management System Tools

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/EGI-Federation/egi-ims-tool?color=darkcyan&label=Release&include_prereleases)
![GitHub issues](https://img.shields.io/github/issues/EGI-Federation/egi-ims-tool?label=Issues)
![GitHub issue custom search in repo](https://img.shields.io/github/issues-search/EGI-Federation/egi-ims-tool?label=Bugs&color=red&query=is%3Aopen%20label%3Abug)

[EGI](https://www.egi.eu/egi-federation/) is a federation of computing and storage resource providers united by a
mission to support research and development, coordinated by the EGI Foundation. EGI uses an
[Integrated Management System](https://confluence.egi.eu/display/IMS/Integrated+Management+System+%28IMS%29+Home) (IMS)
to efficiently plan, deliver, track, monitor, and account for the [offered services](https://www.egi.eu/services), while
constantly improving the service delivery to its customers.

The EGI IMS is based on [FitSM](https://www.fitsm.eu) and consists of a collection of Confluence pages,
Jira tickets, and miscellaneous supporting documents (e.g. agreements, reports). The processes, as well as the roles
and procedures in each process, are documented in the EGI Confluence, in dedicated sections for each process.

The processes of the EGI IMS are currently implemented by manually executed procedures described in Confluence pages.
The steps in (some of) these procedures are (very) hard to understand and/or challenging to perform in the correct
sequence time after time, as required for repeatable processes prescribed by ITSM Coordination.

The EGI IMS Tools service alleviates this pain by offering an easy-to-use web interface dedicated to the EGI IMS.

With [EGI IMS Tools](https://ims.egi.eu) you can:

- Perform procedures in ISM processes easily, with enforced step-by-step workflows.
- Perform procedures in ISM processes in the same way time after time.
- Use APIs to programmatically query IMS information and perform operations.
- Run ISM procedures on a schedule, without human intervention.
- Generate reports on a schedule, share, and archive them without human intervention.
- Notify IMS participants about changes relevant to their roles and tasks they have to perform periodically.
- Define KPIs and collect measurements in a uniform, formal, and automated way.
- Monitor IMS processes and their KPIs in real-time for all the IT services offered with the help of the EGI IMS.
- Centrally control access to all aspects of ISM with role-based policies.

## Processes

The following IMS processes are currently supported by this tool:

- [Capacity Management](https://github.com/EGI-Federation/egi-capacity-management)
- [Service Level Management](https://github.com/EGI-Federation/egi-service-level-management)

## Supporting services

The following components support the ones that implement the processes of the IMS:

- [Configuration Service](https://github.com/EGI-Federation/egi-ims-config)
- [Messaging Service](https://github.com/EGI-Federation/egi-ims-messaging)
- [Document Service](https://github.com/EGI-Federation/egi-ims-docs)

## Configuration and deployment

For details on how to configure, build, and deploy the EGI IMS Tool, [look here](deploy/DEPLOYING.md).
