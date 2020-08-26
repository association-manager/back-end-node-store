"# association-manager-back-end-express"

add public and private jwt pem files in node project 
rename .pem into .key

##Documentation
Please look on below directory from root of this project
- `doc\schema\index.html`


### Generate the SSH keys:

In below configuration system request you to enter pass phrase key
for that please copy JWT_PASSPHRASE from .env.local file

For this step, launch the terminal (for windows)
````bash
mkdir jwt
openssl genpkey -out jwt/private.key -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096
openssl pkey -in jwt/private.key -out jwt/public.key -pubout
````

For this step, launch the terminal (for mac or linux)
````bash
mkdir -p jwt
openssl genrsa -out jwt/private.key -aes256 4096
openssl rsa -pubout -in jwt/private.key -out jwt/public.key
````

