module.exports = () => {
  const items = [];

  return {addItem, getItems};

  function getItems() { return items; }
  function addItem(item) { items.push(item); }
};