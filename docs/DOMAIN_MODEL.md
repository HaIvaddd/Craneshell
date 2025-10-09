# CraneShell - Domain Model Class Diagram

## Overview
This document describes the key entities and their relationships within the CraneShell application domain, based on the Software Requirements Specification (SRS). This model serves as a conceptual foundation for the system's database schema and object-oriented design.

## Class Diagram Schema

![Class Diagram](/docs/diagrams/domain_model.png)

## Class Diagram Description

The core domain of CraneShell revolves around user management, terminal configurations (themes), and personal user libraries. The main entities are:

*   **`User`**: The central actor. All personal configurations are owned by and scoped to a specific user.
*   **`UserConfig`**: Represents a complete Alacritty configuration that has been customized and saved by a user.
*   **`PublicTheme`**: Represents a pre-made, read-only configuration template available to all users in a public gallery.
*   **`AuthToken`**: Represents a valid session for an authenticated user, typically a JWT.

The following diagram illustrates the relationships between these entities:


### Key Relationships Explained:

1.  **User - AuthToken (One-to-Many)**:
    *   A single `User` can have multiple active `AuthToken` sessions (e.g., being logged in on both a desktop and a laptop). Each `AuthToken` belongs to exactly one `User`.

2.  **User - UserConfig (One-to-Many)**:
    *   A `User` can create and save many `UserConfig` objects to their personal library. Each `UserConfig` is owned by exactly one `User`. This is the core relationship for personal content management.

3.  **PublicTheme Entity**:
    *   The `PublicTheme` entity is a standalone collection of templates. It does not have a direct ownership relationship with a `User`. It serves as a read-only source from which users can start their customizations.

### Attributes:
*   **`User`**: `id` (Primary Key), `username`, `email`, `hashed_password`, `created_at`.
*   **`UserConfig`**: `id` (PK), `name`, `config_data` (JSON), `user_id` (Foreign Key to User), `created_at`, `updated_at`.
*   **`PublicTheme`**: `id` (PK), `name`, `config_data` (JSON).
*   **`AuthToken`**: `id` (PK), `token`, `user_id` (FK to User), `expires_at`.

This model ensures that user-created configurations are securely isolated and provides a clear and scalable structure for managing both public themes and personal user libraries.