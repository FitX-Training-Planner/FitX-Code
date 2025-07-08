from ..database.models import Users, Media, Trainer
from ..utils.user import is_email_used, hash_email, encrypt_email, hash_password
from ..utils.cloudinary import upload_file
from sqlalchemy.orm import joinedload
from ..exceptions.api_error import ApiError
from ..utils.serialize import serialize_user

def get_user_by_id(db, user_id, is_client):
    try:
        if not is_client:
            trainer = db.query(Trainer).filter(Trainer.ID == user_id).first()

            if not trainer:
                raise ApiError("Treinador não encontrado.", 404)
            
            user_id = trainer.fk_user_ID

        user = db.query(Users).options(
            joinedload(Users.media),
            joinedload(Users.trainer)
        ).filter(Users.ID == user_id).first()

        if not user:
            raise ApiError("Usuário não encontrado.", 404)

        return serialize_user(user)
    
    except ApiError as e:
        print(f"Erro ao recuperar usuário: {e}")

        raise
    
    except Exception as e:
        print(f"Erro ao recuperar usuário: {e}")

        raise Exception(f"Erro ao recuperar o usuário: {e}")

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
            raise ApiError("Já existe uma conta com esse e-mail.", 409)

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