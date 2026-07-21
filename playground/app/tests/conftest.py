import os
import sys
from pathlib import Path

# Get the project root directory (playground)
project_root = str(Path(__file__).parent.parent.parent)

# Add the project root to the Python path
if project_root not in sys.path:
    sys.path.insert(0, project_root) 