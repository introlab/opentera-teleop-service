from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
import aioredis
import asyncio
from contextlib import AsyncExitStack
from fastapi.security import OAuth2PasswordBearer



class IndexRouter(APIRouter):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.redis = None
        self.redis_task = None

    async def start_redis_task(self):
        print(self, 'redis task starting...', self)
        self.redis_task = asyncio.create_task(self._redis_task(), name='redis-task')

    async def stop_redis_task(self):
        if self.redis_task:
            self.redis_task.cancel()
            try:
                await self.redis_task
            except asyncio.CancelledError as e:
                print(self, 'stop_redis_task cancelled', e)
                pass

    async def _redis_task(self):
        async with AsyncExitStack() as stack:
            tasks = set()
            stack.push_async_callback(self._cancel_redis_tasks, tasks)

            # Auto reconnecting
            self.redis = await aioredis.create_redis_pool('redis://localhost')
            res = await self.redis.psubscribe('*')
            task = asyncio.create_task(self._handle_redis_messages(self.redis, res[0]), name='handle_redis_messages')
            tasks.add(task)

            # Wait for everything to complete (or fail due to, e.g., network errors)
            await asyncio.gather(*tasks)

    async def _cancel_redis_tasks(self, tasks):
        print(self, 'cancel_redis_tasks')
        for task in tasks:
            print('cancel_redis_task', task)
            if task.done():
                continue
            task.cancel()
            try:
                await task
            except asyncio.CancelledError as e:
                print('redis cancel_redis_tasks exception: ', task, e)
                pass

    async def _handle_redis_messages(self, redis, channel: aioredis.pubsub.Channel):
        while await channel.wait_message():
            # Get message (binary)
            msg = await channel.get()
            print(self, "Got Message:", msg)


router = IndexRouter(prefix="/index")




@router.get("/")
async def index():
    print(router)
    return {"message": "Hello World!"}


@router.on_event('startup')
async def startup():
    print('router startup')
    # Start redis task
    await router.start_redis_task()

    # router.redis = await aioredis.create_redis_pool('redis://localhost')


@router.on_event('shutdown')
async def shutdown():
    print(__file__,'router shutdown')
    await router.stop_redis_task()
