# 🦎 Salamander Tracker – Web Application Guide

**Developed by:**

  <ul>
    <li>Leo Ragual <a target=_blank href="https://github.com/leoraggy">@leoraggy</a></li>
    <li>Kevin Sandoval <a target=_blank href="https://github.com/KevinSandoval12">@KevinSandoval12</a></li>
  </ul>

Welcome to the Salamander Tracker! This web app lets you select a specific object through its color, and it will binarize the image and filter the image into black and white. The white part of the image is the centroid, when you post it the backend will track the centroid and output a csv file containing the x and y coordinates for every 60 frames.

There are **4** main pages. This guide walks through what each one does.

---

## 1. Home Page

The Home page is a simple starting point.

What you can do:

- Use the top navigation bar to browse the app.
- Click the **“Videos”** button to view all available video clips and get started.

This page provides a quick entry into the video browser. You can always return here by clicking the home link in the navigation bar.

---

## 2. Videos List Page

This is where you select a video to work with.

What you can do:

- Browse available video clips stored on the server.
- Click the **“Preview”** button next to any video to view it and customize tracking settings.

---

## 3. Preview & Customize Page

This page shows a preview frame from the video and lets you adjust your tracking settings.

What you see:

- Two video frames:
  - Left: Original frame with a green circle showing the detected object.
  - Right: Binarized (black & white) frame showing where the system sees the matching color.

What you can adjust:

- Target Color: Pick the color of the object you want to track (like a salamander).
- Threshold: Move the slider to adjust how closely the system matches the color.
  - Lower = stricter match
  - Higher = looser match

The preview updates automatically when you change these settings.

When you're happy, click:

- **“Process Video with These Settings”** to start tracking the object across the full video.

---

## 3. Processing & Download

After you start processing:

- The status message shows:
  - “Processing…” while it’s working
  - “Done!” when finished
  - Or an error if something goes wrong

Once it's done:

- A link appears to download a CSV file with tracking results, viewable in any spreadsheet program.

## 4. Charts Page

In this page, you will need to choose a csv file of the outputted processing job.

It will display a line graph showing the trends of x coordinate.

---

## Backend Overview

The Frontend connects to a Backend server that handles video processing. Here’s what it does behind the scenes:

- Videos and Results are stored on the Backend server (in `/videos` and `/results` folders).
- When you view a preview, the frontend asks the backend to send a video frame.
- When you click “Process,” the frontend sends your selected color and threshold to the backend via a special URL.
- The backend processes the video and returns a downloadable CSV file when done.

Here are the main Backend API endpoints:

| Method | Endpoint                    | Description                          |
| ------ | --------------------------- | ------------------------------------ |
| GET    | `/api/videos`               | Lists available video files          |
| GET    | `api/thumbnail/:filename`   | Returns a preview frame from a video |
| POST   | `api/process/:filename`     | Starts a job to process the video    |
| GET    | `api/process/:jobId/status` | Checks the processing status         |

---
