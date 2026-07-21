from typing import Literal
import pandas as pd

from app.models.graph.node.visualization.visualization import BaseVisualizationNode
from app.utils.data_validator import Check
from app.utils.file import get_file_data

class BoxPlotNode(BaseVisualizationNode):
    """
    Box plot node for visualization.
    """
    name: str = "Box Plot"
    type: Literal["node-visualization-box-plot"] = "node-visualization-box-plot"

    def build(self):
        """
        Build the box plot node.
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

        # Calculate box plot statistics for each category
        stats = []
        categories = data[y].unique()
        
        for category in categories:
            values = data[data[y] == category][x].dropna()
            
            if len(values) == 0:
                continue
            
            q1 = float(values.quantile(0.25))
            median = float(values.quantile(0.5))
            q3 = float(values.quantile(0.75))
            iqr = q3 - q1
            whisker_bottom = float(max(values.min(), q1 - 1.5 * iqr))
            whisker_top = float(min(values.max(), q3 + 1.5 * iqr))
            outliers = values[(values < whisker_bottom) | (values > whisker_top)].tolist()

            stats.append({
                "name": str(category),
                "min": whisker_bottom,
                "q1": q1,
                "median": median,
                "q3": q3,
                "max": whisker_top,
                "outliers": outliers
            })

        # Build the output
        metadata = {
            "x": x,
            "y": y,
            "count": len(stats)
        }
        out_data = {
            "data": stats,
            "metadata": metadata
        }

        self.outputs["visualization"]._value = out_data
        self.outputs["visualization"].build(out_data, full=True)
        return 