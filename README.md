# NestJS CRUD Starter

Please refer to /docs for swagger documentation

### Semantic Versioning
This project uses semantic-release to publish versions automatically from Conventional Commit messages on `main`. Each release updates the changelog, creates a Git tag, and publishes a GitHub release.

Usage:
- Write commits using Conventional Commits, for example `feat: add user search` or `fix: handle invalid input`.
- Push to `main` or run `npm run release` locally after setting `GITHUB_TOKEN` if you want to test the release process.

### TODOs
- [x] Logging
- [x] Monitoring
- [x] Semantic versioning
- [x] Containerization / Docker
- [x] Github workflows
- [x] Graceful shutdown
- [ ] Error handling
- [ ] Deployment script (sst, terraform, pulumi..)
- [ ] Unit & e2e Tests