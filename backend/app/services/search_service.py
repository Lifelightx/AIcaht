from tavily import TavilyClient
from dotenv import load_dotenv
import os

load_dotenv()


class SearchService:

    client = TavilyClient(
        api_key=os.getenv("TAVILY_API_KEY")
    )

    @staticmethod
    async def internet_search(query: str) -> str:
        try:
            response = SearchService.client.search(
                query=query,
                search_depth="advanced",
                max_results=5
            )
            results = []
            for item in response.get("results", []):
                results.append(
                    f"""
                    Title: {item.get('title')}

                    Content: {item.get('content')}

                    URL: {item.get('url')}
                    """
                )
            return "\n\n".join(results)
        except Exception as e:
            print("Tavily Search Error:", e)
            return "No search results found."