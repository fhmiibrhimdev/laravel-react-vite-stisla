<img width="100%" alt="LaraReact Stisla Banner" src="https://user-images.githubusercontent.com/129714988/230786429-ae7d00b6-3375-452d-bc00-adbf780ad5f5.png">

# Laravel React Vite Stisla Dashboard

This project is a robust Single Page Application (SPA) starter kit that combines the power of **Laravel 10** for the backend API and **React 18 (Vite)** for a dynamic frontend. It utilizes the **Stisla Admin Template** to provide a beautiful, responsive, and user-friendly interface out of the box.

Designed for developers who want a modern, fast, and scalable foundation for their web applications, featuring secure authentication, role-based access control, and CRUD scaffolding.

## 📂 Folder Structure

The project is monorepo-style, separated into two distinct directories:

- **`backend/`**: Laravel 10 API (Service Layer, Auth, Database).
- **`frontend/`**: React + Vite + TailwindCSS (UI Layer services).

## ✨ Key Features

- **Backend**:

  - Laravel 10 RESTful API architecture.
  - **JWT Authentication** (`tymon/jwt-auth`) for secure stateless communication.
  - **Role-Based Access Control (RBAC)** using `santigarcor/laratrust`.
  - Comprehensive API Resources and Controllers.
  - Exception handling and standardized API responses.

- **Frontend**:

  - **React 18** powered by **Vite** for lightning-fast HMR and builds.
  - **Stisla Admin Template** integration (Responsive & Modern).
  - **TailwindCSS** for utility-first styling.
  - **React Router v6** for seamless client-side routing.
  - **SweetAlert2** for beautiful interactive alerts.
  - Form Handling & Validation.
  - Dynamic **Sidebar** & **Table** components.

- **Modules Included**:
  - **Authentication**: Login, Register, Logout.
  - **User Management**: Profile update, Password change.
  - **Products**: Complete CRUD example with proper validation.
  - **Gallery**: Image management module.
  - **Error Pages**: Custom 403 (Forbidden) and 404 (Not Found) pages.

## 🛠 Prerequisites

Ensure you have the following installed on your local machine:

1. **PHP** >= 8.1
2. **Composer**
3. **Node.js** (LTS version recommended) & **NPM**
4. **MySQL** or **MariaDB**

## 🚀 Installation Guide

Follow these steps to get the project running locally.

### 1. Clone the Repository

```bash
git clone https://github.com/fhmiibrhimdev/laravel-react-vite-stisla.git
cd laravel-react-vite-stisla
```

### 2. Backend Setup (Laravel)

```bash
cd backend
composer install
cp .env.example .env
```

Configure your database credentials in the `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=root
DB_PASSWORD=
```

Generate keys and migrate content:

```bash
php artisan key:generate
php artisan jwt:secret
php artisan migrate:fresh --seed
php artisan storage:link
php artisan serve
```

> **Note:** The backend server will run at `http://127.0.0.1:8000`.

### 3. Frontend Setup (React)

Open a terminal in the `frontend` directory:

```bash
cd ../frontend
npm install
npm run dev
```

> **Note:** The frontend application will be accessible at `http://localhost:5173`.

## 🔐 Default Credentials

After running the seeder (`php artisan migrate:fresh --seed`), the following default users are created:

| Role | Email | Password |
|Col1|Col2|Col3|
|---|---|---|
| **Admin** | `admin@app.com` | `password` |
| **User** | `user@app.com` | `password` |

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
