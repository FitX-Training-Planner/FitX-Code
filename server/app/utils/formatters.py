from datetime import datetime

def safe_int(value):
    if value in ("", None):
        return None

    try:
        return int(value)

    except Exception:
        return None

def safe_bool(value):
    if value in ("", None):
        return False

    if isinstance(value, bool):
        return value

    if str(value).lower() in ["true", "1"]:
        return True
    
    return False

def safe_str(value):
    return value if value != "" else None

def safe_time(value):
    if value in ("", None):
        return None
    
    try:
        return datetime.strptime(value, "%H:%M").time()
    
    except Exception:
        return None
