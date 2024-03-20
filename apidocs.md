# Api documentation
 
## Tables
 
Not normalized:
- linuxdata (all meta information about files)
- linuxfiles (meta information + base64 encoded filecontents)
- windowsdata (all meta information about files)
- windowsfiles (meta information + base64 encoded filecontents)
 
 
### Data Rows:
- id (INTEGER PRIMARY KEY AUTOINCREMENT)
- timestamp (TEXT)
- name (TEXT)
- md5sum (TEXT)
- filename (TEXT)
- filepath (TEXT)
 
### Files Rows:
- id (INTEGER PRIMARY KEY AUTOINCREMENT)
- timestamp (TEXT)
- name (TEXT)
- md5sum (TEXT)
- filename (TEXT)
- filepath (TEXT)
- filecontent (TEXT)
 
 
## Endpoints
 
### POST /lin/data
 
Accepts a JSON blob that inserts into the linux data table
 
Example JSON:
 
Example curl command:
 
 
### POST /lin/file
 
Accepts a JSON blob that inserts into the linux files table
 
Example JSON:
 
Example curl command:
 
### GET /lin/data/
 
Result: all files in linux table

### GET /lin/data/:md5sum
 
Result: all files in linux table that match this md5sum
 
 
### GET /lin/data/:filename
 
Result: all files in linux table that match this filename

 
### GET /lin/data/:filepath
 
Result: all files in linux table that match this filepath