read -p 'Auth Basic username: ' auth_basic_name
htpasswd -c nginx/.htpasswd $auth_basic_name
