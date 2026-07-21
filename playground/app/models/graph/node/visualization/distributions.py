from typing import Literal
import pandas as pd

from app.models.graph.node.visualization.visualization import BaseVisualizationNode
from app.utils.data_validator import Check
from app.utils.file import get_file_data

"""
Distributions node for visualization of the frequency of values in a column.
"""


class DistributionsNode(BaseVisualizationNode):
    """
    Distributions node for visualization.
    """
    name: str = "Distributions"
    type: Literal["node-visualization-distributions"] = "node-visualization-distributions"

    def build(self):
        """
        Build the distributions node.
        """
        print(f"Building {self.name} node")

        # Get data
        data_input_json = self.inputs["data"]._value
        data_dict = get_file_data(data_input_json)
        data = data_dict["data_used"]

        # Check if x value are provided
        Check(self.parameters["x"], "X-axis").is_provided().is_(str).in_(data.columns)
        x = self.parameters["x"]

        # Check if group by value is provided
        group_by = self.parameters.get("group_by", None)
        if group_by is not None and group_by != '':
            Check(group_by, "Group by").is_provided().is_(str).in_(data.columns)

        # Get unique values with frequency if x is a string
        if data[x].dtype == 'object':
            distribution = pd.value_counts(data[x], normalize=True).sort_index()
            data_list = [{"name": str(bin), "value": freq} for bin, freq in distribution.items()]
            result = {
                "data": data_list,
                "metadata": {
                    "x": x,
                    "y": "Frequency",
                    "group_by": None,
                    "groups": None,
                    "type": "bar",
                    "num_bins": 0
                }
            }
            self.outputs["visualization"]._value = result
            self.outputs["visualization"].build(value=result, full=True)
            return

        # Convert data[x] to numeric, handling non-numeric data
        data[x] = pd.to_numeric(data[x], errors='coerce')
        # Get bin width from parameters or use default
        bin_width = self.parameters.get("bin_width", 2)  # Default bin width of 2
        
        # Calculate the range and create bins
        x_min = data[x].min()
        x_max = data[x].max()
        
        # Calculate number of bins based on bin width
        num_bins = max(2, int((x_max - x_min) / bin_width))
        
        # Create bins using pandas cut
        bins = pd.cut(data[x], bins=num_bins)
        
        if group_by is not None and group_by != '':
            # Create a grouped distribution
            distribution = pd.crosstab(bins, data[group_by], normalize='columns')
            
            # Get unique groups
            groups = distribution.columns.tolist()
            
            # Convert the distribution to the expected format with string indices
            distribution_data = distribution.reset_index()
            # Convert Interval objects to strings
            distribution_data.iloc[:, 0] = distribution_data.iloc[:, 0].astype(str)

            # Change the column name to 'name'
            distribution_data.rename(columns={x: 'name'}, inplace=True)
            
            result = {
                "data": distribution_data.to_dict('records'),
                "metadata": {
                    "x": x,
                    "y": "Frequency",
                    "groups": groups,
                    "type": "stacked_bar",
                    "group_by": group_by,
                    "num_bins": num_bins
                }
            }
        else:
            # Create a simple distribution
            distribution = pd.value_counts(bins, normalize=True).sort_index()
            
            # Convert to the expected format
            data_list = [{"name": str(bin), "value": freq} for bin, freq in distribution.items()]
            
            result = {
                "data": data_list,
                "metadata": {
                    "x": x,
                    "y": "Frequency",
                    "group_by": None,
                    "groups": None,
                    "type": "bar",
                    "num_bins": num_bins
                }
            }

        self.outputs["visualization"]._value = result
        self.outputs["visualization"].build(value=result, full=True)
        return