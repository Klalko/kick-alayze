
# ⚽ KickAlyze

Your ultimate football match analysis and tracking platform.

---

## 📝 Description

**KickAlyze** is my first full-stack project built while following **Colt Steele’s Web Developer Bootcamp**.  
It serves as an interactive **football hub** where users can explore matches, visualize stadiums on a map, and share match insights with others.  

Although not fully completed, the project already showcases core full-stack concepts, from **authentication** and **data validation** to **map integration** and **server-side rendering**.

---

## 🚀 Features

- User authentication (Login / Register / Logout)
- Add and explore football matches on an interactive map (via **MapTiler**)
- Dynamic rendering using **EJS** templates
- Secure form validation using **Joi**
- Cloud-based image handling with **Cloudinary**
- Protected routes and user sessions via **Passport.js**
- Responsive, modern UI built with HTML, CSS, and Bootstrap

---

## 🧰 Tech Stack

| Category | Technologies |
|-----------|---------------|
| **Frontend** | HTML, CSS, JavaScript, EJS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Auth & Security** | Passport.js, bcrypt, Express-session |
| **Validation** | Joi |
| **Maps** | MapTiler |
| **Image Storage** | Cloudinary |
| **Environment** | dotenv |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/<your-username>/kickalyze.git
cd kickalyze
````

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create a `.env` file in the root directory

Add the following environment variables:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
MAPTILER_API_KEY=your_maptiler_api_key
SESSION_SECRET=your_secret_key
```

> ⚠️ **Note:** The `.env` file is not included in the repository for security reasons.

### 4️⃣ Run the project

```bash
node app.js
```

Your app should now be running at [http://localhost:3000](http://localhost:3000)

---

## 📸 Screenshots
new match
<img width="1688" height="741" alt="image" src="https://github.com/user-attachments/assets/8df853fc-ccc3-4cde-9f3e-750606bf56f7" />
matches page
<img width="1777" height="908" alt="image" src="https://github.com/user-attachments/assets/85728626-b2aa-4a75-8433-f6b1b13a5043" />

individual match page
<img width="1639" height="846" alt="image" src="https://github.com/user-attachments/assets/d903c305-d0f6-4cf7-8fc2-952945488712" />

home page:
<img width="1801" height="940" alt="image" src="https://github.com/user-attachments/assets/0a3ebdcf-c261-429e-ae9b-400c2624371c" />








### 🏠 Home Page

![KickAlyze Home](./assets/screenshots/home.png)

### 🌍 Matches Page

![KickAlyze Matches](./assets/screenshots/matches.png)

*(You can replace the file paths above with your uploaded images if you add them inside an `assets/screenshots` folder.)*

---

## 💡 Future Improvements

* Integrate real football API for live scores and stats
* Add user profiles and match comments
* Improve UI with React or Vue for interactivity
* Deploy on Render or Vercel for public access

---

## 🧑‍💻 Author

**Omar Mog**
Full-Stack Developer in training ⚡
Passionate about web development, AI, and football analytics.

📫 *Connect on GitHub:* [https://github.com/<your-username>](https://github.com/<your-username>)

---

## 🏁 License

This project is licensed under the **MIT License** — feel free to use and modify it for learning or development purposes.

```

---

Would you like me to format this README so it automatically **displays your uploaded screenshots** (from the two images you sent) using correct Markdown paths?  
If yes, please confirm whether you’ll upload them to your repo (e.g. `/public/images/screenshots`) or want me to set the links to use your GitHub-hosted image URLs.
```
