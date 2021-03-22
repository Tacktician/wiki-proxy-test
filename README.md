# Proxy Server IAC for wiki.saucelabs.com

This repo is the source code for the NGINX container that handles ingress traffic management (301 redirects/rewrites) for the domain wiki.saucelabs.com.

__Table Of Contents__

1. [Dev Requirements](#dev-requirements)
   * [NGINX Quickstart for OSX](#nginx-quickstart-for-macosx-users)
2. [Docker Container Quickstart](#run-docker-container-locally)
3. [Updating the `.conf` Files](#updating-the-conf-files)
   * [Common NGNIX Errors](#common-nginx-config-errors)
    
## Dev Requirements

* [Docker](https://docs.docker.com/get-docker/) Installed (to test the `docker` container)
* [NGINX](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/) Installed (to test `nginx` config before committing your work)

### NGINX Quickstart for macOSX Users

1. Install NGINX:
   ```
   brew install nginx
   ```
2. Run NGINX:
   ```
   sudo nginx
   ```
3. Copy the configs from this repo and overwrite the default config:
   ```
   mv /usr/local/etc/nginx/nginx.conf /usr/local/etc/nginx/nginx.conf.bak
   cp nginx.conf /usr/local/etc/nginx/nginx.conf
   cp map.conf /usr/local/etc/nginx/nginx.conf
   ```
4. Change the `include` in `nginx.conf`:
   ```
   http {
       include /etc/nginx/conf.d/map.conf;
   ```
   to:
   ```
   http {
       include /usr/local/etc/nginx/map.conf;
   ```
5. Save the file and run an `nginx` syntax check:
   ```
   nginx -t
   ```
   A successful config reload looks  like  the following:
   ```
   nginx: the configuration file /usr/local/etc/nginx/nginx.conf syntax is ok
   nginx: configuration file /usr/local/etc/nginx/nginx.conf test is successful
   ```
6. Reload the NGINX config and run a test:
   ```
   nginx -s reload
   curl localhost:8080/display/DOCS/Job%2C+User%2C+and+Integrations+Settings+for+Organizations
   ```
   > If you encounter errors please visit the [Common `nginx` Config Errors](#common-nginx-config-errors) section.

## Run Docker Container Locally

1. Pull down this repo:
   ```
   git clone <repo>.git
   ```
2. Build the docker container by running the following command in the root project directory:
   ```
   docker build -t proxy .
   ```
3. After the container finishes building, run the container:
   ```
   docker run --name mynginx -p 80:8080 -d proxy
   ```
4. Hit the container to test that the redirects work 
   >  (`$request_uri` examples are located [here](https://docs.google.com/spreadsheets/d/1nFp0ioLxgR03aEENrOgCsnvdFWx5IohbTfRQ3SHCgx0/edit#gid=0))
   
   For Example:
   
   ```
   curl http://localhost/display/DOCS/Account+and+Team+Management
   ```
   should redirect to:
   ```
   https://docs.saucelabs.com/basics/acct-team-mgmt-hub
   ```
   
## Updating the `.conf` Files

When you need to add a new  redirect entry for `wiki.saucelabs.com` follow these steps:

1. Open `map.conf`
2. Add the line in the appropriate section e.g.
   ```
   #---------------web apps section------------------
   /display/DOCS/Account+and+Team+Management   /basics/acct-team-mgmt-hub;
   ```
   > You can use [the following spreadsheet](https://docs.google.com/spreadsheets/d/1nFp0ioLxgR03aEENrOgCsnvdFWx5IohbTfRQ3SHCgx0/edit#gid=0) to copy and paste many entries, but make sure you include a `;` at the end of each line.
3. Save the file and test the config to ensure those no errors
   ```
   nginx -t
   ```
4. Commit your work to this repo

### Common `nginx` Config Errors

When updating the `.conf` files, (especially **`map.conf`**), please be aware of some  common `nginx` errors:

1. **Missing a `;` or a closing `}` bracket**. This error indicates there's a missnig semicolon and/or a missing bracket somewhere, unfortunately the error parses the entire file and says the following:
   ```
   nginx: [emerg] unexpected end of file, expecting ";" or "}" in /path/to/conf/file:<line-number>
   ```
   This means you have to go line by line and ensure each directive appropriately ends. In the case of `map.conf` this usually means a missing semicolon, in the case of `nginx.conf` it could be both `;` or `}`.
2. **Conflicting parameters in the `map` directive**. This means you have duplicate redirect entries, the error reads like the following example:
   ```
   nginx: [emerg] conflicting parameter "/display/docs/high+availability+sauce+connect+proxy+setup" in /usr/local/etc/nginx/map.conf:88
   ```
   The above examples means that there are two entries for either the key or the value in `map.conf`, navigate to the line number and use **Find** or **Find > Replace** to fix this.
   
3. **Config failed to load / `open()` i.e. `no such file or directory`**. This  error is an `include` problem, meaning the `nginx.conf` most likely has the incorrect file location for `map.conf`. 

   This can happen when copying the files into the docker container or if you're running a local`nginx` binary...and the project file location doesn't match your system file location. 
   
   To fix this problem, modify this line in `nginx.conf` and point it to the correct location of `map.conf` on the relative filesystem:
   ```
   http {
       include /usr/local/etc/nginx/map.conf;
   ```
4. Invalid number of parameters. This error relates to an issue in `map.conf` where there's either an extra return line or an errant `;` colon in the key parameter.  For example
   
   Incorrect:
   ```
   map $request_uri $new-uri {
       /display/some/url; /target/url;
   ...
   ```
   Also incorrect:
   ```
   map $request_uri $new-uri {
       /display/some/url 
       /target/url;
   ...
   ```
   Correct:
   ```
   map $request_uri $new-uri {
       /display/some/url /target/url;
    ...
   ```
5. **Map hash bucket size is too small**. If you receive the following error:
   ```
   nginx: [emerg] could not build map_hash, you should increase map_hash_bucket_size: 64
   ```
   You need to increase the size of the following directives:
   ```
   map_hash_max_size <size_in_bytes>;
   map_hash_bucket_size <size_in_bytes>;
   ```  
   
