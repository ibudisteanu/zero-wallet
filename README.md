# PandoraPay wallet

PandoraPay wallet using Vue2. No SSR supported right now.


## Based on

Simple Vue and Webpack boilerplate
https://github.com/samteb/vue-2-webpack-4-boilerplate/

## Running using nginx

add in `sudo nano /etc/nginx/conf.d/new_sites.conf`

```
server {
    listen 80;
    server_name wallet.pandorapay.org;

    root /home/PandoraPay-wallet/dist/build;
    index index.html;

    location / {
        add_header Access-Control-Allow-Origin *;

        try_files $uri $uri/ /index.html;

        include /etc/nginx/mime.types;
        types {
            application/wasm wasm;
        }
        default_type application/octet-stream;
    }

}
```

Restart to apply
`sudo systemctl reload nginx`

Start nginx
`sudo service nginx start`
