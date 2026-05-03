import pymysql

def upgrade_table():
    print("Connecting to MySQL server...")
    try:
        connection = pymysql.connect(host='localhost', user='root', password='Varun475', database='lokkartavya_db')
        cursor = connection.cursor()
        
        print("Adding created_at column...")
        try:
            cursor.execute("ALTER TABLE user ADD COLUMN created_at DATETIME")
        except Exception as e:
            print(f"Column might already exist: {e}")
            
        print("Adding last_login column...")
        try:
            cursor.execute("ALTER TABLE user ADD COLUMN last_login DATETIME")
        except Exception as e:
            print(f"Column might already exist: {e}")
            
        connection.commit()
        connection.close()
        print("Database upgraded successfully!")
        
    except Exception as e:
        print(f"Error connecting to MySQL: {e}")

if __name__ == "__main__":
    upgrade_table()
