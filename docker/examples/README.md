# Create Directories (only once)

```bash
mkdir database
mkdir certificates
mkdir static
mkdir signaling-static
mkdir config
```

# Create Volumes (only once)

```bash
docker volume create --name=opentera-db --opt type=none --opt device=$PWD/database --opt o=bind
docker volume create --name=opentera-certificates --opt type=none --opt device=$PWD/certificates --opt o=bind
docker volume create --name=teleop-static --opt type=none --opt device=$PWD/static --opt o=bind
docker volume create --name=teleop-signaling-static --opt type=none --opt device=$PWD/signaling-static --opt o=bind
docker volume create --name=teleop-config --opt type=none --opt device=$PWD/config --opt o=bind
```

# Start in background (as needed)

```bash
docker-compose up -d
```

# Update image

```bash
docker-compose pull
```
