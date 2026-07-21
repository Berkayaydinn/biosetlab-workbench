from enum import Enum

class ColumnClass(str, Enum):
    """
    Enum for the different classes of columns in a dataframe.
    """
    TARGET = "target"
    FEATURE = "feature"
    META = "meta"
    SKIP = "skip"
    UNKNOWN = "unknown"


class ColumnType(str, Enum):
    """
    Enum for the different types of columns in a dataframe.
    """
    NUMERIC = "numeric"
    CATEGORICAL = "categorical"
    TEXT = "text"
    DATE = "date"
    BOOLEAN = "boolean"
    UNKNOWN = "unknown"