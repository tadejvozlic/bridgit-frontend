import { HttpService } from './services/http.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './components/game/game.component';
import { RouterModule, Routes } from '@angular/router';
import { IterableNumberPipe } from './pipes/iterable-number.pipe';
import { MenuComponent } from './components/menu/menu.component';
import { HttpClientModule } from '@angular/common/http';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BoardService } from './services/board.service';

const routes: Routes = [
  { path: 'play', component: GameComponent },
];
@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    IterableNumberPipe,
    MenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    RouterModule.forRoot(routes),
  ],
  providers: [HttpService, BoardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
