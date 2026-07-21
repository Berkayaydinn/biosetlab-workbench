import pandas as pd
import requests
import io


class FileOps:
    """
    File operations.
    """
    @staticmethod
    def read_file(file_path: str, headers: dict = None) -> pd.DataFrame:
        """
        Read the file.
        """

        # If the file is a url, download it
        if file_path.startswith("http"):
            response = requests.get(file_path, headers=headers)
            if response.status_code == 200:
                return pd.read_csv(io.StringIO(response.text))
            else:
                raise ValueError(f"Failed to download file: {response.status_code} - {response.text}")
        else:
            return pd.read_csv(file_path)

    @staticmethod
    def check_file_exists(file_path: str) -> bool:
        """
        Check if the file exists.
        """
        import os
        return os.path.exists(file_path)
    
    @staticmethod
    def read_json(json: str) -> pd.DataFrame:
        """
        Read the JSON data.
        """
        return pd.read_json(json)
