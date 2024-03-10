from sqlalchemy.orm import Session

from ..models import authmodel
from ..schemas import authschema


def create_auth_user_init(db: Session, user: authschema.UserInDB):
    user_db = authmodel.UserAuth(**user.dict())
    db.add(user_db)
    db.commit()


def get_auth_user(db: Session, username: str):
    return (
        db.query(authmodel.UserAuth)
        .filter(authmodel.UserAuth.username == username)
        .first()
    )
