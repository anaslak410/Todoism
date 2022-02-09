# naming convention
## function names
* post* : insert an HTML element(s) in the dom 
* replace* : swap html elements
* create*: return a new object
* del* : remove something
* is* : return a boolean
* get* : return a primitive value
* handle* : handle an event;
## variable names
* \*Elem : all variables that refer tohtml dom elements must have this postfix at their end
* names should be descriptive when their scope is big


# design

## logic
### lists
* lists will have ids that are generated from the number of lists PLUS one. 
* lists will have names and todos inside them as well as their id
* lists will be encapsulated in a class
* lists position will be determined by their position in the lists object
* lists position will have nothing to do with their id
### list replacement
* therea are two instances of list replacement
    * when a newly created list has the same name as an existing list
    * when a an existing list has its name changed to another existing lists name
*  refer to save list uml
### todos
* todos will have names and boolean of wether they are checked or not 
* todos will not have an id, their position is determined depending on where they are in either the html container or the javascript array.
## moving around todos
* when converting them to objects in an array, their position in the array should refelct that of their position in the html container.
* HTML todos will not have ids
### misc
* a loaded list variable whose value is 0 when no list is loaded, otherwise it will be the id of the list
* when the user clicks the plus button to add a new list the loaded list id will turn to the default value

## presentation
* all logical elements that will be converted to presentational elements will have a container exclusive for them
* pres elements that correspond to logical elements will have an id that corresponds to the logical elements id
* everytime a list is changed and saved , the container for lists is re-rendered, so individual list html elements are not modified but rather the whole container is fed with a new javascript object and rerended
### css
* start with shared styles , then move to specific ones.

# questions 
* if their id corresponds to their location, what will you do when that location changes
* what will happen when lists replace other lists
* what happens to todos when they are changes and lsit is saved