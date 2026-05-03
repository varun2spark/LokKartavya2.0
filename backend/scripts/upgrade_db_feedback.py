from app import app, db

def upgrade_database():
    print("Creating new tables...")
    with app.app_context():
        db.create_all()
    print("Database updated successfully!")

if __name__ == "__main__":
    upgrade_database()
