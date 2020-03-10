#!/usr/bin/env bash
set -e
npm run test:prod
npm run build
npm run report-coverage
npm run build-docs
npm run deploy-docs
npm run semantic-release
