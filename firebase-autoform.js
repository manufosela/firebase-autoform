import { LitElement, html, css } from '/node_modules/lit-element/lit-element.js';
import 'firebase/firebase-app';
import 'firebase/firebase-auth';

/**
 * `firebase-autoform`
 * FirebaseAutoform
 *
 * @customElement
 * @polymer
 * @litElement
 * @demo demo/index.html
 */

 class FirebaseAutoform extends LitElement {
  static get is() { return 'firebase-autoform'; }

  static get properties() {
    return {
      dataUser:{
        type: Object
      },
      displayName: {
        type: String
      },
      email: {
        type: String
      },
      uid: {
        type: String
      },
      path: {
        type: String
      },
      apiKey: {
        type: String,
        attribute: 'api-key'
      },
      domain: {
        type: String
      },
      messagingSenderId: {
        type: String,
        attribute: 'messaging-sender-id'
      },
      appId: {
        type: String,
        attribute: 'app-id'
      },
      hasParams: {
        type: Boolean
      }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  attributeChangedCallback(name, oldval, newval) {
    super.attributeChangedCallback(name, oldval, newval);
    this.hasParams = !!(this.apiKey && this.domain && this.messagingSenderId && this.appId);
    if (this.hasParams) {
      this.firebaseInitialize();
    }
  }

  constructor() {
    super();
    this.path = '/';
  }

  connectedCallback() {
    super.connectedCallback();

  }

  firebaseInitialize() {
    if (firebase.apps.length === 0) {
      const firebaseConfig = {
        apiKey: this.apiKey,
        authDomain: this.domain + '.firebaseapp.com',
        databaseURL: 'https://' + this.domain + '.firebaseio.com',
        projectId: this.domain,
        storageBucket: this.domain + '.appspot.com',
        messagingSenderId: this.messagingSenderId,
        appId: this.appId
      };
      firebase.initializeApp(firebaseConfig);
      this.onAuthStateChanged();
    }
  }

  onAuthStateChanged() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        this.displayName = user.displayName;
        this.email = user.email;
        this.uid = user.uid;
        this.shadowRoot.querySelector('#quickstart-sign-in').textContent = 'Sign out';
        this.shadowRoot.querySelector('#user').textContent = `${this.displayName} (${this.email})`;
        this.shadowRoot.querySelector('#quickstart-sign-in').disabled = false;

        // ejecutar metodo para cambiar valores de propiedades para que se muestre el boton que corresponda
      } else {
        this.displayName = undefined;
        this.email = undefined;
        this.uid = undefined;
        this.shadowRoot.querySelector('#quickstart-sign-in').textContent = 'Sign in';
        this.shadowRoot.querySelector('#user').textContent = '';
        this.shadowRoot.querySelector('#quickstart-sign-in').disabled = false;

        // ejecutar metodo para cambiar valores de propiedades para que se muestre el boton que corresponda
      }
    }.bind(this));
  }

  toggleSignIn() {
    if (!firebase.auth().currentUser) {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
        this.dataUser = result.user;
      }.bind(this)).catch(function(error) {
        console.log(error);
      });
    } else {
      firebase.auth().signOut();
    }
    this.shadowRoot.querySelector('#quickstart-sign-in').disabled = true;
  }

  render() {
    return html`
    ${this.hasParams ? html`
       <section class="wrapper__layer--login">
        <div id="user" class="wrapper__user"></div>
        <button disabled class="wrapper__login--button" id="quickstart-sign-in" @click=${this.toggleSignIn}></button>
      </section>` : html`<p>Faltan parámetros en la definición del componente</p>` }
    `;
  }
}

window.customElements.define(FirebaseAutoform.is, FirebaseAutoform);