from fastapi import FastAPI
import uvicorn
import aioredis
import asyncio
from contextlib import AsyncExitStack


class OpenTeraService(FastAPI):
    def __init__(self):
        FastAPI.__init__(self, debug=True)
        self.redis_task = None
        self.setup_events()
        self.setup_routes()

    def setup_events(self):
        # Add event(s)
        self.add_event_handler('startup', self.startup_event_handler)
        self.add_event_handler('shutdown', self.shutdown_event_handler)

    def setup_routes(self):
        # add routes
        from app.routers.index import router as index_router
        self.include_router(index_router, prefix="/api")

    def __repr__(self):
        return '<OpenTeraService> ' + super().__repr__()

    def create_redis_task(self):
        self.redis_task = asyncio.create_task(redis_task(self), name='redis-task')
        print('Starting redis task:', self.redis_task)

    async def startup_event_handler(self):
        print('startup_event_handler', self)
        # self.create_redis_task()

    async def shutdown_event_handler(self):
        print('shutdown_event_handler', self)
        pass

    async def handle_root_url(self, request):
        print(request, self)
        return {'message': 'Hello World!'}


# service = OpenTeraService()


# @service.on_event('startup')
# async def initial_task():
#     print('Startup tasks')
#     service.create_redis_task()
#     # OpenTeraService.redis_task = asyncio.create_task(redis_task(teleop_service), name='redis-task')
#
#
# @service.on_event("shutdown")
# async def shutdown_event():
#     print('Shutdown')
#
#     if OpenTeraService.redis_task:
#         try:
#             OpenTeraService.redis_task.cancel()
#             await OpenTeraService.redis_task
#         except asyncio.CancelledError as e:
#             print(e)
#             print('redis_task_done!')
#             pass


# @service.get("/")
# async def root():
#      return {"message": "Hello World"}


async def cancel_redis_tasks(tasks):
    for task in tasks:
        print('cancel_redis_task', task)
        if task.done():
            continue
        task.cancel()
        try:
            await task
        except asyncio.CancelledError as e:
            print('redis cancel_redis_tasks exception: ', task,  e)
            pass


async def handle_redis_messages(redis, channel: aioredis.pubsub.Channel, service: OpenTeraService):
    while await channel.wait_message():
        # Get message (binary)
        msg = await channel.get()
        print("Got Message:", msg)


async def redis_task(service: OpenTeraService):
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

        # Wait for everything to complete (or fail due to, e.g., network errors)
        await asyncio.gather(*tasks)


if __name__ == "__main__":
    # This will run with one worker.
    service = OpenTeraService()
    uvicorn.run(service, host="0.0.0.0", port=8000, loop='asyncio', debug=True)

    # Multiple workers.
    # uvicorn.run('opentera-teleop-service:service', host="0.0.0.0", port=8000,  loop='asyncio', debug=True, workers=8)

