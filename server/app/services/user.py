from ..database.models import Users, Media, Trainer
from ..utils.user import is_email_used, hash_email, encrypt_email, hash_password
from ..utils.cloudinary import upload_file
from sqlalchemy.orm import joinedload
from ..exceptions.api_error import ApiError
from ..utils.serialize import serialize_user
from ..utils.message_codes import MessageCodes

def get_user_by_id(db, user_id, is_client):
    try:
        if not is_client:
            trainer = db.query(Trainer).filter(Trainer.ID == user_id).first()

            if not trainer:
                raise ApiError(MessageCodes.TRAINER_NOT_FOUND, 404)
            
            user_id = trainer.fk_user_ID

        user = db.query(Users).options(
            joinedload(Users.media),
            joinedload(Users.trainer)
        ).filter(Users.ID == user_id).first()

        if not user:
            raise ApiError(MessageCodes.USER_NOT_FOUND, 404)

        return serialize_user(user)
    
    except ApiError as e:
        print(f"Erro ao recuperar usuário: {e}")

        raise
    
    except Exception as e:
        print(f"Erro ao recuperar usuário: {e}")

        raise Exception(f"Erro ao recuperar o usuário: {e}")

def get_user_id_by_email(db, email):
    email_hash = hash_email(email)

    user = db.query(Users).options(joinedload(Users.trainer)).filter(Users.email_hash == email_hash).first()

    if user is None:
        raise ApiError(MessageCodes.USER_EMAIL_NOT_EXISTS, 404)

    return user.ID

def insert_user(
    db,
    name,
    email,
    password,
    is_client,
    is_dark_theme,
    is_complainter_anonymous,
    is_rater_anonymous,
    email_notification_permission,
    is_english,
    fk_media_ID
):
    try:
        if is_email_used(db, email):
            raise ApiError(MessageCodes.ERROR_EMAIL_USED, 409)

        email_hash = hash_email(email)

        email_encrypted = encrypt_email(email)

        password_hash = hash_password(password)

        new_user = Users(
            name=name,
            email_encrypted=email_encrypted,
            email_hash=email_hash,
            password=password_hash,
            is_client=is_client,
            is_active=True,
            is_dark_theme=is_dark_theme,
            is_complainter_anonymous=is_complainter_anonymous,
            is_rater_anonymous=is_rater_anonymous,
            email_notification_permission=email_notification_permission,
            is_english=is_english,
            fk_media_ID=fk_media_ID
        )

        db.add(new_user)

        db.commit()

        db.refresh(new_user)

        return new_user.ID
    
    except ApiError as e:
        print(f"Erro ao criar usuário: {e}")

        raise

    except Exception as e:
        print(f"Erro ao criar usuário: {e}")

        raise Exception(f"Erro ao criar o usuário: {e}")

def insert_photo(db, photo_file):
    try:
        url = upload_file(photo_file)

        new_media = Media(
            url=url
        )

        db.add(new_media)

        db.commit()
        
        db.refresh(new_media)

        return new_media.ID

    except ApiError as e:
        print(f"Erro ao salvar foto: {e}")

        raise

    except Exception as e:
        print(f"Erro ao salvar foto: {e}")

        raise Exception(f"Erro ao salvar a foto: {e}")
    
def modify_user_password(db, user_id, new_password): 
    try:
        user = db.query(Users).filter(Users.ID == user_id).first()

        if not user:
            raise ApiError(MessageCodes.USER_NOT_FOUND, 404)

        user.password = hash_password(new_password)

        db.commit()

        return True

    except ApiError as e:
        print(f"Erro ao modificar senha do usuário: {e}")

        raise

    except Exception as e:
        print(f"Erro ao modificar senha do usuário: {e}")

        raise Exception(f"Erro ao modificar a senha do usuário: {e}")