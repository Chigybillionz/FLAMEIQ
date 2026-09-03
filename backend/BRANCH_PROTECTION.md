# BRANCH_PROTECTION.md

## Recommended Branch Protection Settings

Apply these rules to `main` and `develop` branches in GitHub Settings > Branches:

### Protection Rules

1. **Require pull request reviews before merging**
   - Required approving reviews: 1
   - Dismiss stale pull request approvals when new commits are pushed: ✓
   - Require review from code owners: ✓

2. **Require status checks to pass before merging**
   - Require branches to be up to date before merging: ✓
   - Require the following status checks to pass:
     - `lint-and-test / lint-and-test (24.20)`
     - `build-and-push`

3. **Require branches to be up to date before merging**
   - ✓ Checked

4. **Include administrators**
   - ✓ Enforce all the above rules for administrators

## CODEOWNERS File

Create `.github/CODEOWNERS` to require reviews from specific team members:

```
# Global owners
* @yourusername

# Specific paths
/src/config/ @yourusername @otheruser
/prisma/ @yourusername
```

## Workflow

1. Create feature branch: `git checkout -b feature/name`
2. Make changes and commit
3. Push: `git push origin feature/name`
4. Create PR on GitHub
5. CI runs automatically
6. Wait for approval and CI to pass
7. Merge to main/develop
8. Tag release: `git tag v1.0.0` and push
9. Deploy workflow runs automatically
