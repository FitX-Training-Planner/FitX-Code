from datetime import datetime, date

   
MONTHS = {
    1: "janeiro",
    2: "fevereiro",
    3: "marco",
    4: "abril",
    5: "maio",
    6: "junho",
    7: "julho",
    8: "agosto",
    9: "setembro",
    10: "outubro",
    11: "novembro",
    12: "dezembro",
}

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
 
def format_date_to_extend(data):
    return f"{data.day} de {MONTHS[data.month]} de {data.year}"