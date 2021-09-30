import {weightedRandom} from '../randomizer/weightedRandom';

export class ItemList {
    constructor(
        id,
        name,
        {
            active = true,
            weight = 1,
            numToPick = 10,
            numToPickRecursive = false,
            pickUnique = true,
            pickUniqueRecursive = false,
            combineLists = false,
            combineListsRecursive = false,
            deactivateAfterRandomization = false,
            ignoreEmptyLists = true,
            ignoreEmptyListsRecursive = false,
            ignoreWeights = false,
            ignoreWeightsRecursive = false,
            items = [],
            idPath = [],
        } = {},
    ) {
        this.id = id;
        this.name = name;
        this.active = active;
        this.weight = weight;
        this.numToPick = numToPick;
        this.numToPickRecursive = numToPickRecursive;
        this.pickUnique = pickUnique;
        this.pickUniqueRecursive = pickUniqueRecursive;
        this.combineLists = combineLists;
        this.combineListsRecursive = combineListsRecursive;
        this.deactivateAfterRandomization = deactivateAfterRandomization;
        this.ignoreEmptyLists = ignoreEmptyLists;
        this.ignoreEmptyListsRecursive = ignoreEmptyListsRecursive;
        this.ignoreWeights = ignoreWeights;
        this.ignoreWeightsRecursive = ignoreWeightsRecursive;
        this.idPath = idPath;

        this.properties = [
            'name',
            'active',
            'weight',
            'numToPick',
            'numToPickRecursive',
            'pickUnique',
            'pickUniqueRecursive',
            'combineLists',
            'combineListsRecursive',
            'deactivateAfterRandomization',
            'deactivateAfterRandomizationRecursive',
            'ignoreEmptyLists',
            'ignoreEmptyListsRecursive',
            'ignoreWeights',
            'ignoreWeightsRecursive',
        ];

        this.items = [];
        this.nextId = 0;
        this.addItems(items);
    }

    addItem(name, {id = this.nextId, active = true, weight = 1} = {}) {
        this.items.push({
            id: id,
            name: name,
            active: active,
            weight: weight,
            idPath: this.idPath.concat([this.id]),
        });
        if (this.nextId < id) {
            this.nextId = id + 1;
        } else {
            ++this.nextId;
        }
    }

    addList(
        name,
        {
            id = this.nextId,
            active = undefined,
            weight = undefined,
            items = undefined,
            numToPick = undefined,
            numToPickRecursive = undefined,
            pickUnique = undefined,
            pickUniqueRecursive = undefined,
            combineLists = undefined,
            combineListsRecursive = undefined,
            deactivateAfterRandomization = undefined,
            ignoreEmptyLists = undefined,
            ignoreEmptyListsRecursive = undefined,
            ignoreWeights = undefined,
            ignoreWeightsRecursive = undefined,
        } = {},
    ) {
        this.items.push(
            new ItemList(id, name, {
                active: active,
                weight: weight,
                items: items,
                numToPick: numToPick,
                numToPickRecursive: numToPickRecursive,
                pickUnique: pickUnique,
                pickUniqueRecursive: pickUniqueRecursive,
                combineLists: combineLists,
                combineListsRecursive: combineListsRecursive,
                deactivateAfterRandomization: deactivateAfterRandomization,
                ignoreEmptyLists: ignoreEmptyLists,
                ignoreEmptyListsRecursive: ignoreEmptyListsRecursive,
                ignoreWeights: ignoreWeights,
                ignoreWeightsRecursive: ignoreWeightsRecursive,
                idPath: this.idPath.concat([this.id]),
            }),
        );
        if (this.nextId < id) {
            this.nextId = ++id;
        } else {
            ++this.nextId;
        }
    }

    addItems(items) {
        for (let item of items) {
            if (item.hasOwnProperty('items')) {
                let params = {items: item.items};

                for (let prop of this.properties) {
                    if (item.hasOwnProperty(prop)) {
                        params[prop] = item[prop];
                    }
                }

                this.addList(item.name, params);
            } else {
                this.addItem(item.name, {
                    active: item.hasOwnProperty('active')
                        ? item.active
                        : undefined,
                    weight: item.hasOwnProperty('weight')
                        ? item.weight
                        : undefined,
                });
            }
        }
    }

    getItem(id) {
        if (Array.isArray(id)) {
            if (id.length < 1) {
                return this;
            }
            let item = this.getItem(id[0]);
            for (let i = 1; i < id.length; i++) {
                item = item.getItem(id[i]);
            }
            return item;
        }
        return this.items.find(item => item.id === id);
    }

    deleteItem(id) {
        let deleted;

        if (Array.isArray(id)) {
            if (id.length < 1) {
                return undefined;
            }
            if (id.length > 1) {
                let item = this.getItem(id[0]);
                for (let i = 1; i < id.length - 1; i++) {
                    item = item.getItem(id[i]);
                }
                return item.items.splice(
                    item.items.findIndex(
                        i => i.id === item.getItem(id[id.length - 1]).id,
                    ),
                    1,
                );
            } else {
                id = id[0];
            }
        }

        deleted = this.items.splice(
            this.items.findIndex(i => i.id === this.getItem(id).id),
            1,
        );

        return deleted[0];
    }

    renameItem(newName, id) {
        let item = this.getItem(id);
        let oldName = item.name;
        item.name = newName;
        return oldName;
    }

    setPropertyForAll(property, value, recursive) {
        for (let item of this.items) {
            item[property] = value;
            if (recursive && item instanceof ItemList) {
                item.setPropertyForAll(property, value, recursive);
            }
        }
    }

    checkIfActiveItems(exclude = []) {
        let lists = this.items.filter(item => item instanceof ItemList);
        let items = this.items.filter(item => !(item instanceof ItemList));
        for (let item of items) {
            if (item.active && !exclude.includes(item.name)) {
                return true;
            }
        }
        for (let list of lists) {
            if (list.checkIfActiveItems(exclude)) {
                return true;
            }
        }
        return false;
    }

    pickRandomItems({
        maxToPick = this.numToPick,
        numToPickRecursive = this.numToPickRecursive,
        exclude = [],
        pickUniqueRecursive = this.pickUniqueRecursive && this.pickUnique,
        ignoreEmptyListsRecursive = this.ignoreEmptyListsRecursive &&
            this.ignoreEmptyLists,
        ignoreWeightsRecursive = this.ignoreWeights &&
            this.ignoreWeightsRecursive,
    } = {}) {
        // Don't pick more than max number of items
        let numToPick = this.numToPick;
        if (numToPick > maxToPick) {
            numToPick = maxToPick;
        }

        if (numToPick < 1) {
            return [];
        }

        let items = [...this.items];

        // Consider sublists as one big list if combine lists is true
        if (this.combineLists) {
            if (this.combineListsRecursive) {
                while (
                    items.find(
                        item => item.hasOwnProperty('items') && item.active,
                    )
                ) {
                    let sublistItems = [];

                    for (let item of items.filter(
                        i => i.hasOwnProperty('items') && i.active,
                    )) {
                        sublistItems = sublistItems.concat(item.items);
                    }

                    items = items.filter(item => !item.hasOwnProperty('items'));
                    items = items.concat(sublistItems);
                }
            } else {
                let sublistItems = [];

                for (let item of items.filter(
                    i => i.hasOwnProperty('items') && i.active,
                )) {
                    sublistItems = sublistItems.concat(item.items);
                }

                items = items.filter(item => !item.hasOwnProperty('items'));
                items = items.concat(sublistItems);
            }
        }

        // Don't pick inactive items
        items = items.filter(item => item.active);

        // Don't pick excluded items
        items = items.filter(item => !exclude.includes(item.name));

        let picked = [];

        let exc = [].concat(exclude);

        for (let i = 0; i < numToPick && items.length > 0; i++) {
            let randomItem;
            if (this.ignoreWeights || ignoreWeightsRecursive) {
                randomItem = items[Math.floor(Math.random() * items.length)];
            } else {
                randomItem = weightedRandom(items);
            }

            if (randomItem) {
                if (
                    (this.ignoreEmptyLists || ignoreEmptyListsRecursive) &&
                    randomItem instanceof ItemList &&
                    !randomItem.checkIfActiveItems(exc)
                ) {
                    items.splice(items.findIndex(item => item === randomItem));
                    --i;
                } else {
                    picked.push(randomItem);
                }

                if (this.pickUnique || pickUniqueRecursive) {
                    // Filter out items with the same name as the picked item if pickUnique is set
                    items = items.filter(
                        item => !(item.name === randomItem.name),
                    );

                    // Add picked items to exclude list
                    if (
                        pickUniqueRecursive &&
                        !(randomItem instanceof ItemList)
                    ) {
                        exc.push(randomItem.name);
                    }
                }
            }
        }

        let listsList = picked.filter(item => item instanceof ItemList);
        let itemsList = picked.filter(item => !(item instanceof ItemList));

        let max;
        if (numToPickRecursive || this.numToPickRecursive) {
            max = maxToPick - itemsList.length;
        }

        // Recursively randomly pick items from sublists
        for (let list of listsList) {
            let sublistItems = list.pickRandomItems({
                maxToPick: max,
                numToPickRecursive: numToPickRecursive,
                exclude:
                    pickUniqueRecursive ||
                    (this.pickUniqueRecursive && this.pickUnique)
                        ? exc
                        : undefined,
                pickUniqueRecursive: pickUniqueRecursive
                    ? pickUniqueRecursive
                    : undefined,
                ignoreEmptyListsRecursive: ignoreEmptyListsRecursive
                    ? ignoreEmptyListsRecursive
                    : undefined,
                ignoreWeightsRecursive: ignoreWeightsRecursive
                    ? ignoreWeightsRecursive
                    : undefined,
            });

            itemsList = itemsList.concat(sublistItems);

            if (pickUniqueRecursive) {
                exc = exc.concat(sublistItems.map(item => item.name));
            }
            if (max) {
                max = max - sublistItems.length;
            }
        }

        return itemsList;
    }

    countItems(active, recursive) {
        let lists = this.items.filter(item => item instanceof ItemList);
        let items = this.items.filter(item => !(item instanceof ItemList));
        if (active) {
            lists = lists.filter(item => item.active);
            items = items.filter(item => item.active);
        }

        let count = items.length;
        if (recursive) {
            for (let list of lists) {
                count += list.countItems(active, true);
            }
        } else {
            count += lists.length;
        }

        return count;
    }

    countWeight(recursive = false) {
        let items = this.items;
        let count = 0;

        if (recursive) {
            items = this.items.filter(item => !(item instanceof ItemList));
            let lists = this.items.filter(item => item instanceof ItemList);
            for (let list of lists) {
                count += list.countWeight(true);
            }
        }

        if (items.length) {
            count += items.reduce(
                (accumulator, currentValue) =>
                    accumulator + currentValue.weight,
                count,
            );
        }

        return count;
    }

    validateJson(json) {
        let properties = {
            name: value => {
                return checkType(value, 'string');
            },
            active: value => {
                return checkType(value, 'boolean');
            },
            weight: value => {
                return checkType(value, 'number');
            },
            items: value => {
                return Array.isArray(value);
            },
            numToPick: value => {
                return Number.isInteger(value);
            },
            numToPickRecursive: value => {
                return checkType(value, 'boolean');
            },
            pickUnique: value => {
                return checkType(value, 'boolean');
            },
            pickUniqueRecursive: value => {
                return checkType(value, 'boolean');
            },
            combineLists: value => {
                return checkType(value, 'boolean');
            },
            combineListsRecursive: value => {
                return checkType(value, 'boolean');
            },
            deactivateAfterRandomization: value => {
                return checkType(value, 'boolean');
            },
            ignoreEmptyLists: value => {
                return checkType(value, 'boolean');
            },
            ignoreEmptyListsRecursive: value => {
                return checkType(value, 'boolean');
            },
            ignoreWeights: value => {
                return checkType(value, 'boolean');
            },
            ignoreWeightsRecursive: value => {
                return checkType(value, 'boolean');
            },
        };
        if (Array.isArray(json)) {
            for (let i of json) {
                if (!this.validateJson(i)) {
                    return false;
                }
            }
        } else {
            if (!json.hasOwnProperty('name')) {
                return false;
            }
            for (let prop in properties) {
                if (
                    json.hasOwnProperty(prop) &&
                    !properties[prop](json[prop])
                ) {
                    return false;
                }
            }
        }
        return true;
    }

    exportJson({ids = []} = {}) {
        let items = this.items;
        if (ids.length > 0) {
            items = this.items.filter(item => ids.includes(item.id));
        }

        let itemsJson = [];

        for (let item of items) {
            if (item instanceof ItemList) {
                itemsJson.push(item.exportJson());
            } else {
                itemsJson.push({
                    name: item.name,
                    active: item.active,
                    weight: item.weight,
                });
            }
        }

        let list = {};
        for (let prop of this.properties) {
            list[prop] = this[prop];
        }
        list.items = itemsJson;

        return list;
    }
}

function checkType(varToCheck, type) {
    return typeof varToCheck === type;
}
