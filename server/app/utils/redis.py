from ..__init__ import redis_client

def redis_setex(key, expiration_seconds, value):
    redis_client.setex(key, expiration_seconds, value)

def redis_delete(key):
    redis_client.delete(key)

def redis_get(key):
    return redis_client.get(key)

def redis_set_lock(key, lock_seconds):
    return redis_client.set(key, "", ex=lock_seconds, nx=True) is True
