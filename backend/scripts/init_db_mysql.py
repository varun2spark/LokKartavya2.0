import pymysql
from app import app, db

def setup_database():
    print("Connecting to MySQL server...")
    try:
        # Connect to MySQL server without specifying a database
        connection = pymysql.connect(host='localhost', user='root', password='Varun475')
        cursor = connection.cursor()
        
        # Create database if it doesn't exist
        print("Creating database 'lokkartavya_db' if it doesn't exist...")
        cursor.execute("CREATE DATABASE IF NOT EXISTS lokkartavya_db")
        connection.commit()
        connection.close()
        print("Database checked/created successfully.")
        
        # Now use Flask app context to create tables
        print("Creating database tables...")
        with app.app_context():
            db.create_all()
        print("Tables created successfully.")
        
    except pymysql.err.OperationalError as e:
        print(f"Error connecting to MySQL: {e}")
        print("Please ensure MySQL is running locally on port 3306 with 'root' user and no password.")
        print("Alternatively, update the DATABASE_URL in app.py to match your configuration.")

if __name__ == "__main__":
    setup_database()
