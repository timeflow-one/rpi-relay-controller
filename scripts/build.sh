# Question auth basic name
htpasswd -c nginx/.htpasswd $AUTH_BASIC_NAME

# Get or manual input available_relays.json

cp config/available_locks.example.json config/available_locks.json
nano config/available_locks.json

# Build containers
# Start containers
