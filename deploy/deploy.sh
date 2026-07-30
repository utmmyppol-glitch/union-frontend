set -eu

NETWORK="union-net"
ALIAS="union-frontend-active"
IMAGE="${DOCKER_IMAGE:?DOCKER_IMAGE not set}"
CURL_IMAGE="curlimages/curl:8.10.1"

if docker ps --format '{{.Names}}' | grep -qx union-frontend-blue; then
  CURRENT=union-frontend-blue
  NEW=union-frontend-green
else
  CURRENT=union-frontend-green
  NEW=union-frontend-blue
fi

echo "==> Pulling $IMAGE"
docker pull "$IMAGE"

docker rm -f "$NEW" >/dev/null 2>&1 || true

echo "==> Starting $NEW (not yet receiving traffic)"
docker run -d --name "$NEW" --restart unless-stopped "$IMAGE"

echo "==> Health checking $NEW"
NEW_IP=$(docker inspect -f '{{.NetworkSettings.IPAddress}}' "$NEW")
OK=0
i=0
while [ "$i" -lt 10 ]; do
  if docker run --rm "$CURL_IMAGE" -sf "http://$NEW_IP:3000/" >/dev/null 2>&1; then
    OK=1
    break
  fi
  i=$((i + 1))
  sleep 3
done

if [ "$OK" -ne 1 ]; then
  echo "==> Health check failed for $NEW, rolling back (old container untouched)"
  docker rm -f "$NEW" >/dev/null 2>&1 || true
  exit 1
fi

echo "==> Switching traffic: attaching $NEW to $ALIAS"
docker network connect --alias "$ALIAS" "$NETWORK" "$NEW"

# Let in-flight connections drain / DNS caches settle before removing the old one.
sleep 2

if docker ps -a --format '{{.Names}}' | grep -qx "$CURRENT"; then
  echo "==> Removing old container $CURRENT"
  docker network disconnect "$NETWORK" "$CURRENT" >/dev/null 2>&1 || true
  docker rm -f "$CURRENT" >/dev/null 2>&1 || true
fi

echo "==> Deploy complete. Active: $NEW"
