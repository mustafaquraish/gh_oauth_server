// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

// Load environment variables from env.json if it exists
let env = {};
try {
    env = require("./env.json");
    // full path of env.json file

    Object.assign(process.env, env);
} catch (err) {
    console.log("No env.json file found, using process.env only");
}

const port = process.env.PORT || 8989;

// CORS for API endpoints only
app.use("/api", cors());

// To check if the server is running
app.get("/api/ping", async (req, res) => {
    res.json({ message: "pong" });
});

// OAuth endpoint moved under /api
app.get("/api/:client/:code", async (req, res) => {
    const { client, code } = req.params;
    const { redirect_uri, state } = req.query;

    const secret = process.env[client];

    if (!secret) {
        return res.status(404).json({
            statusCode: 404,
            error: "Not Found",
            message: `No secret is configured for client ID: '${client}'`,
        });
    }

    const body = {
        client_id: client,
        client_secret: secret,
        code,
    };

    // Add optional parameters if present
    if (redirect_uri) body.redirect_uri = redirect_uri;
    if (state) body.state = state;

    try {
        const response = await fetch(`https://github.com/login/oauth/access_token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            if (response.status === 404) {
                return res.status(404).json({
                    statusCode: 404,
                    error: "Not Found",
                    message: `GitHub could not find client ID: '${client}'`,
                });
            }
            throw new Error(`GitHub API responded with status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            return res.status(400).json({
                statusCode: 400,
                error: "Bad Request",
                message: data.error_description,
            });
        }

        res.json(data);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: err.message,
        });
    }
});

app.listen(port, "0.0.0.0", () => {
    console.log(`Server started at http://0.0.0.0:${port}`);
});
