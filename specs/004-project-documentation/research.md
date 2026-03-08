# Research: Project Documentation

**Feature**: 004-project-documentation
**Date**: 2026-03-08

## R1: Container Base Image for Static Site

**Decision**: Use `nginx:alpine` (or `docker.io/library/nginx:alpine`) as the container base image.

**Rationale**: nginx-alpine is the standard lightweight web server for serving static files in containers. The alpine variant produces images typically under 10 MB for the base, keeping the total well under the 50 MB target. nginx handles static file serving efficiently with sensible defaults for caching headers and MIME types.

**Alternatives considered**:
- `httpd:alpine` (Apache) — heavier and more complex configuration than needed for static files
- `caddy:alpine` — good option but less ubiquitous; automatic HTTPS is unnecessary for a local/self-hosted tool
- `busybox:httpd` — minimal but lacks proper MIME type handling and caching headers
- Custom Go/Rust binary — overengineered for serving static files

## R2: Containerfile vs Dockerfile Naming

**Decision**: Use `Containerfile` (OCI standard naming).

**Rationale**: `Containerfile` is the OCI-standard name and works with both Podman and Docker (via `docker build -f Containerfile .`). The project's spec and assumptions already use this naming. Podman users expect `Containerfile` by default. Docker users can use `-f` flag or it auto-detects `Containerfile` in recent versions.

**Alternatives considered**:
- `Dockerfile` — Docker-specific naming; works out of the box with Docker but Podman defaults to `Containerfile`
- Both files — unnecessary duplication

## R3: GitHub Pages Deployment Method

**Decision**: Manual configuration via repository Settings > Pages.

**Rationale**: Clarified during spec phase (Session 2026-03-08, Q1). The project has no build step, so a GitHub Actions workflow adds complexity with no benefit. Manual setup is a one-time configuration: Settings > Pages > Source: Deploy from branch > Branch: `main` / `/ (root)`.

**Alternatives considered**:
- GitHub Actions workflow — rejected; no build step means nothing to automate

## R4: Screenshot Selection for README

**Decision**: Use `redesign-final.png` as the primary README screenshot.

**Rationale**: This screenshot shows the latest UI design (post-sidebar-tabbar-redesign) and gives visitors the most accurate representation of the current app. It shows the full keyboard layout with the sidebar panel visible.

**Alternatives considered**:
- `mvp-initial-load.png` — shows an earlier UI version, not representative of current state
- `screenshot-tabbar-keys.png` — partial view, less impactful as a hero image

## R5: Development Server Command

**Decision**: Document `python3 -m http.server 8000` as the primary development server.

**Rationale**: Python 3 is pre-installed on macOS and virtually all Linux distributions. The built-in HTTP server requires zero installation and serves the static files correctly. Port 8000 is the default and rarely conflicts with other services.

**Alternatives considered**:
- `npx serve` — requires Node.js, which the project explicitly avoids
- `php -S localhost:8000` — PHP is less commonly pre-installed than Python
- VS Code Live Server extension — IDE-specific, not universally available
- Direct file:// opening — breaks File System Access API and CORS for ES modules

## R6: Container Exposed Port

**Decision**: Expose port 8080 in the container.

**Rationale**: Port 8080 is the conventional HTTP alternative port, avoids conflicts with host port 80 (which may require root/elevated privileges), and is the standard for containerized web applications.

**Alternatives considered**:
- Port 80 — may conflict with host services; some container runtimes don't allow binding to privileged ports without configuration
- Port 3000 — more associated with Node.js development servers
