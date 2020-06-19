read -p 'IP: ' ip
read -p 'Auth Basic login: ' auth_login
read -p 'Auth Basic password: ' auth_pass
read -p 'Source: ' source

curl -X POST http://$ip/lock/open --basic $auth_login:$auth_pass -H 'Content-Type: application/json' -d '{"source":"$source","initiator":"test"}'
