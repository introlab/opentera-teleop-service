from fastapi import FastAPI, BackgroundTasks
import uvicorn
import aioredis
import asyncio


class OpenTeraService:
    def __init__(self, app):
        self.app = app

    def __repr__(self):
        return '<OpenTeraService>'


app = FastAPI(debug=True)
teleop_service = OpenTeraService(app)


async def redis_task(service):
    print('redis task starting...', service)
    redis = await aioredis.create_redis('redis://localhost')
    while True:
        # print('redis', redis)
        print('sleep')
        await asyncio.sleep(1)


@app.on_event('startup')
async def initial_task():
    print('Startup tasks')
    task = asyncio.create_task(redis_task(teleop_service))


@app.on_event("shutdown")
def shutdown_event():
    print('Shutdown')


@app.get("/")
async def root():
    return {"message": "Hello World"}


if __name__ == "__main__":
    # This will run with one worker.
    uvicorn.run(app, host="0.0.0.0", port=8000,  loop='asyncio', debug=True)
