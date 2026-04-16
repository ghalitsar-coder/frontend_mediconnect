#!/bin/sh

# Cari semua file JS di dalam folder .next hasil build
# Lalu ganti teks 'APP_PLACEHOLDER_API_URL' dengan isi dari variabel $NEXT_PUBLIC_API_URL
echo "Replacing API URL to: $NEXT_PUBLIC_API_URL"

find /app/.next -type f -name "*.js" -exec sed -i "s|APP_PLACEHOLDER_API_URL|$NEXT_PUBLIC_API_URL|g" {} +

# Jalankan perintah utama Docker (biasanya npm start)
exec "$@"