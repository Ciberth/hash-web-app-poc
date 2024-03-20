#!/bin/bash

# TODO if final file in the array does not exist, you don't have valid json


# Array of files to enumerate
files=(
    "/etc/passwd"
    "/etc/hosts"
    "/etc/os-release"
    "/etc/cron.d/anacron"
    "/home/debian/.bashrc"
)

# Output file
output_file="files.json"

# Function to calculate md5sum of a file
calculate_md5sum() {
    md5sum "$1" | awk '{print $1}'
}

# Function to get current timestamp
get_timestamp() {
    date +"%Y-%m-%d %H:%M:%S"
}

# Function to base64 encode file contents
base64_encode_file() {
    base64 -w 0 "$1"
}

# Initialize an empty array for storing file information
file_info=('[')

# Iterate through each file
for ((i = 0; i < ${#files[@]}; i++)); do
    file="${files[$i]}"
    # Check if the file exists
    if [ -f "$file" ]; then
        # Get md5sum hash
        md5=$(calculate_md5sum "$file")
        # Get timestamp
        timestamp=$(get_timestamp)
        # Get filename
        filename=$(basename "$file")
        # Get filepath
        filepath="$file"
        # Get base64 encoded contents
        content=$(base64_encode_file "$file")
        # Add file information to array
        file_info+=("{\"timestamp\": \"$timestamp\", \"name\": \"$(hostname)\", \"md5sum\": \"$md5\", \"filename\": \"$filename\", \"filepath\": \"$filepath\", \"filecontent\": \"$content\"}")
        # Add comma if it's not the last file
        if [ $i -lt $(( ${#files[@]} - 1 )) ]; then
            file_info+=(", ")
        fi
    else
        echo "File $file does not exist."
    fi
done

file_info+=(']')

# Output file information to JSON file
printf "%s\n" "${file_info[@]}" > "$output_file"
