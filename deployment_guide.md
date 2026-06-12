# 🚀 GitHub Deployment Guide

Follow these steps to push your Bus Booking System to GitHub.

## 1. Initialize Git Repository
Open your terminal in the root folder (`bus-booking-system/`) and run:

```bash
# Initialize git
git init

# Create a .gitignore file in the root
# Ensure you don't push sensitive info or large folders
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo "dist/" >> .gitignore
echo ".DS_Store" >> .gitignore
```

## 2. Commit Your Code
```bash
# Add all files
git add .

# Create your first commit
git commit -m "Initial commit: Full-stack Bus Booking System with Sri Lankan customization"
```

## 3. Create a Remote Repository
1. Go to [GitHub](https://github.com/) and log in.
2. Click the **+** icon in the top right and select **New repository**.
3. Name it (e.g., `bus-booking-system-sl`) and keep it Public or Private.
4. Do **not** initialize with a README, license, or gitignore (we already did this).
5. Click **Create repository**.

## 4. Push to GitHub
Copy the commands from the "push an existing repository from the command line" section on GitHub, which look like this:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## 🛠️ Important Notes

### Handling the `.env` File
Since we added `.env` to `.gitignore`, it won't be pushed to GitHub (this is a security best practice).
When someone else clones the repo, they will need to create their own `.env` file based on your configuration:
- `MONGO_URI`
- `JWT_SECRET`

### MongoDB Atlas (Recommended for Cloud)
If you want the app to work for everyone without them having local MongoDB:
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Get your connection string.
3. Update the `MONGO_URI` in your `.env` file before pushing (but remember, `.env` stays local).

### Running on a New Machine
If you clone this repo elsewhere:
```bash
# In backend/
npm install
npm run dev

# In frontend/
npm install
npm run dev
```
