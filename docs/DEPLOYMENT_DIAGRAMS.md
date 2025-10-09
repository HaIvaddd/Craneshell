# CraneShell - Deployment Diagram

## Overview
This document provides a Deployment Diagram for the CraneShell application. This diagram illustrates the physical and virtual hardware nodes (servers, devices) and shows how the application's software artifacts (the compiled code, databases, web servers) are mapped onto this infrastructure. It provides a high-level view of the application's runtime architecture.

## Deployment Diagram Schema

![Deployment Diagram](/docs/diagrams/deployment_diagram.png)

## Deployment Diagram Description

The CraneShell application follows a modern client-server architecture deployed on a cloud-based infrastructure.

### Nodes:

1.  **User's Computer**: This represents the end-user's machine (desktop or laptop). It is responsible for running the client-side part of the application.
2.  **Cloud Provider**: A logical grouping representing a cloud service like DigitalOcean, AWS, Heroku, or Vercel. This contains all the server-side infrastructure.
3.  **Web Server Node**: A virtual machine or container within the cloud provider that hosts the core application logic.
4.  **Database Server Node**: A dedicated virtual machine or a managed database service that hosts the PostgreSQL database. Separating the database from the application server is a standard practice for scalability, security, and maintainability.

### Artifacts:

*   **Web Browser**: The software running on the user's computer, responsible for rendering the frontend application.
*   **Frontend SPA (Vue/React)**: The static assets (HTML, CSS, JavaScript) of the Single Page Application that are sent to the browser.
*   **Nginx**: A high-performance web server that acts as a reverse proxy. It receives all incoming traffic, serves the static frontend files, and forwards API requests to the Python application.
*   **Python Application (FastAPI/Django)**: The backend application artifact containing all the business logic, API endpoints, and configuration generation logic. It runs under an application server like Gunicorn or Uvicorn.
*   **PostgreSQL Database**: The running instance of the PostgreSQL server, managing the application's data.

### Communication Paths:

1.  **HTTPS**: The user's browser communicates with the Nginx web server over the secure HTTPS protocol.
2.  **Reverse Proxy (HTTP/Socket)**: Nginx forwards relevant requests internally to the Python application via a local socket or HTTP.
3.  **TCP/IP**: The Python Application connects to the PostgreSQL Database over a standard TCP/IP network connection to perform database queries.
