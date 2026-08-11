# Deployment Inventory

> Scope: only what is derivable from this repo's CI/CD configuration (`.github/workflows/*`,
> `Jenkinsfile`, `Dockerfile.*`, `docker-compose.*.yml`, `ecosystem.*.config.js`). Actual public
> URLs, database engine/schema, Redis, object-storage bucket policy, current release version,
> and last-deployment timestamps are **not tracked in this repository** — those rows are
> omitted rather than guessed. Get them from DevOps/the hosting environment directly.

## Three Independent Deployment Stacks

The repo builds and deploys as three separate Docker images — Admin, Teacher, Learner — each
with its own Dockerfile, PM2 process config, and CI pipeline. Deploying one stack does not
redeploy the others.

| Stack | Dockerfile | PM2 Config | Compose File |
|---|---|---|---|
| Admin | `Dockerfile.admin-app-repo` | `ecosystem.admin-app-repo.config.js` | `docker-compose.admin-app-repo.yml` |
| Teachers | `Dockerfile.teachers` | `ecosystem.teachers.config.js` | `docker-compose.teachers.yml` |
| Learner | `Dockerfile.learner-web-app` | `ecosystem.learner-web-app.config.js` | `docker-compose.learner-web-app.yml` |

### Ports exposed per stack (from `docker-compose.*.yml`)

| Stack | Container ports mapped |
|---|---|
| Admin | `3032:3002` (admin-app-repo), `4104` (workspace), `4106` (players), `4114` (taxonomy-manager) |
| Teachers | `3001` (teachers), `4101` (authentication), `4102` (scp-teacher-repo), `4103` (youthNet), `4107` (players), `4115` (survey-forms) |
| Learner | `3003` (learner-web-app), `4108` (players), `4109` (forget-password) |

## CI/CD Pipelines

### GitHub Actions — 9 workflows (3 environments × 3 stacks)

| Environment | Trigger Branch | Workflow File | Docker Container Name |
|---|---|---|---|
| Dev — Admin | `main-admin` | `dev-deployment-admin.yaml` | `dev-lap` |
| Dev — Teacher | `main-teacher` | `dev-deployment-teacher.yaml` | `dev-lmp` |
| Dev — Learner | `main-learner` | `dev-deployment-learner.yaml` | `dev-plp-learner` |
| QA — Admin | `main-admin-qa` | `qa-deployment-admin.yaml` | `qa-lap` |
| QA — Teacher | `main-teacher-qa` | `qa-deployment-teacher.yaml` | `qa-lmp` |
| QA — Learner | `main-learner-qa` | `qa-deployment-learner.yaml` | `qa-plp-learner` |
| Prod — Admin | `main-admin-prod` | `prod-deployment-admin.yaml` | *(image push only — no SSH/deploy step in this workflow file)* |
| Prod — Teacher | `main-teacher-prod` | `prod-deployment-teacher.yaml` | *(image push only)* |
| Prod — Learner | `main-learner-prod` | `prod-deployment-learner.yaml` | *(image push only)* |

**Pipeline steps (Dev/QA):**
1. Checkout the trigger branch.
2. Write `.env` from a GitHub Secret (`DEV_LAP_ENV` / `QA_LAP_ENV` / `DEV_LMP_ENV` /
   `QA_LMP_ENV` / `DEV_PLP_ENV` / `QA_PLP_ENV`).
3. `docker build -f Dockerfile.<stack>` — the full NX workspace is built inside the image.
4. Push to AWS ECR (repo name and image tag come from secrets, e.g. `ECR_REPO_NAME_LAP_DEV`).
5. SSH to the target EC2 host (`appleboy/ssh-action`) → stop the running container →
   `docker system prune -af` → re-pull → `docker-compose up -d --force-recreate --no-deps` →
   `sudo systemctl restart nginx`.

**Prod workflows** in this repo only build and push the image to ECR — they do not contain an
SSH/deploy step, unlike Dev/QA. If Prod deploys via a separate mechanism (manual promotion,
different pipeline), that is not recorded in this repo.

### Jenkins — QA teacher SSH deploy (parallel/legacy path)

`Jenkinsfile` — SSH-based deploy triggered independently of GitHub Actions, targeting the same
QA teacher host:

```
ssh $REMOTE_USER@$REMOTE_HOST
cd /home/ubuntu/pratham-qa/shiksha/teacher
git clone https://github.com/tekdi/pratham2.0 -b main-teacher   # note: main-teacher, not -qa
docker-compose -f docker-compose.teachers.yml down
docker-compose -f docker-compose.teachers.yml up -d --timeout 1200
```

**Note the branch mismatch**: Jenkins clones `main-teacher` (the *Dev* branch), not
`main-teacher-qa`, into a path named `pratham-qa`. Worth confirming with the deploying team
whether this is intentional or legacy drift, since it means the Jenkins QA path and the GitHub
Actions QA workflow may not be building from the same branch.

## Object Storage (only fact derivable from this repo)

| Property | Value |
|---|---|
| Bucket | `knowlg-public` (from `AWS_BUCKET_NAME` in `.env`) |
| Region | `ap-south-1` |
| Access pattern | S3 multipart upload via signed URL, `@aws-sdk/client-s3` + `s3-request-presigner` |

Credentials (`AWS_ACCESS_KEY_ID`, `AWS_ACCESS_SECRET_KEY`) are environment-injected per
deployment and are not themselves infrastructure facts to record here.

## Not Available in This Repository

The following fields from the standard deployment-inventory template have no source of truth
in this codebase and are intentionally left out rather than filled with a guess — confirm with
DevOps/backend owners if needed for triage:

- Frontend/Backend/Admin Portal/CMS/Swagger public URLs per environment
- Database engine, schema, and connection details
- Redis configuration
- Current release version and last deployment date/time
