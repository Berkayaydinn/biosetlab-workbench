from typing import Literal
import pandas as pd

from app.models.graph.node.visualization.visualization import BaseVisualizationNode

from app.utils.data_validator import Check
from app.utils.file import get_file_data

"""
Bar plot node for visualization.
"""


class BarPlotNode(BaseVisualizationNode):
    """
    Bar plot node for visualization.
    """
    name: str = "Bar Plot"
    type: Literal["node-visualization-bar-plot"] = "node-visualization-bar-plot"

    def build(self):
        """
        Build the bar plot node.
        """
        print(f"Building {self.name} node")

        # Check if x value are provided
        Check(self.parameters["x"], "X-axis").is_provided().is_(str)
        x = self.parameters["x"]

        # Get data
        data_input_json = self.inputs["data"]._value
        data_dict = get_file_data(data_input_json)
        data = data_dict["data_used"]

        # Check if the values are in the data
        Check(x, "X-axis").is_provided().is_(str).in_(data.columns)

        # Check if y value are provided
        if not "y" in self.parameters or self.parameters["y"] == "":
            # If not provided, get all values in the x column one by one
            # "1": first value of the x column, "2": second value of the x column, etc.
            # It does not count the number of occurrences of each value, it just lists them
            
            # Get the unique values in the x column
            y = ""
            fig = data[x]
            fig = [{"name": i+1, "value": value} for i, value in enumerate(fig)]
            fig = pd.DataFrame(fig)

        else:
            y = self.parameters["y"]
            Check(x, "X axis").equals(y, not_=True, opponent_label="Y axis")
            # If provided, group the data by the x column and sum the y column
            fig = data.groupby(x)[y].sum().reset_index()
            fig.columns = ["name", "value"]
        
        # Create JSON data for the Recharts bar plot
        fig = fig.to_dict(orient="records")

        # Sort the values by name
        fig = sorted(fig, key=lambda x: x["name"])

        # Build the output
        metadata = {
            "x": x,
            "y": y if "y" in self.parameters else "Values"
        }
        out_data = {
            "data": fig,
            "metadata": metadata
        }

        self.outputs["visualization"]._value = out_data
        self.outputs["visualization"].build(out_data, full=True)
        return