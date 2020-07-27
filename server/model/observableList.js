module.exports = class ObservableList {
  constructor(observer) {
    this.data = [];
    // this.observer = observer;

    return new Proxy(this, {
      set(target, name, value) {
        const reflection = Reflect.set(target, name, value);
        observer(target.data);
        return reflection;
      },
    });
  }

  set(items) {
    this.data = items;
  }

  addItems(items) {
    this.data = [...this.data, ...items];
  }
};
