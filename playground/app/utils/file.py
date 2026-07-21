from app.services.file_ops import FileOps
from app.utils.data_validator import Check
from app.models.graph.node.data.enums import ColumnClass, ColumnType


def get_file_data(data_input_json):
        # Get data
        Check(data_input_json, "Data Input").is_provided().is_(dict)

        Check(data_input_json, "Data input").is_provided().is_(dict)
        data = data_input_json.get("data", None)
        Check(data, "Data").is_provided().is_(str)
        data_metadata = data_input_json.get("metadata", None)
        Check(data_metadata, "Data metadata").is_provided().is_(dict)
        data = FileOps.read_json(data)
        skip_column_info = data_metadata.get("skip_column_info", False)
        
        if skip_column_info:
            return {
                "data_full": data,
                "data_shown": data,
                "data_used": data,
                "column_info": {},
                "features": [],
                "target": []
            }

        # Check metadata
        column_info = data_metadata.get("column_info", None)
        Check(column_info, "Column info").is_provided().is_(dict)
        for column_name, column in column_info.items():
            Check(column, "Column").is_provided().is_(dict)
            Check(column.get("name", column_name), "Column name").is_provided().is_(str).in_(data.columns)
        
        # Get feature columns
        feature_items = {name: col for name, col in column_info.items() if col["class"] == ColumnClass.FEATURE}
        Check(feature_items, "Features").is_provided().is_(dict).length(0, "greater")
        for feature_name, feature in feature_items.items():
            Check(feature.get("name", feature_name), "Feature").is_provided().is_(str).in_(data.columns)

        # Get target column
        target_items = {name: col for name, col in column_info.items() if col["class"] == ColumnClass.TARGET}
        Check(target_items, "Target").is_provided().is_(dict).length(1, "equal")
        target_name = list(target_items.keys())[0]
        target = target_items[target_name]
        Check(target.get("name", target_name), "Target").is_provided().is_(str).in_(data.columns)

        # Get skip columns
        skip_items = {name: col for name, col in column_info.items() if col["class"] == ColumnClass.SKIP}
        Check(skip_items, "Skip columns").is_provided().is_(dict).length(0, "greater")
        for skip_name, skip_column in skip_items.items():
            Check(skip_column.get("name", skip_name), "Skip column").is_provided().is_(str).in_(data.columns)
        
        # Get meta columns
        meta_items = {name: col for name, col in column_info.items() if col["class"] == ColumnClass.META}
        Check(meta_items, "Meta columns").is_provided().is_(dict).length(0, "greater")
        for meta_name, meta_column in meta_items.items():
            Check(meta_column.get("name", meta_name), "Meta column").is_provided().is_(str).in_(data.columns)

        # Get data
        feature_names = list(feature_items.keys())
        target_name = list(target_items.keys())[0]
        meta_names = list(meta_items.keys())
        data_full = data
        data_shown = data[feature_names + [target_name] + meta_names]
        data_used = data[feature_names + [target_name]]


        # Check data is not empty
        data_list = data_full.values.tolist()
        Check(data_list, "Data").is_provided().length(0, "greater_or_equal")

        return {
            "data_full": data_full,
            "data_shown": data_shown,
            "data_used": data_used,
            "column_info": column_info,
            "features": feature_names,
            "target": target_name
        }
