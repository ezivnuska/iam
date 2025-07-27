#!/bin/bash

# Function to build with watch mode
build_with_watch() {
    PACKAGE=$1
    echo "Watching build for package: $PACKAGE..."
    cd $PACKAGE && tsc --watch --build tsconfig.json
}

# Function to build without watch mode (for production or initial build)
build_once() {
    PACKAGE=$1
    echo "Building package: $PACKAGE..."
    cd $PACKAGE && tsc --build tsconfig.json
    cd -
}

# Clean up any old builds
echo "Cleaning previous build outputs..."
rm -rf apps/web/build
rm -rf apps/backend/build
rm -rf packages/auth/build
rm -rf packages/types/build
rm -rf packages/services/build
rm -rf packages/utils/build
rm -rf packages/theme/build

# Build the types package first since others depend on it
build_once "packages/types"

# Now, build auth (which depends on types)
build_once "packages/auth"

# Now, build utils
build_once "packages/utils"

# Now, build theme
build_once "packages/theme"

# Now, build services
build_once "packages/services"

# Now we can build the web app (which depends on ui)
build_once "apps/web"

# Lastly, build the backend app (which depends on types, validation, and auth)
build_once "apps/backend"

echo "Initial build complete!"

# Now, if you want to watch the packages for changes, you can run `--watch` on specific packages.
# Start watching the packages after the initial build

# Start watching packages in development mode
echo "Now watching the following packages for changes..."
build_with_watch "packages/types" & # Watch types in background
build_with_watch "packages/auth" & # Watch auth in background
build_with_watch "packages/services" & # Watch services in background
build_with_watch "packages/utils" & # Watch utils in background
build_with_watch "packages/theme" & # Watch theme in background
build_with_watch "apps/web" & # Watch web in background
build_with_watch "apps/backend" # Watch backend (this will keep running)

echo "Watching all packages... Press Ctrl+C to stop."