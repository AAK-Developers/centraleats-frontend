#!/bin/sh
echo "Generating env-config.js..."
cat <<EOF > /usr/share/nginx/html/env-config.js
window.env = {
  VITE_API_BASE_URL: "${VITE_API_BASE_URL}",
  VITE_CLERK_PUBLISHABLE_KEY: "${VITE_CLERK_PUBLISHABLE_KEY}",
  VITE_APP_ENV: "${VITE_APP_ENV}"
};
EOF
echo "env-config.js generated successfully."
