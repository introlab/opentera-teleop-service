from fastapi import FastAPI, BackgroundTasks
import uvicorn
import aioredis
import asyncio
from contextlib import AsyncExitStack, asynccontextmanager


class OpenTeraService:
    def __init__(self, app):
        self.app = app

    def __repr__(self):
        return '<OpenTeraService>'


app = FastAPI(debug=True)
teleop_service = OpenTeraService(app)


async def cancel_redis_tasks(tasks):
    for task in tasks:
        if task.done():
            continue
        task.cancel()
        try:
            await task
        except asyncio.CancelledError:
            pass


async def handle_redis_messages(redis, channel: aioredis.pubsub.Channel, service):
    while await channel.wait_message():
        # Get message (binary)
        msg = await channel.get()
        print("Got Message:", msg)


async def redis_task(service):
    print('redis task starting...', service)

    async with AsyncExitStack() as stack:
        tasks = set()
        stack.push_async_callback(cancel_redis_tasks, tasks)

        # Auto reconnecting
        redis = await aioredis.create_redis_pool('redis://localhost')
        # await stack.enter_async_context(redis)

        res = await redis.psubscribe('*')
        # messages = await stack.enter_async_context(res[0])
        task = asyncio.create_task(handle_redis_messages(redis, res[0], service), name='handle_redis_messages')
        tasks.add(task)

        while True:
            # print('redis', redis)
            print('sleep')
            await asyncio.sleep(1)


@app.on_event('startup')
async def initial_task():
    print('Startup tasks')
    task = asyncio.create_task(redis_task(teleop_service), name='redis-task')


@app.on_event("shutdown")
def shutdown_event():
    print('Shutdown')


@app.get("/")
async def root():
    return {"message": "Hello World"}


if __name__ == "__main__":
    # This will run with one worker.
    uvicorn.run(app, host="0.0.0.0", port=8000,  loop='asyncio', debug=True)
