CONTAINER_ALREADY_STARTED="CONTAINER_ALREADY_STARTED_PLACEHOLDER"
if [ ! -e $CONTAINER_ALREADY_STARTED ]; then
    touch $CONTAINER_ALREADY_STARTED
    echo "-- First container startup --"
    npx tsx src/db/populate/populate.ts
else
    echo "-- Not first container startup --"
fi
npx tsx src/index.ts