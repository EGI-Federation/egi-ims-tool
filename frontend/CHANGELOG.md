# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.0.55
- Added notifications support
- Reviewed usage of datetimes (UI is local, all from/to APIs is UTC)
- Configurable page sizes for notifications and role assignment logs

## 1.0.52
- Global role management complete, including role inheritance
- Added role assignment logs
- Added process responsibilities management
- Added governance management
- Changed Management System process code from SYS to IMS

* UI improvements

## 1.0.37
- Added pages for all processes and for the Management System (SYS process)
- Added sign-in with EGI Check-in
- Added Postgres DB connection
- Process management complete
- Process specific role management complete
- Added LoA to the user menu
- Added Italian translation
- Added SSL terminator container (Nginx reverse proxy)
- Added Docker compose based deployment

* Fixed missing hover highlight in menu _This Process_

## 1.0.0
- Initial release
