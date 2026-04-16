#!/bin/sh

# Jika variabel NEXT_PUBLIC_API_URL tidak kosong, lakukan penggantian
if [ -n "$NEXT_PUBLIC_API_URL" ]; then
  echo "Replacing APP_PLACEHOLDER_API_URL with $NEXT_PUBLIC_API_URL in .next folder..."
  # Mencari semua file .js di folder .next dan mengganti placeholder
  find /app/.next -type f -name "*.js" -exec sed -i "s|APP_PLACEHOLDER_API_URL|$NEXT_PUBLIC_API_URL|g" {} +
fi

# Jalankan perintah selanjutnya (npm start)
exec "$@"