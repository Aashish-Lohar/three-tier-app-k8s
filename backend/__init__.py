from .database import create_tables

# Create database tables on import
if __name__ == "__main__":
    create_tables()
    print("Tables created successfully.")