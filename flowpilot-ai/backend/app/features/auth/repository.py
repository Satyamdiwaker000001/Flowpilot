from sqlalchemy.orm import Session

from app.features.auth.model import User


class AuthRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str):

        return (
            self.db.query(User)
            .filter(User.email == email)
            .first()
        )

    def create_user(
        self,
        full_name: str,
        email: str,
        password: str,
    ):

        user = User(
            full_name=full_name,
            email=email,
            password=password,
        )

        self.db.add(user)

        self.db.commit()

        self.db.refresh(user)

        return user