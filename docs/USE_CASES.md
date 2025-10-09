# CraneShell - Use Case Analysis

## Actors
1.  **Unauthenticated User (Guest)**: A user who is not logged in. Can browse, create, and download configurations but cannot save them to a personal library.
2.  **Authenticated User**: A registered user who has successfully logged into the system. This actor can perform all guest actions and also save and manage their personal library of configurations.


## Use Case Scenarios

### UC1: Register New Account

**Actor:** Unauthenticated User
**Precondition:** The user is not logged in.
**Flow of Events:**
1.  The user clicks the "Register" or "Sign Up" button.
2.  The frontend displays a registration form with fields for `Username`, `Email`, `Password`, and `Confirm Password`.
3.  The user fills in the form and submits it.
4.  The frontend performs basic client-side validation (e.g., email format, password matching).
5.  The frontend sends a `POST /api/v1/auth/register` request to the Python backend with the form data.
6.  The backend receives the request:
    a. Validates that the username and email are unique by querying the PostgreSQL `users` table.
    b. Hashes the password using bcrypt.
    c. Persists the new user record (`username`, `email`, `hashed_password`) in the `users` table.
7.  The service returns a `201 Created` status on success.
8.  The frontend receives the response, displays a success message, and redirects the user to the login page.
    **Alternative Flow (A):** Validation fails (e.g., username is taken).
    *   6a. The backend returns a `4xx` error (e.g., `409 Conflict` for duplicates, `400 Bad Request` for invalid data) with a descriptive message.
    *   6b. The frontend displays the error message to the user next to the relevant form field.
        **Postcondition:** A new user account is created in the system.

### UC2: Login

**Actor:** Unauthenticated User
**Precondition:** The user is on the login page.
**Flow of Events:**
1.  The user enters their `Username` and `Password` and clicks "Login".
2.  The frontend sends a `POST /api/v1/auth/login` request to the backend with the credentials.
3.  The backend receives the request:
    a. Finds the user by `username` in the PostgreSQL database.
    b. Uses bcrypt to compare the provided password with the stored hash.
4.  If the credentials are valid, the backend generates a JWT containing the user's ID.
5.  The JWT is returned in the response body.
6.  The frontend receives the token, stores it securely (e.g., in `localStorage` or a cookie), and redirects the user to the main editor page.
    **Alternative Flow (A):** Invalid credentials.
    *   4a. The backend returns a `401 Unauthorized` status.
    *   4b. The frontend displays a generic "Invalid username or password" message.
        **Postcondition:** The user is authenticated, and an active session is established via the JWT.

### UC3: Customize and Download a Configuration (Guest Flow)

**Actor:** Unauthenticated User (Guest)
**Precondition:** The user is on the main editor page.
**Flow of Events:**
1.  The user browses the public theme gallery and selects a base theme, or starts from the default.
2.  The user interacts with UI controls (color pickers for theme colors, sliders for opacity/padding, dropdowns for fonts).
3.  The frontend updates its state and instantly re-renders the `xterm.js` terminal simulator to reflect the changes. This happens entirely on the client-side.
4.  Once satisfied, the user clicks the "Download" button.
5.  The frontend gathers the current configuration state into a JSON object.
6.  The frontend sends a `POST /api/v1/download/config` request to the backend, with the configuration JSON in the request body.
7.  The backend receives the request:
    a. Validates the incoming JSON structure.
    b. Uses a Python library (e.g., `toml`) to convert the JSON object into a valid Alacritty `.toml` formatted string.
8.  The backend returns a response with the TOML string as the body and a `Content-Disposition: attachment; filename="alacritty.toml"` header.
9.  The user's browser prompts them to save the `.toml` file.
    **Alternative Flow (A):** Malformed JSON from client.
    *   7a. The backend fails to parse the JSON and returns a `400 Bad Request` error.
    *   7b. The frontend displays a generic error notification like "Failed to generate configuration."
        **Postcondition:** The user has a ready-to-use `alacritty.toml` file on their local machine.

### UC4: Save Custom Configuration to Library

**Actor:** Authenticated User
**Precondition:** The user is logged in and has made customizations in the editor.
**Flow of Events:**
1.  The user clicks the "Save" button.
2.  The frontend displays a modal asking for a name for the new configuration (e.g., "My Nord Theme").
3.  The user enters a name and confirms.
4.  The frontend sends a `POST /api/v1/user/configs` request to the backend. The request includes the JWT in the `Authorization` header and a body containing the configuration name and its JSON data.
5.  The backend receives the request:
    a. Validates the JWT to authenticate the user and get their ID.
    b. Validates that the configuration name is not empty and is unique for that user.
    c. Creates a new record in the `user_configs` table, storing the `name`, `config_data` (JSON), and the `user_id`.
6.  The service returns a `201 Created` status with the data of the newly created configuration.
7.  The frontend closes the modal, shows a "Successfully saved!" notification, and may update the UI to reflect that the current state is saved.
    **Alternative Flow (A):** Configuration name already exists.
    *   5b. The backend returns a `409 Conflict` error with the message "A configuration with this name already exists."
    *   5c. The frontend displays this error message within the modal, allowing the user to enter a different name.
        **Postcondition:** The user's custom configuration is persisted in their personal library and is available for future use.