import { HttpService } from './../../services/http.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  pendingGames;
  loading;
  constructor(
    private httpService: HttpService,
    private router: Router,
    private modalService: NgbModal
  ) { }
  closeResult: string;

  ngOnInit() {
    this.loading = false;

  }

  newGame() {
    this.router.navigate(['play/1']);
    this.httpService.newGame().subscribe(() => {
      console.log("new game");
    })

  }
  joinGame() {
    this.httpService.joinGame().subscribe(games => {
      this.pendingGames = games;
    });
  }
  open(content) {
    
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
