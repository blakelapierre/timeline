module.exports = () => {
  const items = [];

  const updateFunctions = {updateGenericItem};

  return {addItem, endItem, getItems, updateItem};

  function addItem(time, data) {
    const item = {time, data};
    items.push(item);
    return item;
  }

  function endItem(item, endTime) {
    item.endTime = endTime || new Date().getTime();
    return item;
  }

  function getItems() { return items; }

  function updateItem(item, data) {
    return updateFunctions[getItemType(item)](item, data);
  }

  function updateGenericItem(item, data) {
    console.log('update', item, data);
    for (let key in data) item.data[key] = data[key];
    return item;
  }

  function getItemType(item) {
    console.log('getting item type', item);
    if (item && item.data && item.data.type === 'generic') return 'updateGenericItem';
    if (item && item.data && item.data.type === 'startup') return 'updateGenericItem';
  }
};