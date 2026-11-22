#!/usr/bin/env bash
# Publish SIGIL.FORGE 2.0 to https://morphysm.github.io/sigil-forge-v2/
#
# Only publishes to the sigil-forge-v2 repository. Never touches the
# March version (morphysm/sigil-forge).
#
# Builds the last COMMITTED version of the current branch. Uncommitted
# changes are not included, so commit first.
#
# Usage:  npm run deploy            build and publish
#         npm run deploy -- --dry-run   build and prepare, but do not publish
set -euo pipefail

REMOTE=forge-v2
EXPECTED_REPO=morphysm/sigil-forge-v2
BRANCH=v2
DRY_RUN=0
[ "${1:-}" = "--dry-run" ] && DRY_RUN=1

die() { echo "deploy: $*" >&2; exit 1; }

ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT"

# Safety checks: right branch, right repository.
current=$(git rev-parse --abbrev-ref HEAD)
[ "$current" = "$BRANCH" ] || die "you are on '$current'; switch to '$BRANCH' first."
url=$(git remote get-url "$REMOTE" 2>/dev/null) || die "remote '$REMOTE' not found."
case "$url" in
  *"$EXPECTED_REPO".git|*"$EXPECTED_REPO") ;;
  *) die "remote '$REMOTE' points to $url, expected $EXPECTED_REPO. Refusing." ;;
esac

if [ -n "$(git status --porcelain --untracked-files=no -- src public package.json package-lock.json)" ]; then
  echo "deploy: note: you have uncommitted changes in src/public/package files."
  echo "deploy: they will NOT be in this deploy (only committed code is built)."
fi

SOURCE=$(git rev-parse HEAD)
SHORT=$(git rev-parse --short HEAD)
echo "deploy: building commit $SHORT"

WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

# Clean copy of the committed code.
git archive "$SOURCE" | tar -x -C "$WORK"
ln -s "$ROOT/node_modules" "$WORK/node_modules"
(
  cd "$WORK"
  PUBLIC_URL=. GENERATE_SOURCEMAP=false CI=false npx react-scripts build
)
BUILD="$WORK/build"
[ -f "$BUILD/index.html" ] || die "build failed: no index.html."
sed -i 's#<title>SIGIL.FORGE</title>#<title>SIGIL.FORGE 2.0</title>#' "$BUILD/index.html"
touch "$BUILD/.nojekyll"

# Get the current published branch so the new deploy goes on top of it.
git fetch "$REMOTE" gh-pages
PARENT=$(git rev-parse --verify "$REMOTE/gh-pages^{commit}") || die "could not read $REMOTE/gh-pages."

# Turn the build folder into a commit without touching your working folder.
export GIT_INDEX_FILE="$WORK/index"
git --work-tree="$BUILD" add -A .
TREE=$(git write-tree)
unset GIT_INDEX_FILE
COMMIT=$(git commit-tree "$TREE" -p "$PARENT" -m "Build SIGIL.FORGE 2.0 for GitHub Pages from $SHORT")

# Never push an empty or malformed value (that would delete the branch).
[[ "$COMMIT" =~ ^[0-9a-f]{40}$ ]] || die "unexpected commit id '$COMMIT'. Refusing to push."

if [ "$(git rev-parse "$PARENT^{tree}")" = "$TREE" ]; then
  echo "deploy: the site already has exactly this build. Nothing to publish."
  exit 0
fi

git diff --stat "$PARENT" "$COMMIT" | tail -1

if [ "$DRY_RUN" = 1 ]; then
  echo "deploy: dry run. Would publish $COMMIT to $EXPECTED_REPO gh-pages."
  exit 0
fi

git push "$REMOTE" "$COMMIT:refs/heads/gh-pages"
echo "deploy: published $SHORT. Live in 1-2 minutes at https://morphysm.github.io/sigil-forge-v2/"
