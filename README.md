# Naya — College Bus Pass & Transport Management System

Backend: Spring Boot 3.3 + Java 21 + Neon Postgres | Frontend: React+Vite

## Run backend
```sh
export DATABASE_URL="jdbc:postgresql://<neon-host>/neondb?sslmode=require"
export DB_USER="<user>" DB_PASSWORD="<pass>"
export JWT_SECRET="<64-char secret>"
mvn -f backend/pom.xml spring-boot:run
```

## Run frontend
```sh
npm install --prefix frontend
npm run dev --prefix frontend  # :5173, proxies /api -> :8080
```

## Flows
- Student: register → login → Routes (select+apply) → My Pass (status/renew)
- Admin: promote via `UPDATE users SET role='ADMIN' WHERE email='...'` → /admin → create bus/driver/route/assignment → approve PENDING → capacity view
