#!/bin/bash

# Define folders to delete
folders_to_delete=(".changeset" "tooling")

# Delete folders
for folder in "${folders_to_delete[@]}"; do
    if [ -d "$folder" ]; then
        rm -rf "$folder"
        echo "Deleted: $folder"
    else
        echo "Folder not found: $folder"
    fi
done

# Delete the script itself
script_name=$(basename "$0")
rm -f "$script_name"
echo "Deleted: $script_name"