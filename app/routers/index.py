from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(prefix="/index")


@router.get("/")
async def index():
    print(router)
    return {"message": "Hello World!"}


@router.on_event('startup')
async def startup():
    print('router startup')
    pass


@router.on_event('shutdown')
async def shutdown():
    print('router shutdown')
    pass
