CONTAINER_ALREADY_STARTED="CONTAINER_ALREADY_STARTED_PLACEHOLDER"
if [ ! -e $CONTAINER_ALREADY_STARTED ]; then
    touch $CONTAINER_ALREADY_STARTED
    echo "-- First container startup --"
    node_modules/.bin/ts-node-esm src/db/populate/populate.ts
else
    echo "-- Not first container startup --"
fi
node_modules/.bin/ts-node-esm src/index.ts