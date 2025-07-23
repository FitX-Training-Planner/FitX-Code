import cloudinary
import cloudinary.uploader
from ..exceptions.api_error import ApiError
from .message_codes import MessageCodes

def upload_file(file):
    try:
        result = cloudinary.uploader.upload(file, resource_type="image")

        return result["secure_url"]

    except Exception as e:
        print(f"Erro ao fazer upload: {e}")

        raise ApiError(MessageCodes.ERROR_UPLOAD_PHOTO, 500)
