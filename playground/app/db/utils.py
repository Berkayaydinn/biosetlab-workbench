import uuid


def create_id(prefix: str = "") -> str:
    """
    - Create a unique identifier.
    """
    return f"{prefix}-{uuid.uuid4().hex}"

class KeyEncoder:

    def encode_keys(self, data):
        return self._encode_key_recursive(data)
    
    def decode_keys(self, data):
        return self._decode_key_recursive(data)

    def _encode_key(self, key: str):
        return key.replace("\\", "\\\\").replace("\$", "\\u0024")\
            .replace(".", "\\u002e")
    
    def _encode_key_recursive(self, data):
        if isinstance(data, str):
            return self._encode_key(data)
        elif isinstance(data, dict):
            return {
                self._encode_key(key): self._encode_key_recursive(value) 
                for key, value in data.items()
            }
        elif isinstance(data, list):
            return [self._encode_key_recursive(value) for value in data]
        return data
    
    def _decode_key(self, key: str):
        return key.replace("\\\\", "\\").replace("\\u0024", "$")\
            .replace("\\u002e", ".")
    
    def _decode_key_recursive(self, data):
        if isinstance(data, str):
            return self._decode_key(data)
        elif isinstance(data, dict):
            return {
                self._decode_key(key): self._decode_key_recursive(value)
                for key, value in data.items()
            }
        elif isinstance(data, list):
            return [self._decode_key_recursive(value) for value in data]
        return data
