from enum import Enum

class RepositoryStatus(str, Enum):
    PENDING = "PENDING"
    CLONING = "CLONING"
    CLONED = "CLONED"
    CHUNKING = "CHUNKING"
    EMBEDDING = "EMBEDDING"
    READY = "READY"
    FAILED = "FAILED"