
# 🎬 Movie Mandap

CineGudi is a full-stack movie web application built with a **monorepo structure using Nx**.  
It aims to provide a clean and scalable foundation for managing movie-related features such as authentication, data management, and UI presentation.

---

## 🚀 Tech Stack

- **Monorepo Management:** Nx  
- **Language:** TypeScript  
- **Frontend:** React (planned/under development)  
- **Backend:** Node.js + Express  
- **Database:** Prisma ORM + PostgreSQL  
- **Package Manager:** Yarn  
- **Testing:** Jest  
- **Linting & Formatting:** ESLint + Prettier  

---

## 🗂 Project Structure

```
cinegudi/
│
├── apps/                 # Application entry points
│   └── (frontend/backend apps)
│
├── packages/             # Shared libraries and modules
│
├── prisma/               # Database schema and migrations
│
├── .github/workflows/    # CI/CD pipelines
├── .vscode/              # Editor configuration
│
├── nx.json               # Nx configuration
├── tsconfig.json         # TypeScript root configuration
├── jest.config.ts        # Jest test configuration
├── package.json
├── yarn.lock
└── README.md
```

---

## ⚙️ Getting Started

### 1️⃣ Prerequisites
- Node.js (>= 18)
- Yarn
- PostgreSQL (running locally or remote)

### 2️⃣ Clone the Repository
```bash
git clone https://github.com/SUJANPOKHAREL07/cinegudi.git
cd cinegudi
```

### 3️⃣ Install Dependencies
```bash
yarn install
```

### 4️⃣ Set Up Environment Variables
Create a `.env` file in the project root:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/cinegudi
JWT_SECRET=your_secret_key
```

### 5️⃣ Run Database Migrations
```bash
npx prisma migrate dev
```

### 6️⃣ Start the Development Server
```bash
yarn nx serve <app-name>
```

Replace `<app-name>` with your specific app (e.g., `api`, `web`, etc.).

---

## 🧪 Running Tests
```bash
yarn nx test <project-name>
```

Run linting:
```bash
yarn nx lint <project-name>
```

---

## 🏗 Build for Production
```bash
yarn nx build <app-name>
```

---

## 🧠 Nx Workspace Commands

Visualize dependencies:
```bash
npx nx graph
```

Check and sync TypeScript project references:
```bash
npx nx sync
```

---

## 🧩 Recommended Tools

- **Nx Console** (VS Code Extension) – run Nx commands visually  
- **Prisma Studio** – inspect your database via GUI:
  ```bash
  npx prisma studio
  ```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork this repository  
2. Create a new branch:  
   ```bash
   git checkout -b feature/your-feature
   ```  
3. Commit changes and push:  
   ```bash
   git commit -m "Add your feature"
   git push origin feature/your-feature
   ```  
4. Create a Pull Request  

---

## 📜 License

This project is open-source and available under the **MIT License**.

---

### 👤 Author
**Sujan Pokharel**  
Bachelor’s in Computer Applications (BCA) — Crimson College of Technology  
Tech enthusiast passionate about full-stack development and clean architecture.
