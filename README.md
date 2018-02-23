# streetlights-deploy
Fancy Placement Tool

https://streetlights-deploy.herokuapp.com/

# How-To

Add a streetlight
 - Move the mouse to a position on the map and Left Click.  
 - A marker will be added and the table below will be updated.
 - You cannot add a streetlight that is closer than 6.2 meters to an existing one.
 
Remove a streetlight
 - Hover the mouse over the marker of the streetlight you want to remove.
 - Right Click.
 - This marker will disappear from the map and the database will be updated to remove it.

Edit attributes of a streetlight
 - You can edit the Status and Color of streetlights in the table by using the dropdown lists in their cells
 
Sort the table
 - Sort the table by clicking on the up/down arrows in the header of each column.

# API

The API accepts formatted parameters and returns data in JSON form:

Add a streetlight
 - Target POST "/lights"
 - Parameters: status, color, alias, latitude, longitude
 - Example {"status"=>"None", "color"=>"None", "alias"=>"None", "latitude"=>"37.54329821537339", "longitude"=>"-122.29379641738433"}
 - The server will return the updated index of all lights.
 
Delete a streetlight
 - Target: DELETE "/lights/[light id]"
 - Parameters: id
 - The server will return the updated index of all lights.
 
 
Get index of all streetlights in no particular order
 - Target: GET "/lights"
 - No parameters 
 - The server will return the index of all lights.

Get sorted index of all streetlights
 - Target: GET "/lights"
 - Parameters: sorters => "0" => field => [field to be sorted], dir => [direction to sort, asc or desc]
 - Example: {"sorters"=>{"0"=>{"field"=>"status", "dir"=>"asc"}}}
 - The server will return with a list of all streetlights sorted by the given criteria.

# Known problems and TODOS:

 - Formatting and styling is gross and purely functional - need to make it look a little nicer
 - Need to run through rubocop
 - No tests written
 - Javascript should be rewritten as object-oriented
 - Sorting by "alias" is wonky
 - Not possible to edit the alias, this should be possible through an input window on the table cell.
 - No significant validations
 - No significant feedback in error/failure cases
 - Can't select groups of lights from table - this can be done with some "selected" tick boxes
 - API for sorting could be simpler
 - Sloppy parameter filtering in controller
