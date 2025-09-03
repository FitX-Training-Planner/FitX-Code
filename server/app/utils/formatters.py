from datetime import datetime, date

def safe_int(value):
    if value in ("", None):
        return None

    try:
        return int(value)

    except Exception:
        return None

def safe_float(value):
    if value in ("", None):
        return None

    try:
        return float(value)
    
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
    if isinstance(value, (str, int, float)) and value != "":
        return str(value)
    
    return None
    
def safe_time(value):
    if value in ("", None):
        return None
    
    try:
        return datetime.strptime(value, "%H:%M").time()
    
    except Exception:
        return None

def safe_date(value):
    if value in ("", None):
        return None

    if isinstance(value, date):
        return value 

    try:
        return datetime.strptime(str(value), "%Y-%m-%d").date()
    
    except Exception:
        return None
