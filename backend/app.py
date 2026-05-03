from flask import Flask, request, jsonify
from functools import lru_cache
from flask_cors import CORS
import wikipedia
import requests
import random
import os
from datetime import datetime, timedelta
from duckduckgo_search import DDGS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from flask import send_from_directory
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "allow_headers": "*", "expose_headers": "*"}})

db_url = os.environ.get('DATABASE_URL', 'mysql+pymysql://root:Varun475@localhost/lokkartavya_db')
if db_url.startswith('mysql://'):
    db_url = db_url.replace('mysql://', 'mysql+pymysql://', 1)
elif db_url.startswith('mysql+mysqldb://'):
    db_url = db_url.replace('mysql+mysqldb://', 'mysql+pymysql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = db_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'lokkartavya-super-secret-key-123')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'static', 'uploads')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

ADMIN_REGISTER_SECRET = os.environ.get('ADMIN_REGISTER_SECRET', 'lokkartavya-admin-secret-2024')

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)
    is_admin = db.Column(db.Boolean, default=False)
    def __repr__(self):
        return f'<User {self.email}>'


class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    name = db.Column(db.String(100), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    def __repr__(self):
        return f'<Feedback {self.id}>'


class IssueReport(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    politician_name = db.Column(db.String(100), nullable=False)
    geotag = db.Column(db.String(255), nullable=True)
    image_filename = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(20), default='pending')
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    def __repr__(self):
        return f'<IssueReport {self.id} for {self.politician_name}>'


with app.app_context():
    db.create_all()
    print("Database tables created/verified")


def get_politician_image(name, page_images=None):
    try:
        url = f"https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles={name.replace(' ', '_')}&format=json&pithumbsize=500"
        headers = {'User-Agent': 'LokKartavyaBot/1.0'}
        response = requests.get(url, headers=headers).json()
        pages = response.get("query", {}).get("pages", {})
        for page_id, page_info in pages.items():
            if "thumbnail" in page_info:
                return page_info["thumbnail"]["source"]
    except Exception as e:
        print(f"Wiki API Image Error: {e}")
    try:
        results = DDGS().images(f"{name} politician portrait india high quality", max_results=1)
        if results and len(results) > 0:
            return results[0].get("image")
    except Exception as e:
        print(f"DDG Search Error: {e}")
    if page_images:
        for img in page_images:
            if not img.endswith('.svg') and 'Wikipedia' not in img:
                return img
    return None


KNOWN_POLITICIANS = {
    "Narendra Modi": {"role": "Prime Minister of India", "criminal_cases": 0, "criminal_details": [], "constituency": "Varanasi", "education": "Post Graduate", "assets": "Rs 3.02 Crores"},
    "Rahul Gandhi": {"role": "Member of Parliament", "criminal_cases": 18, "criminal_details": ["Defamation case (Surat) - Stayed by Supreme Court", "National Herald case - Under investigation", "Defamation case (Patna) - Pending", "Multiple cases related to political protests"], "constituency": "Rae Bareli", "education": "M.Phil (Cambridge)", "assets": "Rs 20.4 Crores"},
    "Arvind Kejriwal": {"role": "Political Leader (AAP)", "criminal_cases": 6, "criminal_details": ["Excise Policy Case - Under trial", "Defamation cases by various political leaders", "Cases related to 2014 protests", "Miscellaneous administrative cases"], "constituency": "New Delhi", "education": "B.Tech (IIT Kharagpur)", "assets": "Rs 3.4 Crores"},
    "Rekha Gupta": {"role": "Chief Minister of Delhi", "criminal_cases": 0, "criminal_details": [], "constituency": "Shalimar Bagh", "education": "Post Graduate (Delhi University)", "assets": "Rs 15.5 Crores"},
    "Amit Shah": {"role": "Home Minister of India", "criminal_cases": 0, "criminal_details": [], "constituency": "Gandhinagar", "education": "Graduate", "assets": "Rs 36.5 Crores"},
    "Mamata Banerjee": {"role": "Chief Minister of West Bengal", "criminal_cases": 0, "criminal_details": [], "constituency": "Bhabanipur", "education": "M.A., LL.B.", "assets": "Rs 16.7 Lakhs"}
}


def simulate_affidavit_data(name):
    if not name:
        name = "Unknown"
    gen_commitments = ["Setup Multi-Speciality Hospital","Expand Highway Infrastructure","Improve Rural Electrification","Digital Transformation of Schools","Subsidized Solar Grids for Farmers","Clean Drinking Water Project","Women Empowerment Centers","Free Public Wi-Fi Zones","Modernize Public Transport","Smart City Initiatives","Affordable Housing Scheme","Revamp Drainage System"]
    if name in KNOWN_POLITICIANS:
        data = KNOWN_POLITICIANS[name].copy()
        random.seed(len(name) + sum(ord(c) for c in name))
        data["term"] = random.choice(["2024 - 2029", "2020 - 2025", "2021 - 2026"])
        budget_total = random.randint(500, 5000)
        budget_used = int(budget_total * random.uniform(0.6, 0.95))
        data["budget"] = {"total": f"Rs{budget_total} Cr", "utilized": f"Rs{budget_used} Cr", "categories": [{"name": "Infrastructure", "amount": f"Rs{int(budget_used*0.4)} Cr", "percentage": 40, "color": "#3B82F6"}, {"name": "Healthcare", "amount": f"Rs{int(budget_used*0.35)} Cr", "percentage": 35, "color": "#EF4444"}, {"name": "Education", "amount": f"Rs{int(budget_used*0.25)} Cr", "percentage": 25, "color": "#10B981"}]}
        selected_titles = random.sample(gen_commitments, 3)
        data["commitments"] = [{"id": i+1, "title": title, "status": random.choice(["completed", "in-progress", "pending"])} for i, title in enumerate(selected_titles)]
        data["issues"] = [{"id": 1, "title": "Local connectivity issues", "date": "2024-03-10"}, {"id": 2, "title": "Water supply maintenance", "date": "2024-03-22"}]
        return data
    random.seed(len(name) + sum(ord(c) for c in name))
    cases = random.randint(0, 5)
    assets_crores = random.randint(1, 200)
    budget_total = random.randint(50, 5000)
    budget_used = int(budget_total * random.uniform(0.4, 0.95))
    selected_titles = random.sample(gen_commitments, 3)
    return {
        "criminal_cases": cases,
        "criminal_details": [f"Random Case #{i+1} - Pending" for i in range(cases)] if cases > 0 else [],
        "assets": f"Rs {assets_crores} Crores",
        "role": random.choice(["Member of Parliament", "MLA", "Cabinet Minister", "Chief Minister", "Political Leader", "Mayor"]),
        "education": random.choice(["Graduate", "Post Graduate", "Doctorate", "12th Pass", "10th Pass", "Illiterate"]),
        "constituency": random.choice(["Varanasi", "New Delhi", "Gandhinagar", "Raebareli", "Kannauj", "Bhabanipur"]),
        "term": random.choice(["2024 - 2029", "2020 - 2025", "2021 - 2026"]),
        "budget": {"total": f"Rs{budget_total} Cr", "utilized": f"Rs{budget_used} Cr", "categories": [{"name": "Infrastructure", "amount": f"Rs{int(budget_used*0.4)} Cr", "percentage": 40, "color": "#3B82F6"}, {"name": "Healthcare", "amount": f"Rs{int(budget_used*0.35)} Cr", "percentage": 35, "color": "#EF4444"}, {"name": "Education", "amount": f"Rs{int(budget_used*0.25)} Cr", "percentage": 25, "color": "#10B981"}]},
        "commitments": [{"id": i+1, "title": title, "status": random.choice(["completed", "in-progress", "pending"])} for i, title in enumerate(selected_titles)],
        "issues": [{"id": 1, "title": "Water-logging during monsoon", "date": "2024-01-15"}, {"id": 2, "title": "Traffic congestion in city center", "date": "2024-02-20"}]
    }


@app.route('/search', methods=['GET'])
def search_leader():
    name = request.args.get('name')
    if not name:
        return jsonify({"error": "Name parameter is required"}), 400
    try:
        wikipedia.set_lang("en")
        try:
            summary = wikipedia.summary(name, sentences=3)
            page = wikipedia.page(name)
            return jsonify({"title": page.title, "summary": summary, "image": get_politician_image(name, page.images)})
        except wikipedia.exceptions.DisambiguationError as e:
            option = e.options[0]
            summary = wikipedia.summary(option, sentences=3)
            page = wikipedia.page(option)
            return jsonify({"title": page.title, "summary": summary, "image": get_politician_image(option, page.images)})
        except wikipedia.exceptions.PageError:
            return jsonify({"error": "Leader not found on Wikipedia"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/affidavit', methods=['GET'])
def get_affidavit():
    name = request.args.get('name')
    if not name:
        return jsonify({"error": "Name parameter is required"}), 400
    try:
        data = simulate_affidavit_data(name)
        return jsonify({"criminal_cases": data["criminal_cases"], "criminal_details": data.get("criminal_details", []), "assets": data["assets"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@lru_cache(maxsize=128)
def fetch_leader_static_data(name):
    wiki_title = name
    wiki_summary = "Biography not available."
    image = None
    try:
        wiki_summary = wikipedia.summary(name, sentences=3)
        page = wikipedia.page(name)
        wiki_title = page.title
        image = get_politician_image(name, page.images)
    except Exception:
        image = get_politician_image(name)
    affidavit_data = simulate_affidavit_data(name)
    return {"name": wiki_title, "role": affidavit_data.get("role"), "education": affidavit_data.get("education"), "constituency": affidavit_data.get("constituency"), "term": affidavit_data.get("term"), "summary": wiki_summary, "criminal_cases": affidavit_data.get("criminal_cases"), "criminal_details": affidavit_data.get("criminal_details", []), "assets": affidavit_data.get("assets"), "budget": affidavit_data.get("budget"), "commitments": affidavit_data.get("commitments"), "simulated_issues": affidavit_data.get("issues"), "image": image}


@app.route('/leader', methods=['GET'])
def get_leader_full_info():
    name = request.args.get('name')
    if not name:
        return jsonify({"error": "Name parameter is required"}), 400
    try:
        response = fetch_leader_static_data(name).copy()
        real_issues = IssueReport.query.filter_by(politician_name=name, status='approved').order_by(IssueReport.timestamp.desc()).all()
        issues_list = [{"id": issue.id, "title": issue.title, "description": issue.description, "date": issue.timestamp.strftime("%Y-%m-%d"), "geotag": issue.geotag, "image_filename": issue.image_filename} for issue in real_issues]
        response["issues"] = issues_list if issues_list else response["simulated_issues"]
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/feedback', methods=['POST'])
def submit_feedback():
    data = request.json
    if not data or not all(k in data for k in ("name", "subject", "message")):
        return jsonify({"error": "Missing required fields: name, subject, message"}), 400
    try:
        db.session.add(Feedback(name=data['name'], subject=data['subject'], message=data['message']))
        db.session.commit()
        return jsonify({"message": "Feedback submitted successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to save feedback: {str(e)}"}), 500


# ── AUTH ROUTES ───────────────────────────────────────────────

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if not data or not all(k in data for k in ("name", "email", "password")):
        return jsonify({"error": "Missing required fields: name, email, password"}), 400
    email = data['email'].lower().strip()
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409
    try:
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        db.session.add(User(name=data['name'], email=email, password_hash=hashed_password))
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500


@app.route('/admin/register', methods=['POST'])
def admin_register():
    data = request.json
    if not data or not all(k in data for k in ("name", "email", "password", "admin_secret")):
        return jsonify({"error": "Missing required fields: name, email, password, admin_secret"}), 400
    if data['admin_secret'] != ADMIN_REGISTER_SECRET:
        return jsonify({"error": "Invalid admin secret key"}), 403
    email = data['email'].lower().strip()
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409
    try:
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        new_admin = User(name=data['name'], email=email, password_hash=hashed_password, is_admin=True)
        db.session.add(new_admin)
        db.session.commit()
        return jsonify({"message": "Admin registered successfully", "admin": {"name": new_admin.name, "email": new_admin.email, "is_admin": True}}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Admin registration failed: {str(e)}"}), 500


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or not all(k in data for k in ("email", "password")):
        return jsonify({"error": "Missing required fields: email, password"}), 400
    email = data['email'].lower().strip()
    user = User.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.password_hash, data['password']):
        user.last_login = datetime.utcnow()
        db.session.commit()
        access_token = create_access_token(identity=str(user.id))
        return jsonify({"message": "Login successful", "token": access_token, "user": {"id": user.id, "name": user.name, "email": user.email, "last_login": user.last_login.isoformat() if user.last_login else None, "is_admin": user.is_admin}}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401


# ── TEMPORARY ROUTE - REMOVE AFTER USE ───────────────────────
@app.route('/temp-reset-admin', methods=['GET'])
def temp_reset_admin():
    user = User.query.filter_by(is_admin=True).first()
    if user:
        user.email = 'varun.pal.eniac@gmail.com'
        user.password_hash = bcrypt.generate_password_hash('Varun475').decode('utf-8')
        db.session.commit()
        return jsonify({
            "message": "Admin updated successfully",
            "new_email": user.email,
            "new_password": "Varun475"
        }), 200
    return jsonify({"error": "No admin found. Create one first via /admin/register"}), 404
# ── END TEMPORARY ROUTE ───────────────────────────────────────


# ── PROTECTED ROUTES ──────────────────────────────────────────

def get_admin_or_403():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    if not user or not user.is_admin:
        return None, (jsonify({"error": "Unauthorized"}), 403)
    return user, None


@app.route('/issue', methods=['POST'])
@jwt_required()
def submit_issue():
    data = request.form
    if not data or not all(k in data for k in ("title", "description", "politician_name")):
        return jsonify({"error": "Missing required fields: title, description, politician_name"}), 400
    user_id = int(get_jwt_identity())
    image_filename = None
    if 'image' in request.files:
        file = request.files['image']
        if file and file.filename != '':
            filename = secure_filename(file.filename)
            unique_filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{filename}"
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], unique_filename))
            image_filename = unique_filename
    try:
        db.session.add(IssueReport(title=data['title'], description=data['description'], politician_name=data['politician_name'], geotag=data.get('geotag'), image_filename=image_filename, status='pending', user_id=user_id))
        db.session.commit()
        return jsonify({"message": "Issue reported successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to save issue: {str(e)}"}), 500


@app.route('/uploads/<filename>')
def serve_upload(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/admin/issues', methods=['GET'])
@jwt_required()
def get_pending_issues():
    user, err = get_admin_or_403()
    if err: return err
    return jsonify([{"id": i.id, "title": i.title, "description": i.description, "politician_name": i.politician_name, "date": i.timestamp.strftime("%Y-%m-%d %H:%M"), "geotag": i.geotag, "image_filename": i.image_filename, "user_id": i.user_id} for i in IssueReport.query.filter_by(status='pending').order_by(IssueReport.timestamp.desc()).all()]), 200


@app.route('/admin/issues/live', methods=['GET'])
@jwt_required()
def get_live_issues():
    user, err = get_admin_or_403()
    if err: return err
    return jsonify([{"id": i.id, "title": i.title, "description": i.description, "politician_name": i.politician_name, "date": i.timestamp.strftime("%Y-%m-%d %H:%M"), "geotag": i.geotag, "image_filename": i.image_filename, "user_id": i.user_id} for i in IssueReport.query.filter_by(status='approved').order_by(IssueReport.timestamp.desc()).all()]), 200


@app.route('/admin/issues/<int:issue_id>/approve', methods=['POST'])
@jwt_required()
def approve_issue(issue_id):
    user, err = get_admin_or_403()
    if err: return err
    issue = db.get_or_404(IssueReport, issue_id)
    issue.status = 'approved'
    db.session.commit()
    return jsonify({"message": "Issue approved successfully"}), 200


@app.route('/admin/issues/<int:issue_id>/reject', methods=['POST'])
@jwt_required()
def reject_issue(issue_id):
    user, err = get_admin_or_403()
    if err: return err
    issue = db.get_or_404(IssueReport, issue_id)
    issue.status = 'rejected'
    db.session.commit()
    return jsonify({"message": "Issue rejected successfully"}), 200


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
