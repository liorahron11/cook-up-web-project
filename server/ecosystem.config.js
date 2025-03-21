module.exports = {
    apps : [{
        name: "cookup",
        script: "./dist/main.js"
    }],
    env_production: {
        NODE_ENV: "production"
    }
}