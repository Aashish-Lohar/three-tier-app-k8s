from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy_utils import database_exists, create_database
import os

# Get database URL from environment or use default
# DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/todos")
DATABASE_SERVICE = os.getenv("DATABASE_SERVICE", "localhost")
POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "postgres")
DATABASE_URL = (
    f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{DATABASE_SERVICE}:5432/todos"
)
print(f"Connecting to database at {DATABASE_URL}")
# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Check if the database exists; if not, create it
if not database_exists(engine.url):
    create_database(engine.url)
    print(f"Database '{DATABASE_URL}' created successfully.")
else:
    print(f"Database '{DATABASE_URL}' already exists.")

# Create sessionmaker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()


# Create tables on startup
def create_tables():
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    pass
