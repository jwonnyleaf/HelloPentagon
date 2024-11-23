import lief
import math


class PEAttributeExtractor:
    def __init__(self, bytez):
        self.bytez = bytez
        self.lief_binary = lief.PE.parse(list(bytez))
        self.attributes = {}

    def extract_entropy(self):
        """
        Calculate Shannon entropy for the file data.
        """
        if not self.bytez:
            return 0
        entropy = 0
        for x in range(256):
            p_x = float(self.bytez.count(bytes([x]))) / len(self.bytez)
            if p_x > 0:
                entropy += -p_x * math.log(p_x, 2)
        return entropy

    def extract(self):
        """
        Extract additional PE attributes for further analysis.
        """
        try:
            # General attributes
            self.attributes.update(
                {
                    "entropy": self.extract_entropy(),
                    "virtual_size": self.lief_binary.virtual_size,
                    "number_of_sections": self.lief_binary.header.numberof_sections,
                    "has_signature": int(self.lief_binary.has_signature),
                    "imports": len(self.lief_binary.imports),
                    "exports": len(self.lief_binary.exported_functions),
                    "symbols": len(self.lief_binary.symbols),
                }
            )
        except Exception as e:
            print(f"Error extracting attributes: {e}")
        return self.attributes
