# Reborn API

A highly abstracted backend architecture for freelance marketplace applications

## Overview
- Reborn API is a sophisticated backend server designed to power freelance marketplace platforms similar to Upwork. Built with extensibility and abstraction in mind, this project serves as a foundation for building multiple applications with similar domain requirements.
- Project Vision: While currently serving the Reborn application, this backend is architected to potentially evolve into a Backend-as-a-Service (BaaS) platform, enabling rapid development of various marketplace and gig economy applications.
Core Concept
- Reborn connects clients with service providers through a gig-based marketplace:
  - Clients post gigs (job opportunities)
  - Service Providers browse and apply to available gigs
  - Workflow facilitates discovery, application, and engagement between parties

## Architecture Philosophy
This project emphasizes:

- High Abstraction: Core functionality is decoupled from specific business logic
- Reusability: Components designed to serve multiple applications
- Scalability: Architecture supports growth from single app to multi-tenant BaaS
- Maintainability: Clear separation of concerns for long-term evolution

## Technology Stack

- Runtime: Node.js
- Framework: NestJS
- Database: MySQL
- ORM/Query Builder: TypeORM
- Authentication: JWT / OAuth2
