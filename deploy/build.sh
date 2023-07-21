#!/bin/bash

echo "Building API containers..."
sudo -E docker compose -p egi-ims up -d --build --remove-orphans
