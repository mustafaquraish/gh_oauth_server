# Simple Github Oauth Server

This is a simple Github Oauth server that can be used to authenticate users
using Github Oauth. This can be used for multiple applications, just make sure
you set the correct environment variables.

## Usage

### Setup

Set up `cliend_id= client_secret` pairs in your environment variables, or in an
`env.json` file located in the root of the project.

```shell
export AAA_CLIENT_ID=AAA_CLIENT_SECRET
export BBB_CLIENT_ID=BBB_CLIENT_SECRET
```

or

```json
{
    "AAA_CLIENT_ID": "AAA_CLIENT_SECRET",
    "BBB_CLIENT_ID": "BBB_CLIENT_SECRET"
}
```

### Running the server

Run the server locally, or deploy it to a cloud provider.

```shell
$ npm i && npm start
```

### Authenticating

Assuming the server is running at http://example.net/, you can authenticate
by calling the `/api/:client_id/:code` endpoint. This will return a JSON object
with the access token if the authentication was successful.

```js
const client_id = "AAA"; // Client ID
const code = "XXX";      // From Github Oauth callback
fetch(`http://example.net/api/${client_id}/${code}`)
    .then(res => res.json())
    .then(data => {
        // Check if the authentication was successful
        if (data.access_token) {
            document.getElementById('result').textContent = 'Successfully authenticated!';
        } else {
            document.getElementById('result').textContent = 'Authentication failed: ' + data.message;
        }
    })
    .catch(error => {
        document.getElementById('result').textContent = 'Error: ' + error.message;
    });
```
