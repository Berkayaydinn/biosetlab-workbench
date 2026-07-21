from abc import ABC, abstractmethod


class Hook(ABC):
    """
    Base class for hooks that can be executed before and after node runs.
    """
    
    def before_run(self, node):
        """
        Method called before a node runs.
        Override this method in subclasses to add custom behavior.
        
        Args:
            node: The node that is about to run
        """
        pass
    
    def after_run(self, node):
        """
        Method called after a node runs.
        Override this method in subclasses to add custom behavior.
        
        Args:
            node: The node that just finished running
        """
        pass
