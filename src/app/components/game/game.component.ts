import { Component, OnInit } from '@angular/core';
import { checkAndUpdateBinding } from '@angular/core/src/view/util';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  // tslint:disable-next-line:variable-name
  // greyBridges_blue = [];
  // tslint:disable-next-line: variable-name
  // greyBridges_red = [];
  size: number;
  player: number;
  spaceBetween;
  nodeSize;
  bridgeSize;
  blueNodes;
  redNodes;
  blueBridges;
  redBridges;
  redCount;
  blueCount;
  constructor() {

  }

  ngOnInit() {
    // console.log(Math.floor(4 / 6));
    this.size = 5;
    this.nodeSize = 15;
    this.player = 1;
    this.spaceBetween = 19;
    this.redCount = -1;
    this.blueCount = -1;
    this.blueBridges = [];
    this.redBridges = [];
    this.blueNodes = [];
    this.redNodes = [];
    this.fillNodes();
  }
  getIndexes() {
    console.log(this.blueNodes);
  }
  fillNodes() {
    let redIndex = 0;
    let blueIndex = 0;
    for (let i = 0; i < 2 * this.size + 1; i++) {
      for (let j = 0; j < 2 * this.size + 1; j++) {
        if ((i + j) % 2 === 1 && j % 2 === 0 &&  i < 2 * this.size) {
          this.blueNodes.push({
            'id': blueIndex,
            'i': i,
            'j': j
          });
          blueIndex ++;
        }
        if ((i + j) % 2 === 1 && j % 2 === 1 && j < 2 * this.size) {
          this.redNodes.push({
            'id': redIndex,
            'i': i,
            'j': j
          });
          redIndex ++;
        }
      }
    }
  }
  check_if_blue_node(i: number, j: number) {
    if ( this.blueNodes.find(function(element) {
      return element.i === i && element.j === j})) {
        return true;
     } else {
       return false;
     }
  }
  check_if_red_node(i: number, j: number) {
    if ( this.redNodes.find(function(element) {
      return element.i === i && element.j === j})) {
        return true;
     } else {
       return false;
     }
  }
  move(i: number, j: number) {
    if (!this.check_if_blue_node(i, j) && !this.check_if_red_node(i, j)) {
      this.addBridge(i, j, this.player);
      if (this.checkIfPlayerWon(this.player)) {
      console.log('player', this.player, ' won');
    } else {
      this.changePlayer();
      }
    }
  }
  addBridge(i: number, j: number, player) {
    if (this.check_if_blue_bridge(i, j) > 0 || this.check_if_red_bridge(i, j) > 0 ||
     i === 0 || i === this.size * 2 || j === 0 || j === this.size * 2 ) {
      console.log('bridge exsists!');
      return;
    }
    let nodeAbove = this.getUpperNode(i, j, player);
    let nodeLeft = this.getLeftNode(i, j, player);
    console.log("nodeleft:", nodeLeft, "nodeAbove: ", nodeAbove);
    if ( this.player === 1 ) {
      console.log('i: ', i, 'j:', j);
      // console.log(this.blueNodes.find(function(element) {
      //   return element.i === i && element.j === j - 1 }))

      console.log(nodeLeft);
      //navpicno
      if (nodeAbove && j !== 0 && j !== this.size * 2) {
        console.log("navpicno");
        this.blueBridges.push({i: i, j: j, node1: this.getNodeId(i, j - 1), node2: this.getNodeId(i, j + 1), direction: 'vertical'});
        // vorodavno
      } else {
          console.log("vodoravno");
          this.blueBridges.push({i: i, j: j, node1: nodeLeft.id, node2: (nodeLeft.id + 1), direction: 'horizontal' });
      }
    } else {
      // navpicno
      if( nodeAbove) {
        this.redBridges.push({i: i, j: j, node1: this.getNodeId(i - 1, j), node2: this.getNodeId(i + 1, j), direction: 'vertical'});
      } else {
          this.redBridges.push({i: i, j: j, node1: nodeLeft.id, node2: (nodeLeft.id + 1), direction: 'horizontal' });
      }
    }
  }
  check_if_blue_bridge(i: number, j: number) {
    // check if bridge exsists in array 
    let bridge = this.blueBridges.find( function (element) {
      return element.i === i && element.j === j});
    if(!bridge) {
      return 0;
    }
    if ( bridge.direction == 'vertical' ) {
        return 1;
     } else {
       return 2;
     }
  }
  check_if_red_bridge(i: number, j: number) {
    // check if bridge exsists in array
    if ( this.redBridges.find(function(element) {
      return element.i === i && element.j === j})) {
        return 1;
     } else {
       return 0;
     }
  }
  getLeftNode(i: number, j: number, player) {
    if(player === 1) {
    return this.blueNodes.find(function(element) {
      return element.i === i && element.j === j - 1});
    } else {
      return this.redNodes.find(function(element) {
       return element.i === i && element.j === j - 1});
    }
  }
  getUpperNode(i: number, j: number, player) {
    if (this.player === 1) {
      return this.blueNodes.find(function(element) {
        return element.i === i - 1 && element.j === j});
    } else {
      return this.redNodes.find(function(element) {
        return element.i === i - 1 && element.j === j});
    }
  }
  getNodeId(i: number, j: number) {
    let node = this.blueNodes.find(function(element) {
      return element.i === i && element.j === j});
      console.log(node.id);
  }
  checkIfPlayerWon(player: number) {
    return false;
    if (player === 1) {
      // if()
    } else {

    }
  }
  changePlayer() {
    if (this.player === 1) {
      this.player = 2;
    } else {
      this.player = 1;
    }
    console.log("player", this.player, "'s move");
  }
  set_bridge(i: number, j: number) {
    console.log(i, j);
    // if (this.player === 1) {
    //   this.blueBridges.push({
    //     node1:
    //   })
    // }
  }
  calculateId(i: number, j: number) {

  }

  // createBoard() {
    //blue Nodes
    // for (let i = 0; i < this.size * (this.size + 1); i++) {
    //   this.blueNodes.push(this.addBlueNode(i));
    //   this.redNodes.push(this.addRedNode(i));
    // }
    // this.createGreyBridges();
  // }
  // draw() {
  //   console.log(this.blueNodes);
  //   this.greyBridges_blue.forEach(bridge => {
  //     this.drawBridge('blue', this.blueNodes[bridge.node1], this.blueNodes[bridge.node2]);
  //   });
  //   this.greyBridges_red.forEach(bridge => {
  //     this.drawBridge('red', this.redNodes[bridge.node1], this.redNodes[bridge.node2]);
  //   });
  // }

//   addRedNode(index: number) {
//     const node = {
//       id: index,
//       x: 199 + index % this.size * this.spaceBetween,
//       y: 130 + Math.floor(index / this.size) * this.spaceBetween
//     };
//     return node;
//   }
//   addBlueNode(index: number) {
//     const node = {
//       id: index,
//       x: 150 + index % (this.size + 1) * this.spaceBetween,
//       y: 180 + Math.floor(index / (this.size + 1)) * this.spaceBetween
//     };
//     return node;
//   }
//   createGreyBridges() {
//     this.blueNodes.forEach(node => {
//       if ((node.id % (this.size + 1)) !== this.size) { // horizontal
//         this.greyBridges_blue.push({ node1: node.id, node2: node.id + 1 });
//       }
//       if (node.id % (this.size + 1) !== 0 && node.id % (this.size + 1) !== this.size &&
//         node.id < ((this.size - 1) * (this.size + 1)) - 1) { // vertical
//         this.greyBridges_blue.push({ node1: node.id, node2: node.id + this.size + 1 });
//       }
//     });
//     this.redNodes.forEach(node => {
//       if (node.id % this.size !== this.size - 1 && node.id > this.size - 1 &&
//         node.id < (this.size * this.size + 1) - 1) { // horizontal
//         this.greyBridges_red.push({ node1: node.id, node2: node.id + 1 });
//       }
//       if (node.id <= (this.size * this.size) - 1) { // vertical
//         this.greyBridges_red.push({ node1: node.id, node2: node.id + (this.size - 1) + 1 });
//       }
//     });
//     console.log("bridges created");
//   }
//   drawBridge(color: string, node1, node2) {

//   }
}
