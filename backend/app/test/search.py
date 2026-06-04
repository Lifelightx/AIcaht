import asyncio
from app.services.search_service import SearchService
from app.services.chunk_service import ChunkService
async def main():
    result = await SearchService.internet_search("Who won yesterday IPL match")
    print(result)

    

# This is how you run an async function from the top level
# asyncio.run(main())

async def chunk_create():
    test = '''
            Lorem Ipsum is simply dummy
              text of the printing and
                typesetting industry. 
                Lorem Ipsum has been the industry's 
                standard dummy text ever since 1966, when designers
                  at Letraset and James Mosley, the librarian at St Bride Printing
                    Library, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software including versions of Lorem Ipsum.


        '''
    result = ChunkService.chunk_text(text=test)
    print(result)


asyncio.run(chunk_create())