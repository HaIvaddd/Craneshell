# CraneShell - State Diagram

## Overview
This document provides a State Diagram for the CraneShell application. A state diagram is used to model the lifecycle of a single object or component, showing the various states it can be in and the events that cause it to transition from one state to another. For CraneShell, the most complex and stateful component is the main **Editor Page**, which is the subject of this diagram.

## Editor Page State Diagram (Detailed with Error Handling)

### Description
This diagram provides a comprehensive model of the editor's data state lifecycle, including crucial error handling paths. It moves beyond the "happy path" to illustrate how the application should behave during asynchronous operations (loading, saving) and how it recovers from failures. This model is essential for building a robust and predictable user experience.

### Diagram
![Editor Page State Diagram (Detailed)](/docs/diagrams/state_diagram.png)

### States and Transitions Explained:

1.  **`Loading` State**:
    *   **Description**: The initial state when the editor page is first accessed. The frontend is performing an asynchronous operation to fetch initial data (e.g., public themes, user's saved configurations).
    *   **UI Behavior**: The main editor is likely disabled or covered by a loading spinner.
    *   **Transitions**:
        *   `onDataLoadSuccess`: If the data is fetched successfully, the state transitions to `Pristine`.
        *   `onDataLoadFailure`: If the network request fails, the state transitions to `Error`.

2.  **`Pristine` State**:
    *   **Description**: The "clean" or "unchanged" state. The configuration displayed in the editor is in sync with the last saved or loaded version.
    *   **UI Behavior**: The "Save" button is disabled as there are no new changes to save.
    *   **Transition**:
        *   `user changes parameter`: As soon as the user modifies any setting, the state immediately transitions to `Dirty`.

3.  **`Dirty` State**:
    *   **Description**: This state indicates that the user has made unsaved changes to the configuration.
    *   **UI Behavior**: The "Save" button is enabled to allow the user to persist their work.
    *   **Transitions**:
        *   `user clicks "Save"`: The application attempts to save the changes, moving to the `Saving` state.
        *   `user reverts all changes`: If the user manually undoes all modifications, the state returns to `Pristine`.

4.  **`Saving` State**:
    *   **Description**: A temporary, asynchronous state that occurs while the frontend is waiting for the backend to confirm that the configuration has been saved.
    *   **UI Behavior**: The "Save" button is disabled, and a loading indicator (e.g., a spinner) is shown to provide feedback.
    *   **Transitions**:
        *   `onSaveSuccess`: If the backend confirms the save, the new state becomes the baseline, and the state transitions to `Pristine`.
        *   `onSaveFailure`: If the save operation fails (e.g., server error, network issue), the state transitions to `Error`.

5.  **`Error` State**:
    *   **Description**: A state indicating that a previous asynchronous operation has failed.
    *   **UI Behavior**: An error message (e.g., a toast notification or an alert box) is displayed to the user.
    *   **Transitions**:
        *   `user dismisses error`: The user acknowledges the error (e.g., clicks "OK"). The application returns to the `Dirty` state, as the unsaved changes still exist.
        *   `user clicks "Retry Save"`: If the UI provides a retry mechanism, the application can transition directly back to the `Saving` state to attempt the operation again.