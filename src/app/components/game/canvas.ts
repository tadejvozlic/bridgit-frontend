import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  redNodes = [];
  blueNodes = [];
  // tslint:disable-next-line:variable-name
  greyBridges_blue = [];
  // tslint:disable-next-line: variable-name
  greyBridges_red = [];
  size: number;
  player: number;
  spaceBetween;
  nodeSize;
  bridgeSize;
  canvas;
  ctx;

  constructor() {

  }

  ngOnInit() {
    console.log(Math.floor(4 / 6))
    this.size = 5;
    this.nodeSize = 15;
    this.player = 1;
    this.spaceBetween = 100;
    this.canvas = document.getElementById('board');
    this.ctx = this.canvas.getContext('2d');
    // this.canvas.width = this.canvas.height *
    // (this.canvas.clientWidth / this.canvas.clientHeight);
    this.createBoard();
    this.draw();

    this.canvas.onmousemove = function(e) {
      console.log('moving', e);
      var canvas = e.target;
      // important: correct mouse position:
      var rect = this.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top,
        i = 0, r;
      while (r = canvas.greyBridges_blue[i++]) {
        console.log('hover');
        this.ctx.beginPath();
        this.ctx.rect(r.x, r.y, r.w, r.h);
        this.ctx.fillStyle = this.ctx.isPointInPath(x, y) ? 'blue' : 'white';
        this.ctx.fill();
      }
    };
  }


createBoard() {
  //blue Nodes
  for (let i = 0; i < this.size * (this.size + 1); i++) {
    this.blueNodes.push(this.addBlueNode(i));
    this.redNodes.push(this.addRedNode(i));
  }
  this.createGreyBridges();
}
draw() {
  console.log(this.blueNodes);
  this.greyBridges_blue.forEach(bridge => {
    this.drawBridge('blue', this.blueNodes[bridge.node1], this.blueNodes[bridge.node2]);
  });
  this.greyBridges_red.forEach(bridge => {
    this.drawBridge('red', this.redNodes[bridge.node1], this.redNodes[bridge.node2]);
  });
  this.blueNodes.forEach(node => {
    console.log(node.x, node.y);
    this.ctx.beginPath();
    this.ctx.arc(node.x, node.y, this.nodeSize, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'blue';
    this.ctx.fill();
    // this.ctx.fillStyle = 'white';
    // this.ctx.font = '15px Arial';
    // this.ctx.fillText(node.id, node.x, node.y);
  });
  this.redNodes.forEach(node => {
    this.ctx.beginPath();
    this.ctx.arc(node.x, node.y, this.nodeSize, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'red';
    this.ctx.fill();
  });
}
addRedNode(index: number) {
  const node = {
    id: index,
    x: 199 + index % this.size * this.spaceBetween,
    y: 130 + Math.floor(index / this.size) * this.spaceBetween
  };
  return node;
}
addBlueNode(index: number) {
  const node = {
    id: index,
    x: 150 + index % (this.size + 1) * this.spaceBetween,
    y: 180 + Math.floor(index / (this.size + 1)) * this.spaceBetween
  };
  return node;
}
createGreyBridges() {
  this.blueNodes.forEach(node => {
    if ((node.id % (this.size + 1)) !== this.size) { // horizontal
      this.greyBridges_blue.push({ node1: node.id, node2: node.id + 1 });
    }
    if (node.id % (this.size + 1) !== 0 && node.id % (this.size + 1) !== this.size &&
      node.id < ((this.size - 1) * (this.size + 1)) - 1) { // vertical
      this.greyBridges_blue.push({ node1: node.id, node2: node.id + this.size + 1 });
    }
  });
  this.redNodes.forEach(node => {
    if (node.id % this.size !== this.size - 1 && node.id > this.size - 1 &&
      node.id < (this.size * this.size + 1) - 1) { // horizontal
      this.greyBridges_red.push({ node1: node.id, node2: node.id + 1 });
    }
    if (node.id <= (this.size * this.size) - 1) { // vertical
      this.greyBridges_red.push({ node1: node.id, node2: node.id + (this.size - 1) + 1 });
    }
  });
  console.log("bridges created");
}
drawBridge(color: string, node1, node2) {
  this.ctx.beginPath();
  //navpicno
  if (node1.x === node2.x) {
    this.ctx.rect(node1.x - Math.floor(this.nodeSize / 4), node1.y + Math.floor(this.nodeSize / 2),
      this.nodeSize / 2, Math.abs(Math.floor(node2.y - node1.y)));
  } else { //vodoravno
    console.log('else');
    this.ctx.rect(node1.x, node1.y - Math.floor(this.nodeSize / 4),
      Math.abs(node2.x - node1.x), this.nodeSize / 2);
  }
  this.ctx.fillStyle = color;
  this.ctx.fill();
  console.log("bridges drawn");
}
}
