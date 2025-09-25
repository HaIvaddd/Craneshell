# Software Requirements Specification (SRS) for Craneshell

---

# Table of Contents
1 [Introduction](#introduction)  
1.1 [Purpose](#purpose)  
1.2 [Business Requirements](#business-requirements)  
1.2.1 [Background](#background)  
1.2.2 [Business Opportunities](#business-opportunities)  
1.2.3 [Project Scope](#project-scope)  
1.3 [Analogs](#analogs)  
2 [User Requirements](#user-requirements)  
2.1 [Software Interfaces](#software-interfaces)  
2.2 [User Interface](#user-interface)  
2.3 [User Characteristics](#user-characteristics)  
2.3.1 [User Classes](#user-classes)  
2.3.2 [Application Audience](#application-audience)  
2.3.2.1 [Primary Audience](#primary-audience)  
2.3.2.2 [Secondary Audience](#secondary-audience)  
2.4 [Assumptions and Dependencies](#assumptions-and-dependencies)  
3 [System Requirements](#system-requirements)  
3.1 [Functional Requirements](#functional-requirements)  
3.1.1 [Core Functions](#core-functions)  
3.1.1.1 [New User Registration](#user-registration)  
3.1.1.2 [User Login and Logout](#user-login-logout)  
3.1.1.3 [Theme Gallery Browsing](#theme-browsing)  
3.1.1.4 [Theme Customization and Live Preview](#theme-customization)  
3.1.1.5 [Personal Configuration Management](#config-management)  
3.1.1.6 [Configuration File Download](#config-download)  
3.1.2 [Constraints and Exclusions](#constraints-and-exclusions)  
3.2 [Non-Functional Requirements](#non-functional-requirements)  
3.2.1 [Quality Attributes](#quality-attributes)  
3.2.1.1 [Usability Requirements](#usability-requirements)  
3.2.1.2 [Security Requirements](#security-requirements)  
3.2.1.3 [Performance Requirements](#performance-requirements)  
3.2.2 [External Interfaces](#external-interfaces)  
3.2.3 [Constraints](#constraints)  
3.2.4 [Architectural Requirements](#architectural-requirements)  

<a name="introduction"/>

# 1 Introduction

<a name="purpose"/>

## 1.1 Purpose
This document describes the functional and non-functional requirements for the web application **Craneshell**. The application serves as a visual configurator for the Alacritty terminal, allowing users to create, customize, and save themes with a real-time preview. This document is intended for the development team implementing and testing the application.

<a name="business-requirements"/>

## 1.2 Business Requirements

<a name="background"/>

### 1.2.1 Background
Alacritty is a popular, fast, GPU-accelerated terminal emulator. Its configuration is managed through a text-based `.toml` file. While powerful, this method can be cumbersome for theme customization. Users must manually edit color codes and other parameters, save the file, and often restart the terminal to see the results. This trial-and-error process is inefficient and has a steep learning curve for new users.

<a name="business-opportunities"/>

### 1.2.2 Business Opportunities
Craneshell provides users with a simple and interactive platform to visually configure their Alacritty terminal. Users can choose from pre-made themes, adjust every visual aspect with intuitive controls, and see the results instantly in a web-based terminal simulator. For registered users, it offers a cloud-based library to save and manage their configurations, solving the problem of synchronizing dotfiles across multiple machines.

<a name="project-scope"/>

### 1.2.3 Project Scope
The application is a web service that allows both guest and registered users to create Alacritty configurations. Registered users gain the ability to save and manage their configurations in a personal library. The project is educational and does not imply monetization. The MVP (Minimum Viable Product) will focus exclusively on the Alacritty terminal.

<a name="analogs"/>

## 1.3 Analogs
*   **GitHub Dotfiles Repositories:** The current standard for sharing themes. Users browse repositories and manually copy-paste configurations. This method lacks interactivity and live previews.
*   **themes.vscode.one:** A web-based theme editor for Visual Studio Code. It provides a similar visual editing experience but is targeted at a different application and configuration format (JSON).
*   **Themer.dev / Base16:** Tools that generate themes for a wide range of applications simultaneously. Craneshell differs by offering a deeper, more focused, and interactive customization experience specifically tailored to Alacritty's unique properties (e.g., opacity, padding).

<a name="user-requirements"/>

# 2 User Requirements

<a name="software-interfaces"/>

## 2.1 Software Interfaces
*   **Backend:** Python application using the FastAPI or Django framework.
*   **Frontend:** Single Page Application (SPA) built with Vue.js or React, using TypeScript and Tailwind CSS.
*   **API Communication:** RESTful API for client-server communication.
*   **Data Storage:** PostgreSQL database for storing user data and saved configurations.
*   **Terminal Simulation:** The `xterm.js` library will be used on the frontend to provide a live preview.
*   **Authentication:** JWT (JSON Web Tokens) for securing API endpoints.

<a name="user-interface"/>

## 2.2 User Interface

**Main page**
![Main page](/docs/mockups/Main%20page.png)

**Login**
![Login](/docs/mockups/Login.png)

**Profile**
![Profile](/docs/mockups/Profile.png)

**Configurator**
![Configurator](/docs/mockups/Configurator.png)

<a name="user-characteristics"/>

## 2.3 User Characteristics

<a name="user-classes"/>

### 2.3.1 User Classes

| User Class | Description |
| :--- | :--- |
| Unauthenticated User (Guest) | A user who is not logged in. Can create and download themes but cannot save them to a personal library. |
| Authenticated User | A user who has successfully logged in. Has full access to all guest features, plus the ability to save, view, and manage their personal configuration library. |

<a name="application-audience"/>

### 2.3.2 Application Audience

<a name="primary-audience"/>

#### 2.3.2.1 Primary Audience
Users of the Alacritty terminal, from beginners to power users, who want a faster and more intuitive way to customize their terminal's appearance.

<a name="secondary-audience"/>

#### 2.3.2.2 Secondary Audience
Developers interested in a modern web stack involving Python, a frontend framework like Vue/React, and interactive libraries like `xterm.js`.

<a name="assumptions-and-dependencies"/>

## 2.4 Assumptions and Dependencies
1.  The user has a working installation of Alacritty on their local machine to use the downloaded configuration files.
2.  The `xterm.js` simulator on the frontend is a close-enough representation of the actual Alacritty terminal for theme preview purposes.
3.  A stable internet connection is required to access the web service.

<a name="system-requirements"/>

# 3 System Requirements

<a name="functional-requirements"/>

## 3.1 Functional Requirements

<a name="core-functions"/>

### 3.1.1 Core Functions

<a name="user-registration"/>

#### 3.1.1.1 New User Registration
**Description.** A user must be able to create a new account to save their configurations.

| Function | Requirements |
| :--- | :--- |
| Data Input | The frontend provides a form for entering a username, email, and password. |
| API Call | Form submission triggers a POST request to the Python backend API (e.g., `/api/v1/auth/register`). |
| Data Validation | The backend validates uniqueness of username/email against the PostgreSQL `users` table and checks password strength. |
| Account Creation | Upon success, the backend creates a user record in PostgreSQL, hashes the password (using bcrypt), and returns a success response. |

<a name="user-login-logout"/>

#### 3.1.1.2 User Login and Logout
**Description.** A registered user must be able to log in and log out.

| Function | Requirements |
| :--- | :--- |
| Authentication | The frontend sends credentials to the backend API (e.g., `/api/v1/auth/login`). |
| JWT Generation & Session | Upon success, the backend generates a JWT. This token is stored securely by the frontend and included in subsequent authenticated API requests. |
| Logout | The frontend clears the authentication token. |

<a name="theme-browsing"/>

#### 3.1.1.3 Theme Gallery Browsing
**Description.** A user must be able to browse a collection of pre-made themes.

| Function | Requirements |
| :--- | :--- |
| View Gallery | The frontend fetches a list of public themes from the backend API (e.g., `GET /api/v1/themes`). |
| Select Theme | Clicking a theme in the gallery loads its settings into the main editor and updates the live preview. This is a frontend operation. |

<a name="theme-customization"/>

#### 3.1.1.4 Theme Customization and Live Preview
**Description.** The user must be able to modify theme parameters and see the changes in real-time.

| Function | Requirements |
| :--- | :--- |
| Interactive Controls | The frontend provides UI elements (color pickers, sliders, input fields) to modify theme parameters (e.g., colors, font, opacity, padding). |
| Live Update | Any change in the UI controls immediately updates the styles of the `xterm.js` terminal instance on the frontend. This does not require a backend call. |

<a name="config-management"/>

#### 3.1.1.5 Personal Configuration Management
**Description.** An authenticated user must be able to save and manage their custom configurations.

| Function | Requirements |
| :--- | :--- |
| Save Configuration | The frontend sends the current configuration data (as a JSON object) along with a name to the backend (e.g., `POST /api/v1/user/configs`). The backend saves this to the `user_configs` table in PostgreSQL. |
| View Configurations | The user can view their list of saved configs by fetching from `GET /api/v1/user/configs`. |
| Manage Configurations | The user can load (`GET /api/v1/user/configs/:id`), update (`PUT /api/v1/user/configs/:id`), and delete (`DELETE /api/v1/user/configs/:id`) their saved configurations. |

<a name="config-download"/>

#### 3.1.1.6 Configuration File Download
**Description.** Any user must be able to download their current configuration as a `.toml` file.

| Function | Requirements |
| :--- | :--- |
| File Generation | The frontend sends the current configuration state (JSON) to a backend endpoint (e.g., `POST /api/v1/download/config`). |
| Backend Conversion | The Python backend receives the JSON, converts it into a valid TOML format string, and returns it as a file download with the appropriate `Content-Disposition` header. |

<a name="constraints-and-exclusions"/>

### 3.1.2 Constraints and Exclusions
1.  The application will only support Alacritty in the MVP. Support for other terminals (e.g., Kitty, WezTerm) is out of scope.
2.  There are no social features like sharing, liking, or commenting on public themes in the MVP.
3.  The application will not automatically import themes from Git repositories.
4.  There is no functionality to edit the `.toml` file as raw text within the application.

<a name="non-functional-requirements"/>

## 3.2 Non-Functional Requirements

<a name="quality-attributes"/>

### 3.2.1 Quality Attributes

<a name="usability-requirements"/>

#### 3.2.1.1 Usability Requirements
1.  The user interface should be clean, intuitive, and responsive, adapting to different screen sizes.
2.  The feedback loop during theme customization must be instantaneous (real-time preview).
3.  The process from visiting the site to downloading a customized file should take a minimal number of clicks for a guest user.

<a name="security-requirements"/>

#### 3.2.1.2 Security Requirements
1.  User passwords must be hashed in PostgreSQL using a strong algorithm like bcrypt.
2.  API access to user-specific data must be protected by JWT validation. A user must not be able to access or modify another user's configurations.
3.  All client-server communication should be over HTTPS.
4.  Secrets (JWT keys, DB passwords) must be managed using environment variables, not hardcoded.

<a name="performance-requirements"/>

#### 3.2.1.3 Performance Requirements
1.  API responses for data retrieval should have a latency of < 200ms.
2.  The frontend application's initial load time should be under 3 seconds on a standard connection.
3.  The live preview update on the frontend should be smooth and without noticeable lag.

<a name="external-interfaces"/>

### 3.2.2 External Interfaces
1.  The web application must be fully functional on modern web browsers (Chrome, Firefox, Safari, Edge).
2.  The UI must be responsive for use on desktop, tablet, and mobile devices (though desktop is the primary target).

<a name="constraints"/>

### 3.2.3 Constraints
1.  The backend must be implemented in Python (FastAPI or Django).
2.  The primary data store must be PostgreSQL.
3.  The frontend must be implemented as an SPA using Vue.js or React.

<a name="architectural-requirements"/>

### 3.2.4 Architectural Requirements
1.  **Architecture:** A monolithic backend architecture is preferred for the MVP for simplicity of development and deployment. The code should be well-structured to allow for potential future separation into services.
2.  **Database:** A single PostgreSQL database will serve as the data store for all application data.
3.  **Frontend-Backend Separation:** The system will have a clear separation between the frontend (handling UI and client-side state) and the backend (providing a stateless REST API).
4.  **Authentication:** JWT will be the mechanism for stateless authentication. The token will be generated by the backend and managed by the frontend.









