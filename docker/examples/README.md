# Create Directories (only once)
mkdir database
mkdir certificates

# Create Volumes (only once)

docker volume create --name=opentera-db --opt type=none --opt device=$PWD/database --opt o=bind
docker volume create --name=opentera-certificates --opt type=none --opt device=$PWD/certificates --opt o=bind

# Start in background (as needed)

docker-compose up -d


