# sysrepo-viewer

Simple React App for viewing tree structured sysrepo data.

## Screenshot

![Page example](/screenshots/page-example.png)

## Usage
Use **Sysrepo options** container to define the path needed and the datastore to use and once defined click **Get data** button. The JSON Viewer container should be filled with the data specified or the error info will be provided.

Once the data is loaded, you can `edit / add / delete` data from the JSON viewer and in that way monitor your plugin / program using sysrepo and see when changes are recieved. For every `edit / add / delete` action, info will be provided if the action succeeded or if an error has occured.