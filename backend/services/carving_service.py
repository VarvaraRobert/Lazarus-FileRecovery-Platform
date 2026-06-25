import os
import uuid
from utils.file_signatures import FILE_SIGNATURES
import hashlib

class CarvingService:

    def __init__(self, output_dir: str = "recovered_files"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)

    def carve(self, data: bytes, scan_id: str) -> list[dict]:
        recovered = []

        for file_type, sig in FILE_SIGNATURES.items():
            if file_type == "txt":
                continue

            header = sig["header"]
            footer = sig["footer"]
            max_size = sig["max_size"]

            offset = 0
            while offset < len(data):
                start = data.find(header, offset)
                if start == -1:
                    break

                if footer:
                    end = data.find(footer, start + len(header))
                    if end == -1:
                        offset = start + 1
                        continue
                    end += len(footer)
                else:
                    end = min(start + max_size, len(data))

                chunk = data[start:end]

                if len(chunk) < 16 or len(chunk) > max_size:
                    offset = start + 1
                    continue

                file_id = str(uuid.uuid4())
                filename = f"{file_id}{sig['extension']}"
                filepath = os.path.join(self.output_dir, scan_id, filename)
                os.makedirs(os.path.dirname(filepath), exist_ok=True)

                with open(filepath, "wb") as f:
                    f.write(chunk)
                md5 = hashlib.md5(chunk).hexdigest()
                sha256 = hashlib.sha256(chunk).hexdigest()

                recovered.append({
                    "file_id": file_id,
                    "file_type": file_type,
                    "size_bytes": len(chunk),
                    "offset_start": start,
                    "offset_end": end,
                    "filename": filename,
                    "filepath": filepath,
                    "md5": md5,
                    "sha256": sha256,
                })

                offset = end

        return recovered