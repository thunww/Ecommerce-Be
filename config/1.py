import jwt
import time

# Secret key provided
secret_key = "your_secret_key_here"

# Current time for iat (issued at) and exp (expiration)
current_time = int(time.time())
expiration_time = current_time + 3600  # 1 hour from now

# Payload similar to the provided token
payload = {
    "user_id": 6,
    "email": "charlie@example.com",
    "roles": ["admin","vendor"],  # Modified to include only admin role
    "iat": current_time,
    "exp": expiration_time
}

# Header
header = {
    "alg": "HS256",
    "typ": "JWT"
}

# Generate JWT token
token = jwt.encode(payload, secret_key, algorithm="HS256", headers=header)

print(token)