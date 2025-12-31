# MVConf — Anonymous Confession Platform (Backend)

MVConf is an anonymous, Reddit-style confession and discussion platform built with Django.  
It is designed for privacy-first communities with strong moderation and abuse prevention.

## ✨ Features

- 🎭 **Anonymous users** (no email, no passwords)
- 🏷️ Automatic pseudonym generation
- 📝 Confession posts with categories
- 💬 Nested comments & replies
- ⬆️⬇️ Upvote / downvote system
- 🔥 Hot ranking (time-decay algorithm)
- 🔍 Search & filters (category, time, ranking)
- 🚨 Reporting & auto-moderation
- 🛠️ Admin moderation dashboard
- ⏱️ Rate limiting & abuse protection
- 🔒 Security-hardened configuration

## 🧠 Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Django + Django REST-style views |
| Database | SQLite (dev), PostgreSQL (prod-ready) |
| Authentication | Anonymous UUID + cookies |
| Hosting | Render / Railway / VPS-ready |

## 🚀 Getting Started (Local)

### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/mvconf.git
cd mvconf/backend
```

### 2️⃣ Create virtual environment
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 3️⃣ Install dependencies
```bash
pip install -r requirements.txt
```

### 4️⃣ Environment variables

Copy the example and configure:
```bash
cp .env.example .env
```

Edit `.env`:
```
SECRET_KEY=your-super-secret-key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
IP_HASH_SALT=change-this-to-random-string
```

### 5️⃣ Migrate database
```bash
python manage.py migrate
```

### 6️⃣ Create admin user (optional)
```bash
python manage.py createsuperuser
```

### 7️⃣ Run server
```bash
python manage.py runserver
```

Open: http://127.0.0.1:8000/

## 🔗 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/whoami/` | GET | Get anonymous identity |
| `/posts/` | GET | List posts |
| `/posts/create/` | POST | Create post |
| `/posts/search/` | GET | Search & filters |
| `/posts/<id>/vote/` | POST | Vote on post |
| `/posts/<id>/comments/` | GET | List comments |
| `/posts/<id>/comments/create/` | POST | Create comment |
| `/comments/<id>/vote/` | POST | Vote on comment |
| `/terms/` | GET | Terms of service |
| `/privacy/` | GET | Privacy policy |
| `/content-policy/` | GET | Content policy |
| `/secure-admin-panel/` | GET | Admin dashboard |

### Query Parameters (Search)

| Param | Options | Example |
|-------|---------|---------|
| `q` | any text | `?q=confession` |
| `category` | island, relationship, work, society, dark, funny | `?category=dark` |
| `sort` | hot, new, top | `?sort=new` |
| `time` | 24h, 7d, all | `?time=7d` |

## 🛡️ Security Notes

- ✅ No IPs stored (hashed only)
- ✅ No personal data collected
- ✅ Rate limiting enforced
- ✅ Content moderation built-in
- ✅ XSS protection enabled
- ✅ CSRF protection enabled
- ✅ Secure cookie settings

## 📁 Project Structure

```
backend/
├── backend/          # Django project settings
├── accounts/         # Anonymous user system
├── posts/            # Posts & voting
├── comments/         # Nested comments & voting
├── reports/          # Content reporting
├── templates/        # Error pages
├── manage.py
└── requirements.txt
```

## 📜 Legal & Disclaimer

> This project does not guarantee absolute anonymity.  
> Users are responsible for their content.  
> Illegal or abusive content may be removed and reported if legally required.

## 📈 Future Improvements

- [ ] Frontend (React / Next.js)
- [ ] Mobile-first UI
- [ ] PostgreSQL full-text search
- [ ] Redis-based rate limiting
- [ ] PWA support
- [ ] Moderation analytics
- [ ] Email notifications (optional)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ for anonymous communities
