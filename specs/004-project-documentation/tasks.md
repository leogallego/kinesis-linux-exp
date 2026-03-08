# Tasks: Project Documentation

**Input**: Design documents from `/specs/004-project-documentation/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Not requested. No test tasks included.

**Organization**: Tasks are grouped by user story. Since most tasks modify a single file (README.md), parallelism is limited. The Containerfile is the only independently parallelizable deliverable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Create the Containerfile (independent of README, needed before US4 documentation)

- [x] T001 [P] Create Containerfile at `/Containerfile` using `nginx:alpine` base image, copy static files (index.html, css/, js/, assets/) to nginx serving directory, configure nginx to listen on port 8080, and expose port 8080. Only copy application files — exclude reference materials (PDFs, XMLs, PNGs at root, .specify/, specs/, vdrive/)

**Checkpoint**: Containerfile exists and can be built with `podman build -t edge-rgb-configurator .`

---

## Phase 2: User Story 1 - Understand the Project Purpose (Priority: P1) MVP

**Goal**: A visitor reads the README and understands what the app does, what keyboard it supports, and sees a screenshot.

**Independent Test**: Read the README and confirm a newcomer can answer: "What does this app do? What keyboard does it support? What technology does it use?"

### Implementation for User Story 1

- [x] T002 [US1] Write the README header and project description section in `/README.md`. Replace the existing one-line content. Include: project name (Edge RGB Configurator), one-paragraph description explaining it is a browser-based configurator for the Kinesis Freestyle Edge RGB keyboard that reads/writes V-Drive configuration files, and the technology stack (vanilla JavaScript, no framework, no build step, deployable on GitHub Pages). Reference FR-001
- [x] T003 [US1] Add supported hardware section to `/README.md` listing the Kinesis Freestyle Edge RGB (KB975) and its variants (KB975-BLU, KB975-RED, KB975-BRN, KB975-SIL). Reference FR-002
- [x] T004 [US1] Add a screenshot section to `/README.md` embedding `redesign-final.png` with alt text describing the app interface. Use relative path. Reference FR-003

**Checkpoint**: README has project overview, hardware list, and screenshot. A visitor can understand the project purpose.

---

## Phase 3: User Story 2 - Set Up a Development Environment (Priority: P1)

**Goal**: A contributor follows README instructions to run the app locally within 5 minutes.

**Independent Test**: Follow the documented steps on a fresh clone and confirm the app loads in a browser.

### Implementation for User Story 2

- [x] T005 [US2] Add a "Development" section to `/README.md` with prerequisites subsection listing: Git, a modern web browser (Chrome or Edge recommended for File System Access API), and Python 3 (for the built-in HTTP server). Note that no npm/Node.js/build tools are required. Reference FR-004
- [x] T006 [US2] Add step-by-step development setup instructions to `/README.md`: clone the repo, cd into the directory, run `python3 -m http.server 8000`, open `http://localhost:8000` in browser. Include a note about using an alternative port if 8000 is in use (`python3 -m http.server 9000`). Reference FR-005
- [x] T007 [US2] Add a "Testing with a Physical Keyboard" subsection to `/README.md` explaining the V-Drive mount/eject cycle: plug in keyboard, hold Progm+F1 to enter SmartSet mode, V-Drive mounts as USB storage, use the app to open the V-Drive directory, eject the drive and press Progm to apply changes. Reference FR-005 acceptance scenario 3

**Checkpoint**: README has complete development setup instructions. A contributor can run the app locally.

---

## Phase 4: User Story 3 - Deploy to GitHub Pages (Priority: P2)

**Goal**: A maintainer follows README instructions to deploy the app to GitHub Pages via manual repository settings.

**Independent Test**: Follow the documented steps and verify the app loads at the GitHub Pages URL.

### Implementation for User Story 3

- [x] T008 [US3] Add a "Deployment — GitHub Pages" section to `/README.md` with step-by-step instructions: go to repository Settings > Pages, select source "Deploy from a branch", choose branch `main` and folder `/ (root)`, click Save, wait for deployment, access at `https://<username>.github.io/<repo-name>/`. Include a note that GitHub Pages requires a public repository (or GitHub Pro/Team for private repos). Reference FR-006

**Checkpoint**: README has GitHub Pages deployment instructions.

---

## Phase 5: User Story 4 - Build and Run a Container (Priority: P2)

**Goal**: A user follows README instructions to build and run the app in a container.

**Independent Test**: Build the container image and run it, confirm the app loads at `http://localhost:8080`.

**Depends on**: T001 (Containerfile must exist)

### Implementation for User Story 4

- [x] T009 [US4] Add a "Deployment — Container" section to `/README.md` with: prerequisites (Podman or Docker), build command (`podman build -t edge-rgb-configurator .`), run command (`podman run -d -p 8080:8080 edge-rgb-configurator`), access URL (`http://localhost:8080`), Docker alternative commands (`docker build -t edge-rgb-configurator .` and `docker run -d -p 8080:8080 edge-rgb-configurator`). Note that the image uses nginx:alpine and should be under 50 MB. Reference FR-007

**Checkpoint**: README has container build/run instructions. Users can deploy the app anywhere with a container runtime.

---

## Phase 6: User Story 5 - Contribute to the Project (Priority: P3)

**Goal**: A developer reads the README and understands how to contribute: branching, code style, and workflow.

**Independent Test**: Read the contribution section and confirm it answers: "How do I branch? How do I submit changes? What conventions should I follow?"

### Implementation for User Story 5

- [x] T010 [US5] Add a "Contributing" section to `/README.md` covering: branching strategy (feature branches off `main`, naming convention `NNN-feature-name`), code conventions (vanilla JavaScript ES2022+, no frameworks, no build tools, no npm), and how to submit changes (push feature branch, open a pull request). Reference FR-009
- [x] T011 [US5] Add a "V-Drive Architecture" subsection to `/README.md` briefly explaining the V-Drive file structure for contributors: `layouts/layoutN.txt` for key remaps and macros, `lighting/ledN.txt` for RGB effects, `settings/kbd_settings.txt` for global settings. Mention that the `vdrive/` directory in the repo contains sample files for testing. Reference FR-010

**Checkpoint**: README has contribution guidelines and architecture overview.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final README sections and validation

- [x] T012 Add a "License" section to `/README.md` stating the project is licensed under GPLv3 and linking to the LICENSE file. Reference FR-011
- [x] T013 Review the complete `/README.md` for consistency: verify all commands are copy-paste ready, all relative paths are correct, markdown formatting is valid, and no placeholder text remains
- [x] T014 Verify the Containerfile works: build the image with `podman build -t edge-rgb-configurator .`, run with `podman run -d -p 8080:8080 edge-rgb-configurator`, confirm app loads at `http://localhost:8080`, check image size is under 50 MB with `podman images`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **US1 (Phase 2)**: No dependencies — can start immediately (parallel with Phase 1)
- **US2 (Phase 3)**: Depends on T002 (README header must exist first)
- **US3 (Phase 4)**: Depends on US2 completion (README sections written sequentially)
- **US4 (Phase 5)**: Depends on T001 (Containerfile) and US3 completion (README section order)
- **US5 (Phase 6)**: Depends on US4 completion (README section order)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Independent — can start immediately
- **US2 (P1)**: Sequentially after US1 (same file, README section order)
- **US3 (P2)**: Sequentially after US2 (same file)
- **US4 (P2)**: Sequentially after US3; also depends on Containerfile (T001)
- **US5 (P3)**: Sequentially after US4 (same file)

### Parallel Opportunities

- T001 (Containerfile) can run in parallel with T002-T004 (US1 README sections)
- Within each user story phase, tasks are sequential (same file)

---

## Parallel Example

```bash
# These can run in parallel (different files):
Task T001: "Create Containerfile at /Containerfile"
Task T002: "Write README header and project description in /README.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Start T001 (Containerfile) and T002-T004 (US1) in parallel
2. **STOP and VALIDATE**: README has project overview, hardware list, screenshot
3. A visitor can understand the project

### Incremental Delivery

1. T001 + US1 (T002-T004) → Project overview visible
2. US2 (T005-T007) → Contributors can run the app locally
3. US3 (T008) → Maintainers can deploy to GitHub Pages
4. US4 (T009) → Users can deploy via container
5. US5 (T010-T011) → Contributors understand the workflow
6. Polish (T012-T014) → License, validation, final review

---

## Notes

- All README tasks are sequential within the file to maintain section ordering
- The Containerfile (T001) is the only task that writes to a different file and can be parallelized
- Commit after each user story phase completion
- Stop at any checkpoint to validate that story independently
