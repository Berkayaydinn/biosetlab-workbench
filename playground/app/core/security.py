from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt
from fastapi import HTTPException, Security, status
from app.core.config import cfg
from loguru import logger


class Token:
    """
    - Token class to verify the token.
    - The service uses the tokens from the main backend service to authenticate
    the requests. It does not generate any tokens.
    """
    def __init__(self):
        self.SECRET_KEY = cfg.SECRET_KEY
        self.ALGORITHM = cfg.ALGORITHM

    def decode_token(self, token: str):
        """
        - Verifies the token.
        """
        INVALID_TOKEN_MSG = HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token",
                    headers={"WWW-Authenticate": "Bearer"},
                )

        try:
            decoded_token = jwt.decode(
                token, str(self.SECRET_KEY), algorithms=[self.ALGORITHM]
            )
            return decoded_token
        except Exception as e:
            logger.error(f"Error: {e}")
            raise INVALID_TOKEN_MSG

    def get_user_id(
            self,
            credentials: HTTPAuthorizationCredentials = Security(HTTPBearer())
            ):
        """
        - Extracts the user_id from the token.
        """
        token = credentials.credentials
        token = self.decode_token(token)
        return token.get("userId")


token = Token()
