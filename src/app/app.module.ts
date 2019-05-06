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

const routes: Routes = [
  { path: 'play', component: MenuComponent },
  { path: 'play/:id', component: GameComponent },
];
@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    IterableNumberPipe,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
