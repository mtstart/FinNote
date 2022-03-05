import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { Common } from './app/shared/common';
import { environment } from './environments/environment';

const passwordPrompt = 'Please enter password to proceed.';

if (environment.production) {
  enableProdMode();
}

const sha256 = async (message: string) => {
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
};

const loadApp = () => {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
};

// Recursively ask for password
const checkPassword = (attemptPassword: string, attemptsLeft: number): Promise<string> => {
  return sha256(attemptPassword).then(hashed =>
    hashed === environment.passwordHash
      ? Promise.resolve(attemptPassword)
      : attemptsLeft
        ? checkPassword(
          Common.vntFixNull(prompt(
            ([passwordPrompt, attemptsLeft <= 3 ? `(${attemptsLeft} attempt(s) left)` : null]
              .filter(line => !!line)
              .join(' '))
          )),
          attemptsLeft - 1
        )
        : Promise.reject('Too many attempts')
  );
};

if (environment.passwordHash) {
  console.log("starts");
  // localStorage.clear();
  
  const trialPassword = localStorage.getItem('dev-password') || prompt(passwordPrompt);
  checkPassword(Common.vntFixNull(trialPassword), 5 - 1)
    .then(correctPassword => localStorage.setItem('dev-password', correctPassword))
    .then(() => loadApp())
    .catch(() => (window.location.href = 'https://www.youtube.com/watch?v=PJJhHihvDpo'));
} else {
  loadApp();
}

console.log("load here");