from ..__init__ import redis_client

def redis_setex(key, expiration_seconds, value):
    redis_client.setex(key, expiration_seconds, value)

def redis_delete(key):
    redis_client.delete(key)

def redis_get(key):
    return redis_client.get(key)

def redis_set_lock(key, lock_seconds):
    return redis_client.set(key, "", ex=lock_seconds, nx=True) is True

def add_online_user(user_id, sid):
    redis_client.sadd(f"online:{user_id}", sid)
    redis_client.set(f"sid:{sid}", user_id)

def update_user_presence_in_chat(chat_id, user_id, presence = True):
    if presence:
        redis_client.sadd(f"chat:{chat_id}:present", user_id)

    else:
        redis_client.srem(f"chat:{chat_id}:present", user_id)

def remove_online_user(sid):
    user_id = redis_client.get(f"sid:{sid}")

    if not user_id:
        return None, False
    
    redis_client.delete(f"sid:{sid}")
    redis_client.srem(f"online:{user_id}", sid)

    is_offline = redis_client.scard(f"online:{user_id}") == 0

    if is_offline:
        redis_client.delete(f"online:{user_id}")

    return user_id, is_offline

def remove_user_from_all_chats(user_id):
    chat_ids = []

    for key in redis_client.scan_iter("chat:*:present"):
        chat_id = key.split(":")[1]

        if redis_client.sismember(f"chat:{chat_id}:present", user_id):
                update_user_presence_in_chat(chat_id, user_id, False)

                chat_ids.append(int(chat_id))

    return chat_ids
        
def is_user_online(user_id):
    return redis_client.exists(f"online:{user_id}") == 1

def is_user_present_in_chat(chat_id, user_id):
    return redis_client.sismember(f"chat:{chat_id}:present", user_id)

def set_user_typing(chat_id, user_id, is_typing):
    if is_typing:
        redis_client.sadd(f"chat:{chat_id}:typing", user_id)

    else:
        redis_client.srem(f"chat:{chat_id}:typing", user_id)

def is_user_typing(chat_id, user_id):
    return redis_client.sismember(f"chat:{chat_id}:typing", user_id)

def clear_user_typing_from_all_chats(user_id):
    chat_ids = []

    for key in redis_client.scan_iter("chat:*:typing"):
        chat_id = key.split(":")[1]

        if redis_client.sismember(f"chat:{chat_id}:typing", user_id):
            redis_client.srem(f"chat:{chat_id}:typing", user_id)

            chat_ids.append(int(chat_id))
    
    return chat_ids