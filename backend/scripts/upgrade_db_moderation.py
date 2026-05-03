import pymysql

def upgrade_table():
    print("Connecting to MySQL server...")
    try:
        connection = pymysql.connect(host='localhost', user='root', password='Varun475', database='lokkartavya_db')
        cursor = connection.cursor()
        
        print("Adding status column to issue_report...")
        try:
            cursor.execute("ALTER TABLE issue_report ADD COLUMN status VARCHAR(20) DEFAULT 'pending'")
            cursor.execute("UPDATE issue_report SET status = 'approved'") # Approve existing ones
        except Exception as e:
            print(f"Column might already exist: {e}")
            
        print("Adding is_admin column to user...")
        try:
            cursor.execute("ALTER TABLE user ADD COLUMN is_admin BOOLEAN DEFAULT FALSE")
        except Exception as e:
            print(f"Column might already exist: {e}")
            
        connection.commit()
        connection.close()
        print("Database upgraded successfully!")
        
    except Exception as e:
        print(f"Error connecting to MySQL: {e}")

if __name__ == "__main__":
    upgrade_table()
