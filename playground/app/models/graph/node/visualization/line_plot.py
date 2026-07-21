from typing import Literal
import pandas as pd

from app.models.graph.node.visualization.visualization import BaseVisualizationNode
from app.utils.data_validator import Check
from app.utils.file import get_file_data

class LinePlotNode(BaseVisualizationNode):
    """
    Line plot node for visualization.
    """
    name: str = "Line Plot"
    type: Literal["node-visualization-line-plot"] = "node-visualization-line-plot"

    def build(self):
        """
        Build the line plot node.
        """
        print(f"Building {self.name} node")

        # Check if x and y values are provided
        Check(self.parameters["x"], "X-axis").is_provided().is_(str)
        Check(self.parameters["y"], "Y-axis").is_provided().is_(str)
        x = self.parameters["x"]
        y = self.parameters["y"]

        # Get data
        data_input_json = self.inputs["data"]._value
        data_dict = get_file_data(data_input_json)
        data = data_dict["data_used"]

        # Check if the values are in the data
        Check(x, "X-axis").is_provided().is_(str).in_(data.columns)
        Check(y, "Y-axis").is_provided().is_(str).in_(data.columns)

        # Ensure x column contains numeric data
        try:
            data[x] = pd.to_numeric(data[x], errors='coerce')
        except:
            raise ValueError(f"Column {x} must contain numeric data")

        # Ensure y column contains numeric data
        try:
            data[y] = pd.to_numeric(data[y], errors='coerce')
        except:
            raise ValueError(f"Column {y} must contain numeric data")

        # Sort data by x values for proper line plotting
        data = data.sort_values(by=x)

        # Prepare the line plot data
        plot_data = []
        for idx, row in data.iterrows():
            if pd.isna(row[x]) or pd.isna(row[y]):
                continue
            plot_data.append({
                "x": float(row[x]),
                "y": float(row[y])
            })

        # Build the output
        metadata = {
            "x": x,
            "y": y,
            "count": len(plot_data)
        }
        out_data = {
            "data": plot_data,
            "metadata": metadata
        }

        # Use the visualization output from BaseVisualizationNode
        self.outputs["visualization"]._value = out_data
        self.outputs["visualization"].build(out_data, full=True)
