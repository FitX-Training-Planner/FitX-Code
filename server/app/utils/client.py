from .redis import redis_set_lock, redis_delete

def acquire_client_lock(client_id, lock_time):
    key = f"client:{client_id}:lock"

    return redis_set_lock(key, lock_time)

def release_client_lock(client_id):
    key = f"client:{client_id}:lock"

    redis_delete(key)