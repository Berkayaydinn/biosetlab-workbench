from typing import Dict, Literal
import pandas as pd
import io
from app.models.graph.node.node import BaseNode
from app.models.graph.input.data_input import DataInput
from app.models.graph.output.dict_output import DictOutput
from app.utils.data_validator import Check
from app.utils.file import get_file_data
import base64


class SaveDataNode(BaseNode):
    """
    Node that takes data inputs and exports them as downloadable files.
    """
    name: str = "Save Data"
    type: Literal["node-data-save-data"] = "node-data-save-data"
    
    inputs: Dict[str, DataInput] = {
        "data": DataInput(name="Data")
    }
    outputs: Dict[str, DictOutput] = {
        "data": DictOutput(name="Export Data")
    }

    def __init__(self, **data):
        super().__init__(**data)

    def build(self):
        """
        Build the save data node.
        """
        print(f"Building {self.name} node")
        
        # Validate file_type parameter
        file_type = self.parameters.get("file_type", "csv")
        Check(file_type, "File type").is_provided().is_(str).in_(["csv", "tab", "xlsx"])
        
        # Get filename parameter or determine default
        custom_filename = self.parameters.get("filename", "").strip()
        
        # Get input data
        data_input = self.inputs["data"]
        data_input_json = data_input._value
        print(data_input)
        
        try:
            if not data_input_json or data_input_json == "":
                raise ValueError("No data provided for export. Please connect a data input.")
            
            data_dict = get_file_data(data_input_json)
            df = data_dict["data_used"]
            
            # Try to get default filename from data metadata
            if not custom_filename:
                metadata_name = data_dict.get("metadata", {}).get("name")
                if metadata_name:
                    default_filename = str(metadata_name).strip()
                    # Clean filename - remove invalid characters
                    import re
                    default_filename = re.sub(r'[<>:"/\\|?*]', '_', default_filename)
                    if default_filename:
                        custom_filename = default_filename
            
            # Validate that we have a DataFrame
            if not isinstance(df, pd.DataFrame):
                raise ValueError("Input data must be convertible to a DataFrame.")
            
            if df.empty:
                raise ValueError("Input data is empty. Cannot export empty dataset.")
            
            # Final filename determination
            if not custom_filename:
                custom_filename = "exported_data"
            
            # Generate file content based on file_type
            if file_type == "csv":
                buffer = io.StringIO()
                df.to_csv(buffer, index=False)
                file_content = buffer.getvalue()
                filename = f"{custom_filename}.csv"
                mime_type = "text/csv"
                is_base64 = False
                
            elif file_type == "tab":
                buffer = io.StringIO()
                df.to_csv(buffer, sep='\t', index=False)
                file_content = buffer.getvalue()
                filename = f"{custom_filename}.tsv"
                mime_type = "text/tab-separated-values"
                is_base64 = False
                
            elif file_type == "xlsx":
                # For Excel, we need to use BytesIO
                try:
                    excel_buffer = io.BytesIO()
                    with pd.ExcelWriter(excel_buffer, engine='openpyxl') as writer:
                        df.to_excel(writer, index=False, sheet_name='Data')
                    
                    # Convert to base64 for transmission
                    excel_buffer.seek(0)
                    file_content = base64.b64encode(excel_buffer.getvalue()).decode('utf-8')
                    filename = f"{custom_filename}.xlsx"
                    mime_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    is_base64 = True
                except ImportError:
                    raise ValueError("openpyxl library is required for Excel export. Please install it using 'pip install openpyxl' or use CSV/TSV format.")
                except Exception as e:
                    raise ValueError(f"Error creating Excel file: {str(e)}")
            
            # Prepare output data
            export_data = {
                "file_content": file_content,
                "filename": filename,
                "mime_type": mime_type,
                "file_type": file_type,
                "rows": len(df),
                "columns": len(df.columns),
                "column_names": list(df.columns),
                "is_base64": is_base64,
                "custom_filename": custom_filename
            }
            
            self.outputs["data"].build(value=export_data)
            
        except Exception as e:
            raise ValueError(f"Error exporting data: {str(e)}")