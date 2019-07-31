import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  player: number = 1;
  size: number = 5;
  blueNodes = [];
  redNodes = [];
  blueEndPointsIds = [];
  redEndPointsIds = [];
  // board;

  constructor() { }


  createBoard(size: number = 5): BoardService {
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
    return this;
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
