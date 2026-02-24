export class DisplayObject {
  appendTo(node) {

    node.appendChild(this.node);
    return this;

  };
  setProp(key, value) {
    
    this.node.dataset[key] = value;
    return this;

  };
};
