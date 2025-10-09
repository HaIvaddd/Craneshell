# CraneShell - Component Diagram

## Overview
This document presents the Component Diagram for the CraneShell application. This diagram illustrates the high-level software components that make up the system, their responsibilities, and the interfaces through which they communicate. It provides a view of the system's logical architecture and the dependencies between its primary parts.

## Component Diagram Schema

![Component Diagram](/docs/diagrams/component_diagram.png)

## Component Diagram Description

The CraneShell system is designed based on a classic client-server architecture, divided into three primary logical components:

### Components:

1.  **Frontend Application (Client-Side Component)**:
    *   **Description**: This is a Single Page Application (SPA) that runs entirely in the user's web browser. It is responsible for rendering the user interface, managing all user interactions, and handling the client-side application state.
    *   **Technology**: Vue.js / React, TypeScript, Tailwind CSS.
    *   **Key Responsibilities**:
        *   Displaying the theme gallery and editor controls.
        *   Providing the real-time terminal preview using the `xterm.js` library.
        *   Performing client-side validation on user inputs.
        *   Communicating with the Backend API to fetch and store data.

2.  **Backend API (Server-Side Component)**:
    *   **Description**: This is a stateless RESTful API server that contains all the core business logic of the application. It serves as the single source of truth for all user data and configurations.
    *   **Technology**: Python (FastAPI / Django).
    *   **Key Responsibilities**:
        *   Handling user authentication and authorization.
        *   Performing CRUD (Create, Read, Update, Delete) operations for user-saved configurations (`UserConfig`).
        *   Serving the list of public themes (`PublicTheme`).
        *   Generating the final `.toml` file from a given JSON configuration.

3.  **Database (Persistence Component)**:
    *   **Description**: This component is responsible for the persistent storage of all application data.
    *   **Technology**: PostgreSQL.
    *   **Key Responsibilities**:
        *   Storing user account information (usernames, hashed passwords).
        *   Storing all user-saved configurations.
        *   Storing the public themes available in the gallery.

### Interfaces:

*   **REST API**: This is the primary interface in the system. The **Backend API** provides this interface, and the **Frontend Application** consumes (requires) it. All communication between the client and server, such as logging in, saving a configuration, or requesting a file download, happens through this well-defined HTTP-based API.
*   **Database Interface (e.g., ORM)**: The **Backend API** uses a database driver and typically an Object-Relational Mapper (ORM) like SQLAlchemy or Django ORM to communicate with the **Database** component. This interface is internal to the server-side.