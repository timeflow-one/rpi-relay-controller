read -p 'Auth basic username: ' auth_basic_name
htpasswd -c nginx/.htpasswd $auth_basic_name

cp config/available_locks.example.json config/available_locks.json
nano config/available_locks.json

# Build containers
docker-compose -f docker-compose.yml build
# Start containers
docker-compose -f docker-compose.yml up
