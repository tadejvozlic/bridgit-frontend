import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './components/game/game.component';
import { RouterModule, Routes } from '@angular/router';
import { IterableNumberPipe } from './pipes/iterable-number.pipe';

const routes: Routes = [
  { path: 'play', component: GameComponent },

]
@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    IterableNumberPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
