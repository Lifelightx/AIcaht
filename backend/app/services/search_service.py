from ddgs import DDGS

class SearchService:
    @staticmethod
    async def internet_search(query: str)->str:
        result = []
        with DDGS() as ddgs:
            search_results = ddgs.text(
                query,
                max_results=5
            )
            for item in search_results:
                result.append(
                    f"""
                Title: {item.get("title")}
                Body: {item.get("body")}
                URL: {item.get("href")}
                    """
                )
            
            return "\n\n".join(result)