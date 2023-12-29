#!/bin/bash

# Define folders to delete
folders_to_delete=(".changeset" "tooling")

# Delete folders
for folder in "${folders_to_delete[@]}"; do
    if [ -d "$folder" ]; then
        rm -rf "$folder"
    else
        echo "Folder not found: $folder"
    fi
done

# install packages
pnpm install

# Delete the script itself
script_name=$(basename "$0")
rm -f "$script_name"
echo "Done!"