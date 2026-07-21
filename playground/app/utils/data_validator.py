class Check:
    def __init__(self, data, name, error_message=None):
        self.data = data
        self.name = name
        self.error_message = error_message
    
    def raise_error(self, message):
        if self.error_message is None:
            raise ValueError(f"{self.name} {message}")
        else:
            raise ValueError(f"{self.error_message}")
    
    def is_provided(self):
        if self.data is None or self.data == "":
            self.raise_error("data is not provided.")
        return self

    def is_(self, data_type):
        if type(self.data) != data_type:
            self.raise_error(f"must be of type {data_type}.")
        return self
    
    def is_one_of(self, data_types: list):
        if type(self.data) not in data_types:
            self.raise_error(f"must be one of {data_types}.")
        return self
    
    def in_(self, other: list, not_=False):
        if not_:
            if self.data not in other:
                self.raise_error(f"must not be in {other}.")
        else:
            if self.data not in other:
                self.raise_error(f"must be in {other}.")
        return self
    
    def equals(self, value, not_=False, opponent_label=None):
        if not_:
            if self.data == value:
                self.raise_error(f"must not be equal to {value}." if opponent_label is None else f"must not be equal to {opponent_label}.")
        else:
            if self.data != value:
                self.raise_error(f"must be equal to {value}." if opponent_label is None else f"must be equal to {opponent_label}.")
        return self
    
    def in_between(self, lower, upper, lower_label=None, upper_label=None, left_equal=False, right_equal=False):
        lower_label = lower_label if lower_label is not None else lower
        upper_label = upper_label if upper_label is not None else upper

        lower_check = self.data >= lower if left_equal else self.data > lower
        upper_check = self.data <= upper if right_equal else self.data < upper
        if not (lower_check and upper_check):
            self.raise_error(f"must be between {lower_label} and {upper_label}.")
        return self
    
    def length(self, length, comparison):
        if comparison == "less":
            if len(self.data) > length:
                self.raise_error(f"length must be less than {length}.")
        elif comparison == "less_or_equal":
            if len(self.data) >= length:
                self.raise_error(f"length must be less than {length}.")
        elif comparison == "greater":
            if len(self.data) < length:
                self.raise_error(f"length must be greater than {length}.")
        elif comparison == "greater_or_equal":
            if len(self.data) <= length:
                self.raise_error(f"length must be greater than {length}.")
        elif comparison == "equal":
            if len(self.data) != length:
                self.raise_error(f"length must be equal to {length}.")
        else:
            self.raise_error(f"Invalid comparison: {comparison}.")
        return self