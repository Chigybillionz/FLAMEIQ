# CI/CD Pipeline Setup

## GitHub Actions Workflows

Two workflows are configured:

### 1. `ci.yml` - Continuous Integration
Runs on every push and pull request to `main` and `develop` branches.

**Stages:**
- **Lint** - ESLint validation
- **Type Check** - TypeScript strict mode check
- **Test** - Vitest test suite with PostgreSQL service
- **Build & Push** - Docker image build and push to GHCR (GitHub Container Registry)

**Triggers:**
- Push to `main` or `develop`
- Pull requests to `main` or `develop`

### 2. `deploy.yml` - Production Deployment
Runs on git tag push (e.g., `v1.0.0`) or manual workflow dispatch.

**Stages:**
- Pull latest image from GHCR
- SSH into production server
- Update docker-compose and restart containers
- Health check on deployment

**Triggers:**
- Tag push matching `v*` pattern
- Manual trigger via GitHub UI

---

## Required GitHub Secrets

Set these in your repository settings (Settings > Secrets and variables > Actions):

### For CI Pipeline
No additional secrets needed—uses `GITHUB_TOKEN` automatically.

### For Deployment
Required only if you're using the deploy workflow:

| Secret | Description | Example |
|--------|-------------|---------|
| `DEPLOY_HOST` | Production server IP or hostname | `app.example.com` |
| `DEPLOY_USER` | SSH username | `ubuntu` |
| `DEPLOY_KEY` | SSH private key (full PEM format) | SSH key with newlines |

Generate SSH key:
```bash
ssh-keygen -t rsa -b 4096 -f deploy_key -N ""
# Copy content of deploy_key as DEPLOY_KEY secret
# Add deploy_key.pub to your server's ~/.ssh/authorized_keys
```

---

## Docker Image Tagging

Images are automatically tagged with:
- `branch-<commit-sha>` - Latest commit on any branch
- `main` / `develop` - Branch name
- `latest` - Only on main branch
- `v1.0.0` - Semantic version from git tags

Example: `ghcr.io/bakre/flameiq-backend:main`, `ghcr.io/bakre/flameiq-backend:v1.0.0`

---

## Local Testing

### Run linter
```bash
pnpm run lint
pnpm run lint:fix
```

### Run type check
```bash
pnpm run typecheck
```

### Run tests
```bash
pnpm run test
```

### Run all CI checks
```bash
pnpm run lint && pnpm run typecheck && pnpm run test
```

---

## Accessing Container Registry

### Log in to GHCR
```bash
docker login ghcr.io -u <github-username> -p <personal-access-token>
```

### Pull image
```bash
docker pull ghcr.io/bakre/flameiq-backend:latest
docker pull ghcr.io/bakre/flameiq-backend:main
```

### Tag and push custom image
```bash
docker tag myimage:latest ghcr.io/bakre/flameiq-backend:custom-tag
docker push ghcr.io/bakre/flameiq-backend:custom-tag
```

---

## Troubleshooting

### Workflow fails at lint step
- Run `pnpm run lint:fix` locally to auto-fix style issues
- Commit and push again

### Tests fail in CI
- Check that `.env` variables are set in the workflow (currently uses defaults)
- Verify PostgreSQL service is healthy in the logs

### Build times out
- npm registry can be slow; increase timeout in workflow or use pnpm cache
- Currently uses GitHub Actions cache for `node_modules`

### Deployment fails
- Verify SSH credentials in secrets are correct
- Ensure production server has Docker and docker-compose installed
- Check that firewall allows SSH access

---

## Next Steps

1. **Push to trigger first run**: `git push origin main`
2. **Monitor workflow**: GitHub UI > Actions tab
3. **Set up deployment**: Add DEPLOY_* secrets when ready for production
4. **Configure health checks**: Update health check endpoint if different from `:4000`
