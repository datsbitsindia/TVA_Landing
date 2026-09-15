module.exports = {
  apps: [
    {
      name: "tva-landing-web",
      script: "server.js",
      cwd: "./",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 8090,
        DB_HOST: "127.0.0.1",
        DB_PORT: 3306,
        DB_USER: "root",
        DB_PASSWORD: "",
        DB_NAME: "tva_db",
        TABLE_PREFIX: "tva_"
      }
    }
  ]
};
