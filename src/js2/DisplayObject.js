export class DisplayObject {
  appendTo(node) {

    node.appendChild(this.node);
    return this;

  };
};
