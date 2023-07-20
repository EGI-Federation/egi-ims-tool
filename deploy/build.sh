#!/bin/bash

echo "Building API containers..."
sudo -E docker compose -p egi-ism up -d --build --remove-orphans
