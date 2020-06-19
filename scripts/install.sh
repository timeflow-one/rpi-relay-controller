sudo apt-get update && sudo apt-get upgrade
# Install apache utils for create basic auth credentials
sudo apt install apache2-utils -y
# Install git
sudo apt install git -y2
# Install docker
sudo apt-get install apt-transport-https ca-certificates software-properties-common -y
curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
sudo sh /tmp/get-docker.sh
sudo usermod -aG docker pi
docker version
