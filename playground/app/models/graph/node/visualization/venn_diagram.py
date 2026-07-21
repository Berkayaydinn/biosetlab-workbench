from typing import Dict, Literal
from app.services.file_ops import FileOps
from app.services.ml_ops import MLOps
from app.models.graph.input.input import BaseInput
from app.models.graph.input.data_input import DataInput
from app.models.graph.node.node import BaseNode
from app.models.graph.output.dict_output import DictOutput
from app.utils.data_validator import Check

class VennDiagramNode(BaseNode):
    name: str = "Venn Diagram"
    type: Literal["node-visualization-venn-diagram"] = "node-visualization-venn-diagram"
    inputs: Dict[str, BaseInput] = {
        "data1": DataInput(name="Data 1"),
        "data2": DataInput(name="Data 2"),
        "data3": DataInput(name="Data 3")
    }
    outputs: Dict[str, DictOutput] = {
        "venn_visualization": DictOutput(name="Venn Visualization")
    }

    def build(self):
        print(f"Building {self.name} node")

        # Parametreleri al
        comparison_mode = self.parameters.get("comparisonMode", "columns")
        intersection_mode = self.parameters.get("intersection", "auto")
        normalize = self.parameters.get("normalize", False)
        row_matching = self.parameters.get("rowMatching", "instance_identity")
        output_duplicates = self.parameters.get("outputDuplicates", False)

        # Input verileri
        data_input_json1 = self.inputs["data1"]._value
        data_input_json2 = self.inputs["data2"]._value
        data_input_json3 = self.inputs["data3"]._value

        # Kümeleri hazırlayacak fonksiyonlar
        def get_features_set(data_json):
            if not data_json:
                return set()
            metadata = data_json.get("metadata", {})
            return set(metadata.get("features", []))

        def load_df(data_json):
            if not data_json:
                return None
            Check(data_json, "Data").is_provided().is_(dict)
            path = data_json.get("data", None)
            if isinstance(path, str):
                return FileOps.read_json(path)
            return None

        # Venn hesaplama
        if comparison_mode == "columns":
            # Her input’tan features kümesini alıyoruz (File node seçili sütunlar)
            A = get_features_set(data_input_json1)
            B = get_features_set(data_input_json2)
            C = get_features_set(data_input_json3)

            venn_sets = MLOps.compute_venn_for_three_sets(A, B, C if len(C) > 0 else None)
        else:
            # rows modunda, DF'leri yükleyip index setlerini kullanıyoruz
            df1 = load_df(data_input_json1)
            df2 = load_df(data_input_json2)
            df3 = load_df(data_input_json3)

            A = set(df1.index) if df1 is not None else set()
            B = set(df2.index) if df2 is not None else set()
            C = set(df3.index) if df3 is not None else set()

            # İsteğe bağlı parametreler: row_matching, output_duplicates, intersection_mode
            # Bu basit örnekte, row_matching ve output_duplicates doğrudan kullanılmıyor,
            # ama isterseniz ek mantık ekleyebilirsiniz.
            venn_sets = MLOps.compute_venn_for_three_sets(A, B, C if len(C) > 0 else None)

        # Normalize edilecekse
        if normalize:
            venn_sets = MLOps.normalize_venn(venn_sets)

        # Çıktıyı oluştur
        self.outputs["venn_visualization"].build(
            value={"sets": venn_sets},
            full=True
        )
        self.outputs["venn_visualization"].display_value = {
            "sets": venn_sets
        }
        print("Venn Diagram data:", venn_sets)
        return
