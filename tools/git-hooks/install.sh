#!/usr/bin/env sh
# Installs git hooks from tools/git-hooks/ into .git/hooks/

set -eu

HOOKS_DIR="$(git rev-parse --git-dir)/hooks"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

install_hook() {
    HOOK_NAME=$1
    SRC="$SCRIPT_DIR/$HOOK_NAME"
    DEST="$HOOKS_DIR/$HOOK_NAME"

    if [ ! -f "$SRC" ]; then
        echo "  Skipping $HOOK_NAME (not found)"
        return
    fi

    cp "$SRC" "$DEST"
    chmod +x "$DEST"
    echo "  Installed $HOOK_NAME"
}

echo "Installing git hooks..."
install_hook pre-commit
install_hook commit-msg
echo "Done."
