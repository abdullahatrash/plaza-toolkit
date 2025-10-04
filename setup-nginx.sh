#!/bin/bash

echo "Setting up Nginx for Plaza Toolkit..."

# Create the Nginx configuration
cat > /tmp/plaza-toolkit-nginx.conf << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name 164.90.196.41;

    # Set client body size for file uploads
    client_max_body_size 10M;

    # Proxy headers
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # Main application
    location / {
        proxy_pass http://localhost:3000;
        proxy_redirect off;
    }

    # API routes
    location /api {
        proxy_pass http://localhost:3000/api;
        proxy_redirect off;
    }

    # Static files and uploads
    location /uploads {
        alias /var/www/web-server/plaza-toolkit/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Disable access to sensitive files
    location ~ /\. {
        deny all;
    }

    location ~ /\.env {
        deny all;
    }

    # Logging
    access_log /var/log/nginx/plaza-toolkit-access.log;
    error_log /var/log/nginx/plaza-toolkit-error.log;
}
EOF

echo "Please run these commands with sudo:"
echo ""
echo "sudo cp /tmp/plaza-toolkit-nginx.conf /etc/nginx/sites-available/plaza-toolkit"
echo "sudo ln -sf /etc/nginx/sites-available/plaza-toolkit /etc/nginx/sites-enabled/plaza-toolkit"
echo "sudo rm -f /etc/nginx/sites-enabled/default"
echo "sudo nginx -t"
echo "sudo systemctl reload nginx"
echo ""
echo "After running these commands, your Next.js app will be accessible at http://164.90.196.41"