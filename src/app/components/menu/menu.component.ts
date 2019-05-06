import { HttpService } from './../../services/http.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  ) { }

  ngOnInit() {
    this.loading = false;
  }

  newGame() {
    // this.loading = true;
    // setTimeout(() => {
    //   this.router.navigate(['play/1']);
    // }, 2000);
  }
  joinGame() {
    this.httpService.joinGame().subscribe(games => {
      this.pendingGames = games;
    });
  }
}
