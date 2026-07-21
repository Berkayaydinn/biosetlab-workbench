from typing import Literal
import pandas as pd

from app.models.graph.node.visualization.visualization import BaseVisualizationNode
from app.utils.data_validator import Check
from app.models.graph.error import ErrorType
from app.utils.file import get_file_data

class ScatterPlotNode(BaseVisualizationNode):
    """
    Scatter plot node for visualization.
    """
    name: str = "Scatter Plot"
    type: Literal["node-visualization-scatter-plot"] = "node-visualization-scatter-plot"

    def build(self):
        """
        Build the scatter plot node.
        """
        print(f"Building {self.name} node")

        # Check if x and y values are provided
        Check(self.parameters["x"], "X-axis").is_provided().is_(str)
        Check(self.parameters["y"], "Y-axis").is_provided().is_(str)
        x = self.parameters["x"]
        y = self.parameters["y"]

        # Optional group by parameter
        group_by = self.parameters.get("group_by", '')

        # Get data
        data_input_json = self.inputs["data"]._value
        data_dict = get_file_data(data_input_json)
        data = data_dict["data_used"]

        # Check if the values are in the data
        Check(x, "X-axis").is_provided().is_(str).in_(data.columns)
        Check(y, "Y-axis").is_provided().is_(str).in_(data.columns)
        
        # Optional group by validation
        if group_by and group_by not in data.columns:
            self.raise_error(
                type=ErrorType.INFO,
                message=f"Group by column '{group_by}' not found in data. Skipping grouping."
            )
            group_by = ''

        # Ensure x and y columns contain numeric data
        try:
            data[x] = pd.to_numeric(data[x], errors='coerce')
            data[y] = pd.to_numeric(data[y], errors='coerce')
        except:
            raise ValueError(f"Columns {x} and {y} must contain numeric data")

        # Prepare the scatter plot data
        plot_data = []
        groups = []
        
        # If group_by is specified, get unique group values
        if group_by:
            groups = list(data[group_by].unique())
            groups = [str(g) for g in groups if pd.notna(g)]

        for idx, row in data.iterrows():
            if pd.isna(row[x]) or pd.isna(row[y]):
                continue
            
            # Prepare data point with optional group
            data_point = {
                "x": float(row[x]),
                "y": float(row[y])
            }
            
            # Add group if specified
            if group_by:
                data_point["group"] = str(row[group_by]) if pd.notna(row[group_by]) else 'Unknown'
            
            plot_data.append(data_point)

        # Build the output
        metadata = {
            "x": x,
            "y": y,
            "count": len(plot_data),
            "groups": groups,
            "group_by": group_by
        }
        out_data = {
            "data": plot_data,
            "metadata": metadata
        }

        # Use the visualization output from BaseVisualizationNode
        self.outputs["visualization"]._value = out_data
        self.outputs["visualization"].build(out_data, full=True)
