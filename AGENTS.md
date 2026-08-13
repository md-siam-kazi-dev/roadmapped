# PRD.md — Learning Roadmap Platform (Frontend)

## 1. Overview

**Product name roadmapped:** Roadmap — a structured, streak-driven learning platform where free YouTube content is organized into ordered courses, unlocked one module a day.

**Problem statement:** Free video tutorials exist everywhere, but learners rarely finish them. Without structure, deadlines, or accountability, courses get abandoned halfway. This product turns scattered YouTube resources into a guided, gamified curriculum with daily pacing, so learners build a real completion habit instead of a bookmarks graveyard.

**Scope of this document:** Frontend only. The backend (Express/TypeScript/Prisma/PostgreSQL) is a separate service already specified; this PRD defines what the frontend must present, and assumes the API contracts described in `ARCHITECTURE.md`.

---

## 2. Goals

1. Give learners a single, clear "next action" at all times — never a confusing library of unordered content.
2. Make the daily module deadline (8:00 PM → 7:59 PM next day) impossible to miss, through visible countdowns and reminders.
3. Make progress *feel* earned — streaks, gems, and visual unlock moments reinforce the habit loop.
4. Give admins/instructors a lightweight console to publish and manage courses, modules, videos, quizzes, and assignment reviews.
5. Ship a fast, accessible, mobile-first UI that works as well on a phone at 7:55 PM as on a laptop.

## 3. Non-Goals

- The frontend does not host video — it embeds/links existing YouTube content.
- No payments/checkout in v1 (courses are free).
- No real-time chat/messaging between learners and instructors in v1.
- Gems are earned and displayed in v1, but the **redemption/spend system is out of scope** (explicitly deferred by the product owner).

---

## 4. Target Users / Personas

| Persona | Description | Primary need |
|---|---|---|
| **Learner** | Self-taught developer/student following a roadmap (e.g. "Frontend Web Dev") | Clear next step, deadline visibility, motivation to not break streak |
| **Instructor** | Curates a course: modules, YouTube links, quizzes, assignment prompts | Simple content authoring, ability to review assignment submissions |
| **Admin** | Full platform owner/operator | Everything an Instructor can do, **plus** full authority to create/edit/remove Categories, Courses, Modules, Module Classes (videos/lessons), Quizzes, and Assignments end-to-end; reviews all learner assignment submissions across every course; manages users and roles |

> In v1, **Admin is the primary content-management role** the frontend is built around. Instructor is a lighter-weight variant of the same console with the same capabilities scoped to courses they own — the admin console UI described below applies to both, gated by role.

---

## 5. Core User Journeys

### 5.1 Learner: Enrollment → Daily Progress Loop
1. Browses courses by category, views a course's roadmap (list of modules, locked/unlocked state).
2. Enrolls in a course → Module 1 unlocks immediately, deadline timer starts (23h59m).
3. Watches Module 1's videos in order; each video has a **Mark as Complete** button. The **next video** only becomes visible/clickable after the current one is marked complete.
4. After all videos in the module are complete, learner takes the **module quiz**.
5. On passing the quiz within the deadline: module marked complete, gems awarded, streak incremented, confirmation/celebration state shown.
6. Module N+1 becomes visible but **locked with a countdown** until its personal scheduled unlock time (next day, 8:00 PM from enrollment clock) — and only actually opens once both the clock has passed *and* Module N is completed.
7. If the learner misses the deadline: streak resets to 0 (visually communicated, non-blocking — they can still complete the module late and continue).
8. On the final module, instead of a quiz, learner submits an **assignment** (text/link). Status shows as *Pending Review* until an instructor approves/rejects it. Approval marks the course **Completed**.

### 5.2 Admin: Course & Content Authoring
1. Logs into the admin console (role-gated, `role = ADMIN` or `INSTRUCTOR`).
2. **Creates a Course** — title, description, category, cover image, status (`DRAFT`).
3. **Adds Modules** to the course, in order (title, order index, description).
4. **Adds Module Classes** (the individual video lessons) to each module — YouTube URL, title, order index within the module. These are what the learner sees as the "mark as complete" video list.
5. **Adds a Quiz** to each module — question bank with multiple-choice options and the correct answer flagged per question.
6. **Adds the final Assignment** to the course (prompt text, submission instructions, e.g. "submit a GitHub repo link").
7. **Publishes** the course (`DRAFT → PUBLISHED`) once every module has at least its minimum required classes and a quiz, and the course has its final assignment defined — the console flags anything incomplete before allowing publish.
8. Can edit or soft-delete any of the above at any time; soft-deleted items disappear from learner-facing views but remain visible/recoverable in the admin console.

### 5.3 Admin: Reviewing Learner Assignment Submissions
1. Opens the **Submissions** queue in the admin console — a list of all learner assignment submissions across all courses (or filtered to one course), sorted with `PENDING` first.
2. Opens a submission to see: learner name, course, submitted link/text, submission timestamp, and full progress history leading up to it (streak at time of submission, quiz scores per module) for context.
3. Approves (marks the learner's course `COMPLETED`) or rejects (with optional written feedback, returning the assignment to the learner for resubmission).

---

## 6. Functional Requirements

### 6.1 Authentication
- FR-1: Users can sign up and log in via email/password.
- FR-2: Auth session is managed via **Better Auth**, issuing a **JWT** consumed by the Express backend on every API call.
- FR-3: Role-aware UI: Learner, Instructor, Admin see different navigation and pages.
- FR-4: Protected routes redirect unauthenticated users to `/login`.

### 6.2 Course Discovery
- FR-5: Public course catalog, filterable by Category.
- FR-6: Course detail page shows full roadmap (modules in order) with lock/unlock/complete state — visible even before enrolling, so learners can preview the journey.

### 6.3 Learning Flow
- FR-7: Video player view shows current video, with **Mark as Complete** action.
- FR-8: Next video/module is only rendered as accessible after prerequisite completion — enforced by backend response, frontend simply reflects returned state (never trusts local state alone).
- FR-9: A persistent **deadline countdown** (e.g. "6h 12m left today") is visible whenever a module is active and unlocked.
- FR-10: Quiz UI: multiple-choice questions, submit → immediate pass/fail feedback, retry allowed if failed (per backend rules).
- FR-11: Assignment submission form (link/text) on the final module, with a status badge (Pending / Approved / Rejected) and resubmission if rejected.

### 6.4 Gamification
- FR-12: Streak counter visible in the learner's dashboard header (current streak, longest streak).
- FR-13: Gem balance visible in header; gem-earning moments show a small animated reward (no spend UI in v1).
- FR-14: Missing a deadline shows a clear, non-shaming "streak reset" state — informative, not punitive in tone.

### 6.5 Dashboard
- FR-15: Learner dashboard: enrolled courses, per-course progress %, today's active module + countdown, streak, gems.
- FR-16: Empty state for zero enrollments, directing to the catalog.

### 6.6 Admin/Instructor Console
- FR-17: **Course management** — Admin can create, edit, publish/unpublish, and soft-delete Courses (title, description, category, cover image, status).
- FR-18: **Module management** — Admin can add, reorder, edit, and soft-delete Modules within a course.
- FR-19: **Module Class (video/lesson) management** — Admin can add, reorder, edit, and soft-delete individual video lessons within a module (YouTube URL, title, order).
- FR-20: **Quiz management** — Admin can create/edit a module's quiz: add/edit/remove questions, add/edit/remove multiple-choice options per question, and flag the correct option.
- FR-21: **Assignment management** — Admin can create/edit the final assignment prompt and submission instructions for a course.
- FR-22: **Category & user management** — Admin can manage Categories, and view/manage user accounts and roles.
- FR-23: **Assignment submission review** — Admin can view **all learner assignment submissions** platform-wide (filterable by course/status), open a submission's full detail (content, timestamp, learner's progress history), and Approve or Reject with optional feedback.
- FR-24: Publish action is blocked with an inline checklist if a course is missing required content (e.g. a module with zero classes, or no final assignment defined).
- FR-25: Soft-deleted records are hidden from learner-facing views but remain visible, filterable, and recoverable in admin views.

### 6.7 Cross-Cutting
- FR-20: Consistent API response handling per the backend's `{ success, message, data }` contract, including error/toast states.
- FR-21: Light/Dark theme toggle, persisted per user.
- FR-22: Fully responsive — mobile, tablet, desktop.

---

## 7. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | First contentful paint < 1.5s on catalog/dashboard pages; use Next.js server components/streaming where sensible |
| Accessibility | WCAG 2.1 AA — visible focus states, sufficient contrast in both themes, keyboard-navigable quiz/forms |
| Responsiveness | Mobile-first breakpoints; deadline countdown and "Mark as Complete" must be reachable one-thumb on mobile |
| Reliability | All state-changing actions (mark complete, submit quiz, submit assignment) show optimistic UI *only* where safe, reconciled with backend truth |
| Security | JWT stored per Better Auth's secure defaults; no sensitive tokens in localStorage in plaintext where avoidable |
| Motion | Animations respect `prefers-reduced-motion`; used to reinforce feedback (unlock, streak, gems), never decorative filler |

---

## 8. Success Metrics (v1)

- % of enrolled learners who complete Module 1 within 24 hours.
- 7-day and 30-day streak retention rate.
- Course completion rate (assignment approved / total enrollments).
- Median time-to-first-action after login (should be near-zero — the dashboard should make "what do I do now" obvious).

---

## 9. Out of Scope / Future Considerations

- Gem redemption/marketplace.
- Mobile app (React Native) — web-responsive only in v1.
- Push/email deadline reminders (v1 relies on in-app countdown only; notification system is a v2 candidate).
- Peer discussion/comments on lessons.
- Leaderboards.

---

## 10. Open Questions

- Should missed-deadline modules ever become permanently locked (hard fail), or is "always recoverable, just lose streak" the permanent policy? *(Current answer per stakeholder: recoverable, streak-only penalty.)*
- Does the quiz allow unlimited retries, or a capped number? (Frontend will surface whatever limit the backend enforces — flag to confirm with backend team.)