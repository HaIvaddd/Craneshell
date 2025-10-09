# CraneShell - Activity Diagrams

## Overview
Activity diagrams are used to model the dynamic aspects of the system. They provide a visual representation of the flow of actions and decisions, effectively illustrating the workflow from a starting point to an end point. This section details the primary workflow a user follows within the application's main editor.

## Main Editor Workflow

### Description
This diagram models the core user journey within the CraneShell application. It begins when a user lands on the editor page and proceeds through the customization process, culminating in one of two possible outcomes: downloading the configuration as a guest or saving it as an authenticated user. This workflow represents the primary value proposition of the application.

### Diagram

![Main Editor Workflow](/docs/diagrams/activity_diagram.png)

### Workflow Steps Explained:

1.  **Initialization**: The process begins when the user opens the editor page. They can either start customizing the default theme or select a pre-made theme from the gallery to use as a starting point.

2.  **Customization Loop**: The user enters an iterative cycle of making adjustments.
    *   The user modifies a parameter (e.g., changes a color, adjusts opacity, selects a font).
    *   The frontend application immediately updates the `xterm.js` terminal simulator to provide a real-time preview of the change.
    *   This loop continues as long as the user wishes to make further customizations.

3.  **User Decision Point**: Once the user is satisfied with their theme, they must decide on the next action. The workflow diverges here based on their choice.

4.  **Path A: "Download" Action**:
    *   If the user clicks "Download", the frontend sends the current configuration data (in JSON format) to the backend API.
    *   The backend processes this data, generates a valid `.toml` file.
    *   The browser then prompts the user to save the generated file to their local machine. The process concludes here.

5.  **Path B: "Save" Action**:
    *   If the user clicks "Save", the system first checks if the user is authenticated.
    *   **If Authenticated**: The application displays a modal asking the user to name their configuration. Upon confirmation, the backend saves the configuration to that user's personal library, and a success notification is shown. The process concludes.
    *   **If Not Authenticated**: The user is redirected to the Login/Registration page, as saving is a feature reserved for registered users. This provides an incentive for guests to create an account.