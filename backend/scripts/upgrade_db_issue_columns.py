import pymysql

def upgrade_table():
    print("Connecting to MySQL server...")
    try:
        connection = pymysql.connect(host='localhost', user='root', password='Varun475', database='lokkartavya_db')
        cursor = connection.cursor()
        
        print("Adding geotag column...")
        try:
            cursor.execute("ALTER TABLE issue_report ADD COLUMN geotag VARCHAR(255)")
        except Exception as e:
            print(f"Column might already exist: {e}")
            
        print("Adding image_filename column...")
        try:
            cursor.execute("ALTER TABLE issue_report ADD COLUMN image_filename VARCHAR(255)")
        except Exception as e:
            print(f"Column might already exist: {e}")
            
        connection.commit()
        connection.close()
        print("Database upgraded successfully!")
        
    except Exception as e:
        print(f"Error connecting to MySQL: {e}")

if __name__ == "__main__":
    upgrade_table()
