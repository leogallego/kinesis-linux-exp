# Data Model: Project Documentation

**Feature**: 004-project-documentation
**Date**: 2026-03-08

## Entities

This feature is documentation-focused and does not introduce new data entities to the application. The deliverables are two files:

### README.md (modified)

- **Type**: Markdown documentation file
- **Location**: Repository root (`/README.md`)
- **Sections**: Project overview, supported hardware, screenshot, development setup, GitHub Pages deployment, container deployment, contribution guidelines, V-Drive architecture, license
- **Relationships**: References existing project files (screenshots, LICENSE, Containerfile)

### Containerfile (new)

- **Type**: OCI container build definition
- **Location**: Repository root (`/Containerfile`)
- **Base image**: `nginx:alpine`
- **Content**: Copies static files (HTML, CSS, JS, assets) into nginx's default serving directory
- **Exposed port**: 8080
- **Relationships**: Depends on all static app files (index.html, css/, js/, assets/)

## No Application Data Model Changes

This feature does not modify the application's runtime data model. The V-Drive file formats, key maps, LED effects, and settings parsing remain unchanged.
