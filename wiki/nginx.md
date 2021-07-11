## Running using nginx

Compiling for static files

`npm run build-wallet`

## Running using nginx

add in `sudo nano /etc/nginx/conf.d/new_sites.conf`

```
server {
    listen 80;
    listen [::]:80;

    server_name pandora.com;

    root /home/alex/Desktop/nginx/PandoraPay-wallet/build;
    index index.html;

    location / {
        add_header Access-Control-Allow-Origin *;

        try_files $uri $uri/ =404;

        include /etc/nginx/mime.types;
        types {
            application/wasm wasm;
        }
        default_type application/octet-stream;
        
    }
    
    error_page 404 /index.html;

}
```

Restart to apply

`sudo systemctl reload nginx`
`sudo /etc/init.d/nginx reload`

Start nginx

`sudo service nginx start`

## Enable serving WASM via gzip

`sudo nano /etc/nginx/nginx.conf`

```
gzip_static on
```

## Enable serving WASM via Brotli

`sudo nano /etc/nginx/nginx.conf`

```
brotli_static on
```
