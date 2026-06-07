from urllib.parse import urlparse

class RepositoryProvider:

    @staticmethod
    def detect_provider(
        repository_url: str
    )-> str:
        hostname = (
            urlparse(repository_url).hostname
        )
        if not hostname:
            return "unknown"
        
        hostname = hostname.lower()

        if "github.com" in hostname:
            return "github"
        if "gitlab.com" in hostname:
            return "gitlab"
        
        return "generic"