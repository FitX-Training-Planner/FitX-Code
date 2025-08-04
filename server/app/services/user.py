from ..database.models import Users, Media, Trainer
from ..utils.user import is_email_used, hash_email, encrypt_email, hash_password, decrypt_email
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

def delete_user_account(db, user_id, is_client):
    try:
        if not is_client:
            trainer = db.query(Trainer).filter(Trainer.ID == user_id).first()

            if not trainer:
                raise ApiError(MessageCodes.TRAINER_NOT_FOUND, 404)
            
            user_id = trainer.fk_user_ID

        user = db.query(Users).filter(Users.ID == user_id).first()

        if not user:
            raise ApiError(MessageCodes.USER_NOT_FOUND, 404)
        
        db.delete(user)

        db.commit()

        return True
    
    except ApiError as e:
        print(f"Erro ao excluir conta do usuário: {e}")

        raise
    
    except Exception as e:
        print(f"Erro ao excluir conta do usuário: {e}")

        raise Exception(f"Erro ao excluir a conta do usuário: {e}")

def toggle_activate_profile(db, user_id, is_client, is_active):
    try:
        if not is_client:
            trainer = db.query(Trainer).filter(Trainer.ID == user_id).first()

            if not trainer:
                raise ApiError(MessageCodes.TRAINER_NOT_FOUND, 404)
            
            user_id = trainer.fk_user_ID

        user = db.query(Users).filter(Users.ID == user_id).first()

        if not user:
            raise ApiError(MessageCodes.USER_NOT_FOUND, 404)
        
        user.is_active = is_active

        db.commit()

        return True if user.is_active else False
    
    except ApiError as e:
        print(f"Erro ao alterar atributo de perfil ativo do usuário: {e}")

        raise
    
    except Exception as e:
        print(f"Erro ao alterar atributo de perfil ativo do usuário: {e}")

        raise Exception(f"Erro ao alterar o atributo de perfil ativo do usuário: {e}")
    
def get_user_email_by_id(db, user_id, is_client):
    try:
        if not is_client:
            trainer = db.query(Trainer).filter(Trainer.ID == user_id).first()

            if not trainer:
                raise ApiError(MessageCodes.TRAINER_NOT_FOUND, 404)
            
            user_id = trainer.fk_user_ID

        user = db.query(Users).filter(Users.ID == user_id).first()

        if not user:
            raise ApiError(MessageCodes.USER_NOT_FOUND, 404)

        return decrypt_email(user.email_encrypted)
    
    except ApiError as e:
        print(f"Erro ao recuperar e-mail do usuário pelo id: {e}")

        raise
    
    except Exception as e:
        print(f"Erro ao recuperar e-mail do usuário pelo id: {e}")

        raise Exception(f"Erro ao recuperar o e-mail do usuário pelo id: {e}")

def get_user_id_by_email(db, email):
    email_hash = hash_email(email)

    user = db.query(Users).filter(Users.email_hash == email_hash).first()

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

def modify_user_data(
    db,
    user_id,
    is_client,
    name = None,
    email = None,
    isDarkTheme = None,
    isComplainterAnonymous = None,
    isRaterAnonymous = None,
    emailNotificationPermission = None,
    isEnglish = None
):
    try:
        if not is_client:
            trainer = db.query(Trainer).filter(Trainer.ID == user_id).first()

            if not trainer:
                raise ApiError(MessageCodes.TRAINER_NOT_FOUND, 404)
            
            user_id = trainer.fk_user_ID

        user = db.query(Users).filter(Users.ID == user_id).first()
        
        if user is None:
            raise ApiError(MessageCodes.USER_NOT_FOUND, 404)

        updated_fields = {
            "user": {
                "config": {}
            }
        }

        if name is not None:
            user.name = name

            updated_fields["user"]["name"] = user.name

        if email is not None:
            if is_email_used(db, email):
                raise ApiError(MessageCodes.ERROR_EMAIL_USED, 409)

            email_hash = hash_email(email)

            email_encrypted = encrypt_email(email)

            user.email_encrypted = email_encrypted
            user.email_hash = email_hash
            
            updated_fields["email"] = email

        if isDarkTheme is not None:
            user.is_dark_theme = isDarkTheme

            updated_fields["user"]["config"]["isDarkTheme"] = user.is_dark_theme
        
        if isComplainterAnonymous is not None:
            user.is_complainter_anonymous = isComplainterAnonymous

            updated_fields["user"]["config"]["isComplainterAnonymous"] = user.is_complainter_anonymous

        if isRaterAnonymous is not None:
            user.is_rater_anonymous = isRaterAnonymous

            updated_fields["user"]["config"]["isRaterAnonymous"] = user.is_rater_anonymous

        if emailNotificationPermission is not None:
            user.email_notification_permission = emailNotificationPermission

            updated_fields["user"]["config"]["emailNotificationPermission"] = user.email_notification_permission

        if isEnglish is not None:
            user.is_english = isEnglish

            updated_fields["user"]["config"]["isEnglish"] = user.is_english

        db.commit()

        return updated_fields

    except ApiError as e:
        print(f"Erro ao modificar usuário: {e}")

        raise

    except Exception as e:
        print(f"Erro ao modificar usuário: {e}")

        raise Exception(f"Erro ao modificar o usuário: {e}")

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
        print(f"Erro ao salvar foto de perfil do usuário: {e}")

        raise

    except Exception as e:
        print(f"Erro ao salvar foto de perfil do usuário: {e}")

        raise Exception(f"Erro ao salvar a foto de perfil do usuário: {e}")

def modify_user_photo(db, user_id, is_client, photo_file):
    try:
        if not is_client:
            trainer = db.query(Trainer).filter(Trainer.ID == user_id).first()

            if not trainer:
                raise ApiError(MessageCodes.TRAINER_NOT_FOUND, 404)
            
            user_id = trainer.fk_user_ID

        user = db.query(Users).filter(Users.ID == user_id).first()
        
        if user is None:
            raise ApiError(MessageCodes.USER_NOT_FOUND, 404)

        url = upload_file(photo_file)

        new_media = Media(
            url=url
        )

        db.add(new_media)
        
        db.flush()

        user.fk_media_ID = new_media.ID
        
        db.commit()

        return url

    except ApiError as e:
        print(f"Erro ao modificar foto de perfil do usuário: {e}")

        raise

    except Exception as e:
        print(f"Erro ao modificar foto de perfil do usuário: {e}")

        raise Exception(f"Erro ao modificar a foto de perfil do usuário: {e}")
    
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