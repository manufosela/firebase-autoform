import {
  LitElement,
  html,
  css
} from 'lit-element';
import 'firebase/firebase-database';
import {} from '@polymer/paper-button/paper-button.js';
import {} from '@polymer/paper-input/paper-input.js';
import {} from '@polymer/paper-spinner/paper-spinner.js';
import {} from '@polymer/paper-dialog/paper-dialog.js';
import {} from '@polymer/paper-item/paper-item.js';
import {} from '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import {} from '@polymer/paper-listbox/paper-listbox.js';

/**
 * `firebase-autoform`
 * FirebaseAutoform
 *
 * @customElement firebase-autoform
 * @polymer
 * @litElement
 * @demo demo/index.html
 */

export class FirebaseAutoform extends LitElement {
  static get is() {
    return 'firebase-autoform';
  }

  static get properties() {
    return {
      path: {
        type: String
      },
      waitingMsg: {
        type: String,
        attribute: 'wating-msg'
      },
      elId: {
        type: String,
        attribute: 'el-id'
      },
      data: {
        type: Object
      },
      dataUser: {
        type: Object
      },
      bLog: {
        type: Boolean
      }
    };
  }

  static get styles() {
    return css `
      /* CSS CUSTOM VARS
        --path-title-color: #FF7800;
        --error-msg-color: blue;
        --spinner-color: #4285f4;
        --bg-save-btn-hover: lime;
        --color-save-btn-hover: green;
        --bg-save-btn: yellow;
        --color-save-btn: blue;
        --fields-max-width: 300px;
      */
      :host {
        display: block;
      }

      .error_msg { font-weight:bold; color:var(--error-msg-color, blue); padding:15px; }
      .path { color:var(--path-title-color, #FF7800); }
      #formfieldlayer { margin-bottom:30px; }
      .inlineblock { display:inline-block; }
      .slot { margin-right: 10px; font-size: 10px; font-weight: bold; color: #AAA; }
      .waiting { padding: 20px; margin: 20px; font-size: 2rem; }
      .path { margin:0; padding: 20px; font-size: 2rem; color: var(--path-title--color) }
      .formGroupFlex { display:flex; }
      
      .container {
        display:flex;
        flex-direction: row;
        flex-wrap: wrap;
        white-space: normal;
      }
      section {
        padding:20px;
        margin:0 20px 0 20px;
        width: var(--fields-max-width, 300px);
      }
      paper-listbox {
        cursor: pointer;
      }
      paper-input, paper-dropdown-menu {
        width: var(--fields-max-width, 300px);
      }

      paper-spinner.blue::shadow .circle {
        border-color: var(--spinner-color, #4285f4);
      }
      paper-button.register {
        background: gray;
        color: blue;
      }
      paper-button.register:hover {
        background: #CCC;
        color: cyan;
      }
      paper-button.login {
        background: green;
        color: yellow;
      }
      paper-button.login:hover {
        background: var(--bg-save-btn-hover, lime);
        color: var(--color-save-btn-hover, green);
      }
      paper-button.save {
        background: var(--bg-save-btn, yellow);
        color: var(--color-save-btn, blue);
      }
      paper-button.save:hover {
        background: cyan;
        color: yellow;
      }
      paper-button[disabled],
      paper-button[toggles][active] {
        background: red;
      }

      button {
        width: 20px;
        height: 20px;
        margin-top: 30px;
        font-size: 12px;
        font-weight: bold;
        padding: 0;
      }
    `;
  }

  constructor() {
    super();
    this.path = '/';

    this.elId = null;
    this.data = null;
    this.dataUser = null;
    this._parentKeys = [];
    this._counter = [];
    this._arrKeys = [];
    this.bLog = true;
  }

  log(msg) {
    if (this.bLog) {
      console.log(msg);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('firebase-signin', (ev) => {
      this._userLogged(ev);
      this._stopIfAreYouSigin();
    });
    document.addEventListener('firebase-signout', (ev) => {
      this._userLogout(ev);
    });
    if (this.elId) {
      document.addEventListener('firebase-autoform-selectid', (ev) => {
        this.elId = ev.detail.id;
      });
    }
    if (!this.user || !this.data) {
      // Si no hay usuario, pregunta si alguien está logado en firebase
      this.log('Hubo retraso. Intentando detectar si se ha Logado');
      this.sIntId = setInterval(this._areYouSignin(), 1000);
    }
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'elId' && this.elId !== oldValue && oldValue !== undefined) {
        this.getData();
      }
    });
  }

  _areYouSignin() {
    document.dispatchEvent(new CustomEvent('firebase-are-you-signin'));
    this.log('intento de busqueda si está logado');
  }

  _userLogged(obj) {
    this.user = obj.detail.user.displayName;
    this.dataUser = obj.detail.user;
    this.getData();
  }

  _userLogout(obj) {
    this.dataUser = null;
    this.data = null;
  }

  _stopIfAreYouSigin() {
    this.sIntId = null;
  }

  getData() {
    let starredStatusRef = firebase.database().ref(this.path);
    starredStatusRef.on('value', (snapshot) => {
      this.data = snapshot.val();
      this._analizeFields().then(resolve => {
        return new Promise(r => {
          this._getFields(this.data[0]);
          this.shadowRoot.querySelector('#spinner').active = false;
          r();
        });
      });
    });
  }

  _analizeFields() {
    this.shadowRoot.querySelector('#spinner').active = true;
    this.shadowRoot.querySelector('#formfieldlayer').textContent = '';
    if (this.data[0]) {
      return new Promise((resolve, reject) => {
        if (typeof this.data[0] === 'object') {
          this._simple = false;
          this._getParentKeys(resolve);
        } else {
          this._simple = true;
          this._cleanError();
          let k = [ this.path.replace('/', '') ];
          this.shadowRoot.querySelector('#spinner').active = false;
          let fieldForm = this._createField(k, typeof this.data[0]);
          this.shadowRoot.querySelector('#formfieldlayer').appendChild(fieldForm);
          resolve();
        }
      });
    }
  }

  _getParentKeys(resolve, reject) {
    let ref = firebase.database().ref('/');
    let keys = [];
    let counts = [];
    ref.once('value')
      .then(snap => {
        snap.forEach(function(item) {
          let itemVal = item.val();
          let itemKey = item.key;
          keys.push(itemKey);
        });
        this.log('keys with entry', keys);
        this._parentKeys = keys;
        return resolve();
      });
  }

  _getFields(obj) {
    this._cleanError();
    this._arrKeys = [];
    const arrFormElements = [];
    for (let k in obj) {
      if (obj.hasOwnProperty(k)) {
        let fieldForm;
        this._arrKeys.push(k);
        if (typeof obj[k] === 'object' && this._parentKeys.includes(k)) {
          this.log('multifield multiple ' + k);
          fieldForm = this._createFormGroup();
          this._createListMult(k, fieldForm);
        } else if (this._parentKeys.includes(k)) {
          fieldForm = this._createFormGroup();
          this._createList(k, fieldForm);
          this.log('list ' + k);
        } else if (typeof obj[k] === 'object') {
          fieldForm = this._createMF(k, typeof obj[k][0]);
          this.log('Multifield ' + k);
        } else if (typeof obj[k] === 'string' || typeof obj[k] === 'number') {
          fieldForm = this._createField(k, typeof obj[k]);
          this.log('input ' + k);
        }
        if (fieldForm) {
          this.shadowRoot.querySelector('#formfieldlayer').appendChild(fieldForm);
        }
      }
    }
    return arrFormElements;
  }

  _createFormGroup(style) {
    const formGroupLayer = document.createElement('div');
    formGroupLayer.className = (style === 'flex') ? 'formGroupFlex' : 'formGroup';
    return formGroupLayer;
  }

  _createField(labelId, typeobj) {
    const c = this._createFormGroup();
    const hasVal = (this.elId && this.data[this.elId]);
    const elVal = (hasVal) ? this.data[this.elId][labelId] : '';
    if (!this.shadowRoot.querySelector('#' + labelId)) {
      c.innerHTML = `
        <paper-input type="${typeobj}" label="${labelId}" id="${labelId}" value="${(hasVal) ? elVal : ''}">
          <div class="slot" slot="prefix">[${typeobj}]</div>
        </paper-input>
      `;
    }
    return c;
  }

  _createMF(labelId, typeobj) {
    const c = this._createFormGroup();
    this._createMultiField(c, labelId, typeobj);
    return c;
  }

  _createMultiField(container, labelId, typeobj) {
    const c = this._createFormGroup();
    this._counter[labelId] = (!this._counter[labelId]) ? 0 : this._counter[labelId]++;

    const id = labelId + '_' + this._counter[labelId];
    c.innerHTML = `
      <paper-input type="${typeobj}" label="${labelId}" id="${id}" class="inlineblock">
        <div class="slot" slot="prefix">[${typeobj}]</div>
        <div class="slot" slot="suffix">${this._counter[labelId]}</div>
      </paper-input>`;
    const e = document.createElement('button');
    e.id = 'btn_' + id;
    e.innerHTML = '+';
    e.setAttribute('typeobj', typeobj);
    e.addEventListener('click', this._newMultiField.bind(this));
    c.appendChild(e);
    container.appendChild(c);
  }

  _newMultiField(ev, o) {
    let labelId = ev.target.id.replace(/^btn_/, '');
    labelId = labelId.replace(/_\d*$/, '');
    const container = ev.target.parentNode.parentNode;
    const typeobj = ev.target.getAttribute('typeobj');
    this._counter[labelId]++;
    const c = this._createFormGroup();
    if (!this.shadowRoot.querySelector('#' + labelId)) {
      const id = labelId + '_' + this._counter[labelId];
      c.innerHTML = `
        <paper-input type="${typeobj}" label="${labelId}" id="${id}" class="inlineblock">
          <div class="slot" slot="prefix">[${typeobj}]</div>
          <div class="slot" slot="suffix">${this._counter[labelId]}</div>
        </paper-input>`;
    }
    container.appendChild(c);
  }

  _createListMult(labelId, formGroup) {
    this._counter[labelId] = (!this._counter[labelId]) ? 0 : this._counter[labelId]++;
    const ref = firebase.database().ref('/' + labelId);
    ref.once('value')
      .then((snap) => {
        if (!this.shadowRoot.querySelector('#' + labelId)) {
          if (this.elId) {
            this.data[this.elId][labelId].forEach((elVal, index) => {
              const container = (index === 0) ? this._createFormGroup('flex') : this._createFormGroup();
              this._counter[labelId] = (!this._counter[labelId]) ? 0 : this._counter[labelId]++;
              const id = labelId + '_' + this._counter[labelId];
              const paperDropdownMenu = document.createElement('paper-dropdown-menu');
              paperDropdownMenu.id = id;
              paperDropdownMenu.label = labelId;
              const paperListbox = this._createPaperListBox(snap);
              paperDropdownMenu.appendChild(paperListbox);
              container.appendChild(paperDropdownMenu);
              if (index === 0) {
                this._addPlusButton(id, container);
              }
              if (!this.shadowRoot.querySelector('#' + labelId)) {
                formGroup.appendChild(container);
                this.log(elVal);
                container.querySelector('paper-dropdown-menu').value = elVal;
              }
            });
          } else {
            const container = this._createFormGroup('flex');
            this._counter[labelId] = (!this._counter[labelId]) ? 0 : this._counter[labelId]++;
            const id = labelId + '_' + this._counter[labelId];
            const paperDropdownMenu = document.createElement('paper-dropdown-menu');
            paperDropdownMenu.id = id;
            paperDropdownMenu.label = labelId;
            const paperListbox = this._createPaperListBox(snap);
            paperDropdownMenu.appendChild(paperListbox);
            const addButton = document.createElement('button');
            container.appendChild(paperDropdownMenu);
            this._addPlusButton(id, container);
            if (!this.shadowRoot.querySelector('#' + labelId)) {
              formGroup.appendChild(container);
            }
          }
        }
      });
  }

  _addPlusButton(id, container) {
    const addButton = document.createElement('button');
    addButton.id = 'btn_' + id;
    addButton.innerHTML = '+';
    addButton.addEventListener('click', this._newListMult.bind(this));
    container.appendChild(addButton);
  }

  _createPaperListBox(snap) {
    const paperListbox = document.createElement('paper-listbox');
    paperListbox.slot = 'dropdown-content';
    paperListbox.className = 'dropdown-content';
    snap.forEach((item) => {
      const itemVal = item.val();
      const paperItem = document.createElement('paper-item');
      paperItem.innerHTML = itemVal;
      paperListbox.appendChild(paperItem);
    });
    return paperListbox;
  }

  _newListMult(ev, o) {
    let labelId = ev.target.id.replace(/^btn_/, '');
    labelId = labelId.replace(/_\d*$/, '');
    const formGroup = ev.target.parentNode.parentNode;
    this._counter[labelId]++;
    const id = labelId + '_' + this._counter[labelId];
    const ref = firebase.database().ref('/' + labelId);
    const paperDropdownMenu = document.createElement('paper-dropdown-menu');
    paperDropdownMenu.id = id;
    paperDropdownMenu.label = labelId;
    const paperListbox = document.createElement('paper-listbox');
    paperListbox.slot = 'dropdown-content';
    paperListbox.className = 'dropdown-content';
    const container = this._createFormGroup();
    ref.once('value')
      .then(function(snap) {
        snap.forEach(function(item) {
          const itemVal = item.val();
          const paperItem = document.createElement('paper-item');
          paperItem.innerHTML = itemVal;
          paperListbox.appendChild(paperItem);
        });
        if (!this.shadowRoot.querySelector('#' + labelId)) {
          paperDropdownMenu.appendChild(paperListbox);
          let c = this._createFormGroup();
          this._counter[labelId] = (!this._counter[labelId]) ? 0 : this._counter[labelId]++;
          container.appendChild(paperDropdownMenu);
          formGroup.appendChild(container);
        }
      }.bind(this));
  }

  _createList(labelId, formgroup) {
    const ref = firebase.database().ref('/' + labelId);
    const paperDropdownMenu = document.createElement('paper-dropdown-menu');
    paperDropdownMenu.id = labelId;
    paperDropdownMenu.label = labelId;
    const hasVal = (this.elId && this.data[this.elId]);
    const elVal = (hasVal) ? this.data[this.elId][labelId] : '';
    const paperListbox = document.createElement('paper-listbox');
    paperListbox.slot = 'dropdown-content';
    paperListbox.className = 'dropdown-content';
    ref.once('value')
      .then(function(snap) {
        snap.forEach(function(item) {
          let itemVal = item.val();
          const paperItem = document.createElement('paper-item');
          paperItem.innerHTML = itemVal;
          paperListbox.appendChild(paperItem);
        });
        if (!this.shadowRoot.querySelector('#' + labelId)) {
          paperDropdownMenu.appendChild(paperListbox);
          formgroup.appendChild(paperDropdownMenu);
          paperDropdownMenu.value = elVal;
        }
      }.bind(this));
  }

  _createListMS(labelId, formGroup) {
    // TODO
    // <paper-dropdown-menu-multi label="Names" selections="[&quot;Sarah&quot;,&quot;Tessa&quot;,&quot;Hitaru&quot;]" maxdisplay="3"></paper-dropdown-menu-multi>
  }

  _showError(msg) {
    this.shadowRoot.querySelector('#formfieldlayer').innerHTML = '';
    let arrMsg = {
      nopath: 'Path <span class="path">' + this.path + '</span> doesn\'t exists',
      none: ''
    };
    let d = (!this.shadowRoot.querySelector('.error_msg')) ? document.createElement('div') : this.shadowRoot.querySelector('.error_msg');
    d.className = 'error_msg';
    d.innerHTML = arrMsg[msg];
    if (!this.shadowRoot.querySelector('.error_msg')) {
      this.shadowRoot.querySelector('#formfieldlayer').appendChild(d);
    }
  }

  _cleanFields() {
    this.shadowRoot.querySelectorAll('#formfieldlayer paper-input').forEach(element => {
      element.value = '';
    });
    this.shadowRoot.querySelector('#formfieldlayer').querySelectorAll('paper-dropdown-menu').forEach(element => {
      element.shadowRoot.querySelector('paper-menu-button .dropdown-trigger paper-input').value = '';
    });
  }

  _cleanError() {
    let errmsg = this.shadowRoot.querySelector('.error_msg');
    if (errmsg) {
      errmsg.remove();
    }
  }

  _closeInSeconds(seconds, callback) {
    setTimeout(() => {
      this.shadowRoot.querySelector('#mensaje_popup').toggle();
      if (callback) {
        callback();
      }
    }, seconds * 1000);
  }

  _showMsgPopup(msg, callback) {
    this.shadowRoot.querySelector('#mensaje_popup').innerHTML = '<h1>' + msg + '</h1>';
    this.shadowRoot.querySelector('#mensaje_popup').toggle();
    this._closeInSeconds(2, callback);
  }

  save() {
    if (this._arrKeys.length) {
      this.saveComplex();
    } else {
      this.saveSimple();
    }
  }

  saveSimple() {
    let el = this.shadowRoot.querySelector('#' + this.path.replace('/', ''));
    let val = el.$.input.value || '';
    let nextId = parseInt(Object.keys(this.data).pop()) + 1;
    let newId = firebase.database().ref().child(this.path).push().key;
    let updates = {};
    updates[this.path + '/' + newId] = this.data[nextId];
    firebase.database().ref().update(updates);
    this.data[nextId] = val;
    this.log(nextId, newId);
    this.log(val);
    this._showMsgPopup('Datos guardados correctamente', this._cleanFields.bind(this));
  }

  saveComplex() {
    let data = this._tourElements();
    this._saveFirebase(data);
  }

  _tourElements() {
    let data = {};
    for (let i = 0; i < this._arrKeys.length; i++) {
      let el = this.shadowRoot.querySelector('#' + this._arrKeys[i]);
      if (el) {
        let val = (el.$.input) ? el.$.input.value : el.value;
        data[this._arrKeys[i]] = (val) ? val : '';
      } else {
        let els = this.shadowRoot.querySelectorAll('[id^=' + this._arrKeys[i] + '_]');
        data[this._arrKeys[i]] = [];
        for (let j = 0; j < els.length; j++) {
          el = els[j];
          let val = (el.$.input) ? el.$.input.value : el.value;
          data[this._arrKeys[i]][j] = (val) ? val : '';
          this.log('\t' + j + ' = ' + val);
        }
        if (data[this._arrKeys[i]].length === 0) {
          delete data[this._arrKeys[i]];
        }
      }
    }
    return data;
  }
  nada() {
    // nada
  }

  _saveFirebase(data) {
    if (Object.keys(data).length !== 0) {
      let nextId = this.elId || parseInt(Object.keys(this.data).pop()) + 1;
      let callbackFn = (this.elId) ? null : this._cleanFields.bind(this);
      this.data[nextId] = data;

      firebase.database().ref(this.path).child(nextId).set(data, (error) => {
        this.log(nextId);
        this.log(data);
        if (error) {
          this._showMsgPopup(error.message);
          console.log(error);
        } else {
          this._showMsgPopup('Datos guardados correctamente', callbackFn);
        }
      });
    }
  }

  render() {
    return html`
      ${this.dataUser !== null ? html` 
        <h3 class='path'>
          ${this.path.replace(/^\//, '')} 
          <span class="id">
            ${this.elId ? html`(ID ${this.elId})` : html``}
          </span>
          <paper-spinner id="spinner" class="blue" active></paper-spinner>
        </h3>
        <div class="container">
          <section>
            <div id="formfieldlayer"></div>    
            ${this.data !== undefined ? html`<paper-button class="save" raised @click="${this.save}">${(this.elId) ? html`Update [ID ${this.elId}]` : html`Insert new element`}</paper-button>` : html`` }
            <paper-dialog id="mensaje_popup"></paper-dialog>
          </section>
        </div>
      ` : html`<div class="waiting">Waiting for login...</div>`}
    `;
  }
}

window.customElements.define(FirebaseAutoform.is, FirebaseAutoform);