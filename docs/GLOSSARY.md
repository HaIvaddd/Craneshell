# CraneShell - Glossary of Key Terms

**Account (User Account)**
A unique identity within the CraneShell system, created during registration. It is associated with a user's personal library of saved configurations and their authentication credentials.

**Authentication**
The process of verifying a user's identity, typically by validating a username and password combination. Successful authentication in CraneShell results in the issuance of a session token (JWT).

**Authorization**
The process of determining and enforcing the actions an authenticated user is permitted to perform (e.g., creating, updating, or deleting their own saved configurations, but not those of other users).

**Configuration (Theme)**
A complete set of parameters (colors, font, opacity, padding, etc.) that collectively define the visual appearance of the Alacritty terminal. This is the core entity that users create and manipulate within the application.

**Configuration Data**
The JSON object that stores all the key-value pairs for a specific configuration. This data is manipulated by the frontend editor and is used by the backend to generate the final TOML file.

**Download (Generation)**
The process where the backend converts a user's current configuration data (JSON) into a valid TOML file and serves it to the user's browser for saving locally.

**JWT (JSON Web Token)**
A compact, URL-safe means of representing claims to be transferred between two parties. In CraneShell, it is used as a session token to prove a user's authenticated state when making API requests to save or manage configurations.

**Live Preview (Terminal Simulator)**
An interactive component in the web interface, powered by `xterm.js`, that visually represents how the Alacritty terminal will look with the currently applied configuration settings. It updates in real-time as the user adjusts parameters.

**TOML (Tom's Obvious, Minimal Language)**
The configuration file format used by Alacritty. CraneShell's primary function is to generate a well-structured `.toml` file that users can download and use to apply their created theme.

**User Configuration**
A configuration that has been saved by a registered user to their personal library. It is associated with the user's account, has a custom name, and can be loaded, updated, or deleted.