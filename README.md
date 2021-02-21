# Random List Picker

React Native Android application for picking random names from lists.

## Functionality

The app let's you construct lists, which can include names and other lists. Random picking can be done from any list. Randomization settings can be specified on a list by list basis. If a list includes another list and the other list gets picked by randomization, the random picking is also done on the picked list using that list's settings, unless otherwise specified.

Other included features are:

-   Weight lists and items
-   Include/exclude lists and items from randomization
-   Edit lists and items by long pressing
-   Import (JSON/TXT) and export (JSON) lists and items
-	Export (JSON/TXT) randomization results
-	Look at previous randomization results

## Randomization settings

The randomization can be customized using the following settings:

### Number of items to pick

How many items and/or lists are picked from the list.

### Number of items is a recursive limit

Specifies, if the previous limit should apply to sublists also.

### Pick unique names

Prevents picking multiple identical names. Doesn't differentiate between lists and items.

### Pick unique recursively

Specifies, if the previous setting should apply to sublists also. Applies only when pick unique items is also set.

### Combine sublists

When randomizing, items and lists in lists one level down are considered to be part of the current list.

### Combine sublists recursively

When randomizing, items in all sublists are considered to be part of the current list. Applies only when combine sublists is also set.

### Ignore empty lists

Empty lists won't be picked. List with only unactive
items counts as empty.

### Ignore empty lists recursively

Specifies, if the previous setting should apply to sublists also. Applies only when ignore empty lists is also set.

### Ignore weights

Doesn't apply weighting.

### Ignore weights recursively

Specifies, if the previous setting should apply to sublists also. Applies only when ignore weights is also set.

### Deactivate picked items

Deactivates items (not lists) that get random picked.

## Importing and exporting

Imported text files are assumed to include names separated by line breaks. All names from a text file are added as items.

Imported JSON objects have to include a "name" key. If a JSON object also has an "items" key, it will be added as a list. Otherwise the JSON object will be added as an item. An example of a valid JSON with all supported keys included is available below:

```
[{
	"name": "Name of list",
	"active": true,
	"weight": 1,
	"numToPick": 10,
	"numToPickRecursive": false,
	"pickUnique": false,
	"pickUniqueRecursive": false,
	"combineLists": false,
	"combineListsRecursive": false,
	"deactivateAfterRandomization": false,
	"ignoreEmptyLists": true,
	"ignoreEmptyListsRecursive": false,
	"ignoreWeights": false,
	"ignoreWeightsRecursive": false,
	"items": [{
		"name": "Name of sublist",
		"active": true,
		"weight": 1,
		"numToPick": 10,
		"numToPickRecursive": false,
		"pickUnique": false,
		"pickUniqueRecursive": false,
		"combineLists": false,
		"combineListsRecursive": false,
		"deactivateAfterRandomization": false,
		"ignoreEmptyLists": true,
		"ignoreEmptyListsRecursive": true,
		"ignoreWeights": false,
		"ignoreWeightsRecursive": false,
		"items": [{
			"name": "Name of sublist item 1",
			"active": true,
			"weight": 1
		}, {
			"name": "Name of sublist item 2",
			"active": true,
			"weight": 1
		}]
	},
    {
		"name": "Name of list item",
		"active": true,
		"weight": 1
	}]
}]
```

Permissions to read and write to external storage are required on android for importing and exporting to work.

## Development environment

Requires React Native: <https://reactnative.dev/docs/environment-setup>.

1. Clone this repository.
2. In the cloned repository run `npm install`.

Before building a release android app, configure the release key: <https://reactnative.dev/docs/signed-apk-android>.

## Credits

An [icon](https://www.flaticon.com/free-icon/dice_250752) made by [Retinaicons](https://www.flaticon.com/authors/retinaicons) from [Flaticon](https://www.flaticon.com/) is used in the app's icon.

## License

MIT.
