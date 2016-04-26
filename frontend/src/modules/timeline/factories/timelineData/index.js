const types = {
  generic,
  marker
};

module.exports = () => {
  const items = [],
        cursors = [];

  for (let name in types) types[name] = types[name]();

  return {addItem, endItem, getItems, getItemsCursor, newItem, updateItem};

  function getItems() { return items; }

  function getItemsWhere(filter) {
    return getWhere(items, filter);
  }

  function getWhere(items, filter, matched = []) {
    items.forEach(item => {
      if (filter(item)) matched.push(item);
    });
    return matched;
  }

  function getItemsCursor(config) {
    const filter = cursorFilter(config),
          cursor = getItemsWhere(filter);

    cursors.push({config, items: cursor, filter});

    return cursor;
  }

  function cursorFilter(config) {
    return item => {
      console.log('filter', {item, config});
      if (item.duration && config.startTime && item.duration.endTime < config.startTime.getTime()) return false;
      if (item.event && config.endTime && item.event.time > config.endTime.getTime()) return false;
      return true;
    };
  }

  function addItem(time, data) {
    return newItem('generic', {time, data});
  }

  function newItem(type, data) {
    const item = types[type].create(data);
    items.push(item);

    updateCursors(item);

    console.log(items);
    return item;

    function updateCursors(item) {
      cursors.forEach(({config, items, filter}) => {
        if (filter(item)) items.push(item);
      });
      console.log('updated', {cursors});
    }
  }

  function endItem(item, endTime) {
    item.duration.endTime = endTime || new Date().getTime();
    return item;
  }

  function updateItem(item, data) {
    return types[item.type].update(item, data);
  }
};

// const genericTypes = hasTypes({event, data, duration});

// class generic {
//   static get type() { return 'generic'; }
//   static get types() { return genericTypes; }

//   constructor(data) {
//     this.update(data);
//   }

//   update(data) {

//   }
// }

function hasTypes(constructors) {
  const types = {};
  for (let name in constructors) types[name] = constructors[name]();
  return types;
}

// function generic() {
//   const types = hasTypes({event, data, duration});

//   console.log(types);

//   return {create, update};

//   function create(data) {
//     const g = createFromTypes(types);
//     g.type = 'generic';
//     console.log('Created', g);
//     return g;
//   }

//   function update(generic, data) {
//     for (let key in data) generic[key] = data[key];
//     return generic;
//   }
// }

function generic() {
  return buildType('generic', {event, data, duration});
}

function buildType(name, components) {
  const types = hasTypes(components);

  return {create, update};

  function create(data) {
    const obj = createFromTypes(types, data);
    obj.type = name;
    console.log('Created', obj);
    return obj;
  }

  function update(obj, data) {
    console.log('update', name);
    // for (let key in data) obj[key] = types[key].update(obj[key], data[key]);
    // for (let key in data) obj[key] = types[key].update(data[key]);
    for (let key in data) types[key].update(obj[key], data[key]);
  }
}

function createFromTypes(types, data) {
  const obj = {};
  for (let name in types) obj[name] = types[name].create(data ? data[name] : undefined);
  return obj;
}

function marker() {
  const types = {event, data};

  for (let name in types) types[name] = types[name]();

  return {create, update};

  function create(data) {
    const m = {type: 'marker'};
    for (let name in types) m[name] = types[name].create(data[name]);
      console.log('Created', m);
    return m;
  }

  function update(marker) {
    return marker;
  }
}

function event() {
  return {create, update};

  function create(time = new Date().getTime()) {
    return {time};
  }

  function update(event, data) {
    console.log('update event', event, data);
  }
}

function data() {
  return {create, update};

  function create(data = {}) {
    return data;
  }

  function update(data, d) {
    console.log('update data', data, d);
    for (let key in d) data[key] = d[key];
  }
}

function duration() {
  return {create, update};

  function create(endTime) {
    return {endTime, getDuration};
  }

  function getDuration(item, endTime) { // probably don't want endTime here
    return (item.duration.endTime || endTime) - item.event.time;
    // return item.duration.endTime ? item.duration.endTime - item.event.time : undefined;
  }

  function update(duration, data) {
    duration.endTime = data.endTime;
  }
}

// function event(time = new Date()) {

// }