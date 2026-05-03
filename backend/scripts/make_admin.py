from app import app, db, User
import sys

def make_admin(email):
    with app.app_context():
        user = User.query.filter_by(email=email).first()
        if user:
            user.is_admin = True
            db.session.commit()
            print(f"Success! {email} is now an Admin.")
        else:
            print(f"Error: User with email {email} not found.")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        make_admin(sys.argv[1])
    else:
        print("Usage: python make_admin.py <email>")
