import lief

def extract_pe_features(file_path):
    pe_dict = {}
    binary = lief.parse(file_path)

    # General information
    pe_dict['name'] = binary.name
    pe_dict['entrypoint'] = binary.entrypoint
    pe_dict['imagebase'] = binary.optional_header.imagebase
    pe_dict['sizeof_code'] = binary.optional_header.sizeof_code
    pe_dict['sizeof_headers'] = binary.optional_header.sizeof_headers
    pe_dict['sizeof_image'] = binary.optional_header.sizeof_image

    # Header information
    pe_dict['machine'] = binary.header.machine
    pe_dict['numberof_sections'] = binary.header.numberof_sections
    pe_dict['characteristics'] = binary.header.characteristics

    # Optional header
    pe_dict['subsystem'] = binary.optional_header.subsystem
    pe_dict['dll_characteristics'] = binary.optional_header.dll_characteristics
    pe_dict['major_operating_system_version'] = binary.optional_header.major_operating_system_version
    pe_dict['major_image_version'] = binary.optional_header.major_image_version
    pe_dict['major_subsystem_version'] = binary.optional_header.major_subsystem_version

    # Sections
    sections = []
    for section in binary.sections:
        section_info = {
            'name': section.name,
            'size': section.size,
            'virtual_address': section.virtual_address,
            'characteristics': section.characteristics,
            'entropy': section.entropy
        }
        sections.append(section_info)
    pe_dict['sections'] = sections

    # Imported libraries and functions
    imports = {}
    for imported_lib in binary.imports:
        functions = [f.name for f in imported_lib.entries]
        imports[imported_lib.name] = functions
    pe_dict['imports'] = imports

    # Exported functions
    exports = [exp.name for exp in binary.exported_functions]
    pe_dict['exports'] = exports

    # Relocations
    relocations = []
    for relocation in binary.relocations:
        reloc_info = {
            'virtual_address': relocation.virtual_address,
            'entries': [entry.address for entry in relocation.entries]
        }
        relocations.append(reloc_info)
    pe_dict['relocations'] = relocations

    # TLS (Thread Local Storage)
    if binary.has_tls:
        tls_info = {
            'callbacks': [cb for cb in binary.tls.callbacks],
            'address_of_index': binary.tls.address_of_index,
            'addressof_callbacks': binary.tls.addressof_callbacks
        }
        pe_dict['tls'] = tls_info
    else:
        pe_dict['tls'] = None

    return pe_dict

# Example usage:
file_path = "sample/gift_for_renee.exe"
pe_features = extract_pe_features(file_path)
print(len(pe_features.keys()))
