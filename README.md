6. HOW TO RUN (Dev & Prod)
   🟦 Development (Hot-reload, Nodemon, Bind Mount)

```
docker compose -f docker-compose.dev.yml up --build
```

App will be available at:

➡️ http://localhost:5000

Database at:

➡️ localhost:5432

Maildev at:

➡️ http://localhost:1080

🟩 Production (Optimized Build, No Dev Deps)

```
docker compose -f docker-compose.prod.yml up --build -d
```

App will run at:

➡️ http://your-server-ip/

🟥 Shutdown
docker compose -f docker-compose-prod.yml down
