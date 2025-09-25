# Craneshell

<p align="center">
  <strong>Visually create, customize, and save your Alacritty themes with a live preview.</strong>
</p>

## 🌟 About The Project

Tired of manually editing your `.toml` file and restarting Alacritty just to see a small color change? **Craneshell** solves this by providing an intuitive, web-based GUI to style your terminal. See your changes instantly in a live terminal simulator, tweak every detail from colors to transparency, and download your perfect configuration file with a single click.

Create an account to unlock your personal theme library in the cloud. Save and manage your favorite configurations and access them from any machine, anytime.

### Key Features:
*   🎨 **Theme Gallery:** Start with a collection of popular pre-built themes.
*   🖌️ **Live Editor:** Instantly preview changes to fonts, colors, padding, and opacity.
*   ☁️ **Cloud Library:** Sign up to save, name, and manage your personal theme collection.
*   🚀 **One-Click Download:** Get your ready-to-use `.toml` configuration file instantly.

### Built With
This project is powered by an amazing set of technologies:

*   **Backend:** [FastAPI](https://fastapi.tiangolo.com/)
*   **Frontend:** [Vue.js](https://vuejs.org/) / [React](https://reactjs.org/)
*   **Live Terminal:** [Xterm.js](https://xtermjs.org/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/)
*   **Deployment:** [Docker](https://www.docker.com/)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
*   Python 3.9+
*   Node.js & npm

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/HaIvaddd/Craneshell.git
    cd [your_repo]
    ```
2.  **Backend Setup**
    ```sh
    # Navigate to the backend directory
    cd backend
    # Create a virtual environment
    python -m venv venv
    source venv/bin/activate
    # Install dependencies
    pip install -r requirements.txt
    ```
3.  **Frontend Setup**
    ```sh
    # Navigate to the frontend directory
    cd frontend
    # Install dependencies
    npm install
    ```
4.  **Run the application**
    *   Run the backend server: `uvicorn main:app --reload`
    *   Run the frontend dev server: `npm run dev`

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please feel free to fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📜 Documentation

SRS: ![SRS](/docs/SRS.md)
