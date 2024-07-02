#### Using `http-server` with HTTPS

1. **Install `http-server` globally**:
   ```sh
   npm install -g http-server
   ```

2. **Create SSL certificates**:
   You can use OpenSSL to create self-signed certificates. Run the following commands in your terminal:

   ```sh
   openssl genrsa -out server.key 2048
   openssl ecparam -genkey -name secp384r1 -out server.key
   openssl req -new -key server.key -out server.csr
   openssl x509 -req -in server.csr -signkey server.key -out server.cert
   ```

3. **Serve your project**:
   Navigate to your project directory and run the following command:

   ```sh
   http-server -S -C server.cert -K server.key
   ```

This will start an HTTPS server at `https://localhost:8080`.
