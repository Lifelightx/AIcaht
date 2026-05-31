import asyncio
from app.services.search_service import SearchService

async def main():
    result = await SearchService.internet_search("Who won yesterday IPL match")
    print(result)

# This is how you run an async function from the top level
asyncio.run(main())