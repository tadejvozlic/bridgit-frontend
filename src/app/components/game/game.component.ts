import { BoardService } from './../../services/board.service';
import { Router } from '@angular/router';
import { HttpService } from './../../services/http.service';
import { Component, OnInit } from '@angular/core';

declare const Pusher: any;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  gameUrl = 'http://localhost:4200/play/';
  url = 'http://localhost:3000/api';
  size: number;
  player: number;
  startingPlayer: number;
  spaceBetween;
  nodeSize;
  bridgeSize;
  blueNodes;
  redNodes;
  blueBridges;
  redBridges;
  redCount;
  blueCount;
  blueEndPointsIds;
  redEndPointsIds;
  moves;
  count;
  full: boolean;
  pusherChannel: any;
  canPlay: boolean = false;
  players: number = 0;
  gameId: string;
  test;

  constructor(
    private httpService: HttpService,
    private boardService: BoardService,
    private router: Router
  ) {

  }

  ngOnInit() {
    // console.log(Math.floor(4 / 6));
    this.moves = [];
    this.count = 0;
    // this.setVictoryScreen(1);
    this.size = 5;
    this.nodeSize = 15;
    this.spaceBetween = 19;
    this.redCount = -1;
    this.blueCount = -1;
    this.blueBridges = [];
    this.redBridges = [];
    this.blueNodes = [];
    this.redNodes = [];
    this.blueEndPointsIds = [];
    this.redEndPointsIds = [];
    this.fillNodes();
    // this.setStasrtingPlayer();
    this.initPusher();
    this.listenForChanges();
  }
  initPusher() {
    // findOrCreate unique channel ID
    let id = this.getQueryParam('id');
    console.log(id);
    if (!id) {
      id = this.getUniqueId();
      location.search = location.search ? '&id=' + id : 'id=' + id;
    }
    console.log(location.search);
    this.gameId = id;
    // init pusher
    const pusher = new Pusher('da78def8fbbc41b098fd', {
      authEndpoint: 'http://localhost:3000/pusher/auth',
      cluster: 'eu'
    });
    // bind to relevant channels
    console.log(id);
    this.pusherChannel = pusher.subscribe(this.gameId);
    console.log(this.pusherChannel);
    this.pusherChannel.bind('pusher:member_added', member => { this.players++ })

    this.pusherChannel.bind('pusher:subscription_succeeded', members => {
      this.players = members.count;
      this.test = members;
      this.setPlayer(this.players);
      console.log("connected! number of players:", this.players);
      // this.toastr.success("Success", 'Connected!');
    });
    this.pusherChannel.bind('', member => { this.players--; });
    // return this;
  }

  listenForChanges() {
    this.pusherChannel.bind('client-move', (obj) => {
      console.log(obj);
      this.player === 1 ? this.redBridges = obj : this.blueBridges = obj;
      this.player === 1 ? this.checkIfPlayerWon(2) : this.checkIfPlayerWon(1);
      // this.bridge
      // this.move(obj)
      this.canPlay = !this.canPlay;
      // this.boards[obj.boardId] = obj.board;
      // this.boards[obj.player].player.score = obj.score;
    });
    console.log("listening for changes");
  }
  setPlayer(players:number = 0) {
    this.player = players;
    if (players === 1) {
      this.canPlay = true;
    } else if (players === 2) {
      this.canPlay = false;
    }
    console.info('PLAYER: ', this.player);
    // alert('player:' + this.player + 'starts!');
  }
  fillNodes() {
    this.boardService.createBoard();
    let redIndex = 0;
    let blueIndex = 0;
    for (let i = 0; i < 2 * this.size + 1; i++) {
      for (let j = 0; j < 2 * this.size + 1; j++) {
        if ((i + j) % 2 === 1 && j % 2 === 0 &&  i < 2 * this.size) {
          // filling blue nodes
          this.blueNodes.push({
            'id': blueIndex,
            'i': i,
            'j': j
          });
          if (j === 0 || j === 10) {
            this.blueEndPointsIds.push(blueIndex);
          }
          blueIndex ++;
        }
        if ((i + j) % 2 === 1 && j % 2 === 1 && j < 2 * this.size) {
          // filling red nodes
          this.redNodes.push({
            'id': redIndex,
            'i': i,
            'j': j
          });
          if (i === 0 || i === 10) {
            this.redEndPointsIds.push(redIndex);
          }
          redIndex ++;
        }
      }
    }
    // console.log("endpoints IDS:", this.blueEndPointsIds);
  }
  getQueryParam(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  getUniqueId () {
    return 'presence-' + Math.random().toString(36).substr(2, 8);
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
    // console.info('1');
    if (this.canPlay) {
      if (!this.check_if_blue_node(i, j) && !this.check_if_red_node(i, j)) {
        this.addBridge(i, j, this.player);
        this.checkIfPlayerWon(this.player) ;
          // console.log('MOVE player won');
        
      }
      this.pusherChannel.trigger('client-move',
      this.player === 1 ? this.blueBridges : this.redBridges );
      
    }
    
      this.changePlayer();
    
  }
  addBridge(i: number, j: number, player) {
    if (this.check_if_blue_bridge(i, j) > 0 || this.check_if_red_bridge(i, j) > 0 ||
     i === 0 || i === this.size * 2 || j === 0 || j === this.size * 2 ) {
      // console.log('bridge exsists!');
      return;
    }
    let nodeAbove = this.getUpperNode(i, j, player);
    let nodeLeft = this.getLeftNode(i, j, player);
    // console.log("left:", nodeLeft, "above:", nodeAbove)
    let node1;
    let node2;
    if ( this.player === 1 ) {
      // // console.log(this.blueNodes.find(function(element) {
      //   return element.i === i && element.j === j - 1 }))
      //navpicno
      if (nodeAbove && j !== 0 && j !== this.size * 2) {
        node1 = this.getNodeId(i, j - 1);
        node2 = this.getNodeId(i, j + 1);
        // console.log("navpicno", node1, node2);
        this.blueBridges.push({i: i, j: j, node1: this.getNodeId(i, j - 1), node2: this.getNodeId(i, j + 1), direction: 'vertical'});
        // vorodavno
      } else {
        node1 = nodeLeft.id;
        node2 = (nodeLeft.id + 6);
        // console.log("vodoravno", node1, node2);
          this.blueBridges.push({i: i, j: j, node1: nodeLeft.id, node2: (nodeLeft.id + 6), direction: 'horizontal' });
      }
    } else {
      // navpicno
      if ( nodeAbove) {
        node1 = this.getNodeId(i - 1, j);
        node2 = this.getNodeId(i + 1, j);
        this.redBridges.push({i: i, j: j, node1: this.getNodeId(i - 1, j), node2: this.getNodeId(i + 1, j), direction: 'vertical'});
      } else {
        node1 = nodeLeft.id;
        node2 = (nodeLeft.id + 1);
        this.redBridges.push({i: i, j: j, node1: nodeLeft.id, node2: (nodeLeft.id + 1), direction: 'horizontal' });
      }
    }
    // console.log("moves", node1, node2);
    this.moves.push({player: this.player, node1: node1, node2: node2});
    // console.log(this.moves);
    // console.info('2');
    console.log("bluebridges:", this.blueBridges);
    console.log("redbridges:", this.redBridges);

  }
  check_if_blue_bridge(i: number, j: number) {
    // check if bridge exsists in array
    let bridge = this.blueBridges.find( function (element) {
      return element.i === i && element.j === j});
    if(!bridge) {
      return 0;
    }
    if ( bridge.direction === 'vertical' ) {
        return 1;
     } else {
       return 2;
     }
  }
  check_if_red_bridge(i: number, j: number) {
    // check if bridge exsists in array
    let bridge = this.redBridges.find( function (element) {
      return element.i === i && element.j === j});
    if (!bridge) {
      return 0;
    }
    if ( bridge.direction === 'vertical' ) {
      return 1;
     } else {
       return 2;
     }
  }
  getLeftNode(i: number, j: number, player) {
    if (player === 1) {
    return this.blueNodes.find(function(element) {
      return element.i === i - 1 && element.j === j;});
    } else {
      return this.redNodes.find(function(element) {
       return element.i === i - 1 && element.j === j;});
    }
  }
  getUpperNode(i: number, j: number, player) {
    if (this.player === 1) {
      return this.blueNodes.find(function(element) {
        return element.i === i && element.j === j - 1;});
    } else {
      return this.redNodes.find(function(element) {
        return element.i === i && element.j === j - 1;});
    }
  }
  getNodeId(i: number, j: number) {
    let node = this.blueNodes.find(function(element) {
      return element.i === i && element.j === j});
      return node.id;
  }
  checkIfPlayerWon(player: number) {
    if (player === 1) {
      this.blueBridges.forEach(bridge => {
        if (this.blueEndPointsIds.includes(bridge.node1)) {
          if (this.checkEndPointConnections(bridge.node1, player)) {
            this.setVictoryScreen(player);
            return true;
          }
        }
      });
      // console.log('didnt win');
      return false;
    } else {
      this.redBridges.forEach(bridge => {
        if (this.redEndPointsIds.includes(bridge.node1)) {
          if (this.checkEndPointConnections(bridge.node1, player)) {
            this.setVictoryScreen(player);
            return true;
          }
        }
      });
      return false;
    }
  }
  checkEndPointConnections(node1_id, player: number) {
    // console.log('checking endpoints', node1_id, player);
    if (node1_id === undefined) {
      // console.log('false');
      return false;
    }
    // blue bridges
    if (player === 1 ) {
      let bridges = this.blueBridges.filter(bridge => bridge.node1 == node1_id);
      // console.log("BRIDGE:", bridges);
      if (!bridges) {
        return false;
      }
      bridges.forEach(bridge => {
        if (this.blueEndPointsIds.includes(bridge.node2)) {
          // console.log("includes!!!!");
          this.setVictoryScreen(1);
          return true;
        } else {
          return this.checkEndPointConnections(bridge.node2, 1);
        }
      });
    } else { // red bridges
      let bridge = this.redBridges.filter(bridge => { return bridge.node1 === node1_id});
      bridge = bridge[0];
      if (bridge === undefined) {
        return false;
      }
      if (this.redEndPointsIds.includes(bridge.node2)) {
        this.setVictoryScreen(2);
        return true;
      } else {
        return this.checkEndPointConnections(bridge.node2, 2);
      }
    }
  }
  changePlayer() {
    this.canPlay = false;
  }
  get_class(i: number, j: number) {
    if (this.check_if_red_node(i,j)) {
      return 'node-red red';
    } else if (this.check_if_blue_node(i, j)) {
      return 'node-blue blue';
    }
    let bridge = this.redBridges.find( function (element) {
      return element.i === i && element.j === j});
    // check if red bridge exsists, add class
    if (bridge) {
      if (bridge.direction === 'vertical' ) {
        return 'bridge-red bridge-vertical';
        } else {
        return 'bridge-red bridge-horizontal';
        }
    // if red bridge doesnt exsist, check if blue one is
    } else {
      bridge = this.blueBridges.find( function (element) {
        return element.i === i && element.j === j});
      if (!bridge) {
          return '';
        } else {
          if (bridge.direction === 'vertical' ) {
            return 'bridge-blue bridge-vertical';
          } else {
            return 'bridge-blue bridge-horizontal';
          }
        }
    }
  }
  // setStartingPlayer() {
  //   const r = Math.floor(Math.random() * 2) + 1;
  //   console.log(r);
  //   this.player = 1;
  //   this.startingPlayer = r;
  //   // alert('player ' + this.player + ' starts');
  // }
  setVictoryScreen(player:number) {
    setTimeout(() => {
      alert('Player ' + player + 'won!');
      this.canPlay = false;
    }, 100);
    let matchID = this.router.url.split('/')[2];
    // only winning player posts results so it doesn't post twice
    if (player === this.player) {
      this.httpService.postResults(matchID, this.moves).subscribe(res => {
        console.log(res);
      });
    }
  }
  quitGame() {
    if (confirm('Are you sure?') === true) {
      let url_array = this.router.url.split('/');
      let id = url_array[url_array.length - 1];
      console.log(id);
      this.router.navigate(['/play']);
      // this.httpService.quitGame(id).subscribe(()=> {
      // })
    }
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
