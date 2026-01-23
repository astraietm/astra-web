---
description: How to deploy a specific branch to Vercel
---

# Deploying a Branch to Vercel

There are two main ways to deploy a specific branch to Vercel: using the automatic GitHub integration (Recommended) or the Vercel CLI.

## Method 1: Automatic Preview (GitHub Integration)

If your project is connected to a GitHub repository:

1.  **Push your branch**:
    ```bash
    git push origin your-branch-name
    ```
    *(We have already pushed `feature/landing-page-enhancements`)*

2.  **Check Vercel Dashboard**:
    - Go to your Vercel Dashboard for this project.
    - Under the **Deployments** tab, you will see a new deployment building for your specific branch.
    - Once finished, Vercel provides a unique **Preview URL** (e.g., `astra-web-git-feature-landing-page.vercel.app`).

3.  **Note**: This does *not* replace your main production site. It creates a separate testable URL.

## Method 2: Vercel CLI (Manual)

If you want to deploy manually from your local machine:

1.  **Switch to the branch**:
    ```bash
    git checkout your-branch-name
    ```

2.  **Run the deploy command**:
    ```bash
    npx vercel
    ```
    - Follow the prompts.
    - It will create a **Preview Deployment** and give you the URL in the terminal.

3.  **Deploy to Production** (Optional):
    - If you want this branch to overwrite your live `astra-web.vercel.app` immediately:
    ```bash
    npx vercel --prod
    ```

## Method 3: merging to Main (Production)

To update the main live site via GitHub:

1.  **Merge your branch**:
    ```bash
    git checkout main
    git pull origin main
    git merge your-branch-name
    git push origin main
    ```
2.  Vercel will detect the push to `main` and update the production deployment.
