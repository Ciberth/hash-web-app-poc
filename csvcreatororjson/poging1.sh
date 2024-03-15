#!/bin/bash

# Array of folders to enumerate
folders=(
	"/usr/bin"
	"/etc"
)

# Output file
output_file="output.json"

# Function to calculate md5sum of a file
calculate_md5sum() {
    md5sum "$1" | awk '{print $1}'
}

# Function to get current timestamp
get_timestamp() {
    date +"%Y-%m-%d %H:%M:%S"
}

# Initialize an empty array for storing file information
file_info=('[')

# Iterate through each folder
for folder in "${folders[@]}"; do
    # Check if the folder exists
    if [ -d "$folder" ]; then
        # Iterate through each file in the folder
        while IFS= read -r -d '' file; do
            # Get md5sum hash
            md5=$(calculate_md5sum "$file")
            # Get timestamp
            timestamp=$(get_timestamp)
            # Get filename
            filename=$(basename "$file")
            # Get filepath
            filepath="$file"
            # Store file information in array
            file_info+=("{\"timestamp\": \"$timestamp\", \"name\": \"$(hostname)\", \"md5sum\": \"$md5\", \"filename\": \"$filename\", \"filepath\": \"$filepath\"}, ")
        done < <(find "$folder" -type f -print0)
    else
        echo "Folder $folder does not exist."
    fi
done

file_info+=(']')

# Output file information to JSON file
printf "%s\n" "${file_info[@]}" > "$output_file"

