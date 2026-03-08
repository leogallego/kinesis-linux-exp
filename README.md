# Edge RGB Configurator

A browser-based configurator for the **Kinesis Freestyle Edge RGB** keyboard. The app reads and writes V-Drive configuration files (key layouts, macros, RGB lighting) entirely in the browser — no backend, no install, deployable on GitHub Pages.

![Edge RGB Configurator interface](redesign-final.png)

## Supported Hardware

- Kinesis Freestyle Edge RGB (KB975)
  - KB975-BLU (Cherry MX Blue)
  - KB975-RED (Cherry MX Red)
  - KB975-BRN (Cherry MX Brown)
  - KB975-SIL (Cherry MX Silver)

No other Kinesis products are supported.

## Technology Stack

- **Language**: Vanilla JavaScript (ES2022+)
- **Markup/Style**: HTML5 + CSS3
- **Build step**: None (no bundler, no npm, no Node.js)
- **Deployment**: Static site (GitHub Pages or container)

## Development

### Prerequisites

- Git
- A modern web browser (Chrome or Edge recommended for [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API) support; Firefox works with upload/download fallback)
- Python 3 (for the built-in HTTP server)

No npm, Node.js, or build tools are required.

### Getting Started

```bash
git clone https://github.com/<your-username>/kinesis-linux-exp.git
cd kinesis-linux-exp
python3 -m http.server 8000
```

Open `http://localhost:8000` in your browser.

If port 8000 is already in use, specify an alternative:

```bash
python3 -m http.server 9000
```

### Testing with a Physical Keyboard

1. Plug in the Kinesis Freestyle Edge RGB keyboard
2. Press and hold **Progm + F1** to enter SmartSet programming mode — the V-Drive mounts as a USB mass storage device
3. In the app, click **Open Directory** and select the mounted V-Drive
4. Make your changes (key remaps, macros, lighting)
5. Click **Save** to write changes to the V-Drive files
6. Eject the V-Drive from your OS, then press **Progm** on the keyboard to apply changes

## Deployment

### GitHub Pages

1. Go to your repository **Settings** > **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Choose branch `main` and folder `/ (root)`
4. Click **Save**
5. Wait a few minutes for the deployment to complete
6. Access the app at `https://<username>.github.io/<repo-name>/`

> **Note**: GitHub Pages requires a public repository. Private repositories require GitHub Pro, Team, or Enterprise.

### Container

The project includes a `Containerfile` for portable deployment using any OCI-compatible container runtime.

**Prerequisites**: [Podman](https://podman.io/) or [Docker](https://www.docker.com/)

Build the image:

```bash
podman build -t edge-rgb-configurator .
```

Run the container:

```bash
podman run -d -p 8080:8080 edge-rgb-configurator
```

Open `http://localhost:8080` in your browser.

**Using Docker instead**:

```bash
docker build -t edge-rgb-configurator .
docker run -d -p 8080:8080 edge-rgb-configurator
```

The image uses `nginx:alpine` and should be under 50 MB.

## Contributing

### Branching Strategy

All work is done in feature branches off `main`. Direct commits to `main` are not permitted.

Branch naming convention: `NNN-feature-name` (e.g., `004-project-documentation`).

### Code Conventions

- Vanilla JavaScript (ES2022+) — no frameworks, no build tools, no npm
- HTML5 + CSS3
- Each commit represents a single logical change

### Submitting Changes

1. Create a feature branch from `main`
2. Make your changes
3. Push the feature branch
4. Open a pull request

### V-Drive Architecture

The keyboard exposes a 4 MB USB mass storage device (the "V-Drive") containing plain text configuration files. This is the only interface for programming the keyboard.

```
V-Drive/
├── layouts/           # Key remaps and macros
│   ├── layout1.txt    # Profile 1 (up to layout9.txt)
│   └── ...
├── lighting/          # RGB LED effects
│   ├── led1.txt       # Profile 1 lighting (up to led9.txt)
│   └── ...
└── settings/
    └── kbd_settings.txt  # Global keyboard settings
```

The `vdrive/` directory in this repository contains sample V-Drive files for testing without a physical keyboard.

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).
