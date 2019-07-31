import { Component, ViewChild, ElementRef, VERSION, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent implements OnInit {
  @Output() passwordOutput = new EventEmitter<any>();
  // Alternative for checkboxes
  checkboxes = [
    {
      "id": "lowercase",
      "label": "a-z",
      "library": "abcdefghijklmnopqrstuvwxyz",
      "checked": true
    }, {
      "id": "uppercase",
      "label": "A-Z",
      "library": "ABCDEFGHIJKLMNOPWRSTUVWXYZ",
      "checked": true
    }, {
      "id": "numbers",
      "label": "0-9",
      "library": "0123456789",
      "checked": true
    }, {
      "id": "symbols",
      "label": "!-?",
      "library": "!@#$%^&*-_=+\\|:;',.\<>/?~",
      "checked": false
    }
  ]
  // Declarations
  version: String = `Angular v${VERSION.full}`;

  dictionary: Array<String>;

  lowercase: Boolean = false;
  uppercase: Boolean = true;
  numbers: Boolean = true;
  symbols: Boolean = false;

  passwordLenght: Number = 4;
  buttonLabel: String = "Generate";
  newPassword: String = '';

  ngOnInit() {
  this.generatePassword();
  }
  // Password length
  private updatePasswordLength(event) {
    this.passwordLenght = event.target.value;
  }

  // Copy password to clipboard
  @ViewChild('passwordOutput') password: ElementRef;

  private copyPassword() {
    const inputElement = <HTMLInputElement>this.password.nativeElement;
    // const inputElement = document.getElementById("passwordOutput");
    inputElement.select();
    document.execCommand("copy");
  }

  // Generate password
  private generatePassword() {
    if (this.lowercase === false && this.uppercase === false && this.numbers === false && this.symbols === false) {
      return this.newPassword = "...";
    }

    // Create array from chosen checkboxes
    this.dictionary = [].concat(
      this.lowercase ? this.checkboxes[0].library.split("") : [],
      this.uppercase ? this.checkboxes[1].library.split("") : [],
      this.numbers ? this.checkboxes[2].library.split("") : [],
      this.symbols ? this.checkboxes[3].library.split("") : []
    );

    // Generate random password from array
    var newPassword = "";
    for (var i = 0; i < this.passwordLenght; i++) {
      newPassword += this.dictionary[Math.floor(Math.random() * this.dictionary.length)];
    }
    this.newPassword = newPassword;
    console.log(newPassword);
    this.passwordOutput.emit(this.newPassword);
    // Call copy function
    // setTimeout(() => this.copyPassword());

    // Change text on button when clicked
    this.buttonLabel = "Copied!";
    // setTimeout(() => { this.buttonLabel = "Generate" }, 1500);
  }
}