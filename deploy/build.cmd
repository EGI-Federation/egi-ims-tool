@echo off
echo Building API containers...
docker compose -p egi-ims up -d --build --remove-orphans
