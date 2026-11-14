require("dotenv").config({ path: ".env.test" });

const value = process.env.TEST_DATABASE_URL;

if (!value) {
    console.log("TEST_DATABASE_URL is missing");
    process.exit(1);
}

try {
    const url = new URL(value);

    console.log({
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        database: url.pathname,
        usernamePresent: !!url.username,
        passwordPresent: !!url.password
    });
} catch {
    console.log("Invalid PostgreSQL URL format");
}
