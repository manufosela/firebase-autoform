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
      }
    };
  }

  static get styles() {
    return css `
      :host {
        display: block;
        --path-title-color: #FF7800;
        --error-msg-color: blue;
        --spinner-color: #4285f4;
        --bg-save-btn-hover: lime;
        --color-save-btn-hover: green;
        --bg-save-btn: yellow;
        --color-save-btn: blue;
      }

      .error_msg { font-weight:bold; color:var(--error-msg-color); padding:15px; }
      .path { color:green;}
      #formfieldlayer { margin-bottom:30px; }
      .inlineblock { display:inline-block; }
      .slot { margin-right: 10px; font-size: 10px; font-weight: bold; color: #AAA; }
      .waiting { padding: 20px; margin: 20px; font-size: 2rem; }
      .path { margin:0; padding: 20px; font-size: 2rem; color: var(--path-title--color) }
      
      section {
        padding:20px;
      }
      firebase-loginbutton {
        float: right;
      }
      paper-listbox {
        cursor: pointer;
      }

      paper-spinner.blue::shadow .circle {
        border-color: var(--spinner-color);
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
        background: var(--bg-save-btn-hover);
        color: var(--color-save-btn-hover);
      }
      paper-button.save {
        background: var(--bg-save-btn);
        color: var(--color-save-btn);
      }
      paper-button.save:hover {
        background: cyan;
        color: yellow;
      }
      paper-button[disabled],
      paper-button[toggles][active] {
        background: red;
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
  }

  log(msg) {
    console.log(msg);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('firebase-signin', (e) => {
      this.user = e.detail.user.displayName;
      this.dataUser = e.detail.user;
      this.getData();
    });
    document.addEventListener('firebase-signout', (e) => {
      this.dataUser = null;
    });
  }

  getData() {
    let starredStatusRef = firebase.database().ref(this.path);
    starredStatusRef.on('value', (snapshot) => {
      this.data = snapshot.val();
      this._analizeFields().then(r => {
        return new Promise(r => {
          this._getFields(this.data[0]);
          this.shadowRoot.querySelector('#spinner').active = false;
          r();
        });
      }).then(r => {
        //this._getDataId();
      });
    });
  }

  _getDataId() {
    if (this.elId && this.data[this.elId]) {
      let data = this.data[this.elId];
      Object.keys(data).forEach((k) => {
        console.log(k, data[k], typeof data[k]);
        if (typeof data[k] !== 'object') {
          this.shadowRoot.querySelector("#" + k).value = data[k];
        }
      })
    }
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
          let k = [this.path.replace('/', '')];
          this.shadowRoot.querySelector('#spinner').active = false;
          let f = this._createField(k, typeof this.data[0]);
          this.shadowRoot.querySelector('#formfieldlayer').appendChild(f);
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
        snap.forEach(function (item) {
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
    let arrFormElements = [];
    for (let k in obj) {
      if (obj.hasOwnProperty(k)) {
        let f;
        this._arrKeys.push(k);
        if (typeof obj[k] === 'object' && this._parentKeys.includes(k)) {
          this.log('multifield multiple ' + k);
          f = this._createFormGroup();
          this._createListMult(k, f);
        } else if (this._parentKeys.includes(k)) {
          f = this._createFormGroup();
          this._createList(k, f);
          this.log('list ' + k);
        } else if (typeof obj[k] === 'object') {
          f = this._createMF(k, typeof obj[k][0]);
          this.log('Multifield ' + k);
        } else if (typeof obj[k] === 'string' || typeof obj[k] === 'number') {
          f = this._createField(k, typeof obj[k]);
          this.log('input ' + k);
        }
        if (f) {
          this.shadowRoot.querySelector('#formfieldlayer').appendChild(f);
        }
      }
    }
    return arrFormElements;
  }

  _createFormGroup() {
    let c = document.createElement('div');
    c.className = 'formGroup';
    return c;
  }

  _createField(labelId, typeobj) {
    let c = this._createFormGroup();
    let hasVal = (this.elId && this.data[this.elId]);
    let val = this.data[this.elId][labelId];
    if (!this.shadowRoot.querySelector('#' + labelId)) {
      c.innerHTML = `
        <paper-input type="${typeobj}" label="${labelId}" id="${labelId}" value="${(hasVal) ? val : ''}">
          <div class="slot" slot="prefix">[${typeobj}]</div>
        </paper-input>
      `;
    }
    return c;
  }

  _createMF(labelId, typeobj) {
    let c = this._createFormGroup();
    this._createMultiField(c, labelId, typeobj);
    return c;
  }

  _createMultiField(container, labelId, typeobj) {
    let c = this._createFormGroup();
    this._counter[labelId] = (!this._counter[labelId]) ? 0 : this._counter[labelId]++;

    let id = labelId + '_' + this._counter[labelId];
    c.innerHTML = `
      <paper-input type="${typeobj}" label="${labelId}" id="${id}" class="inlineblock">
        <div class="slot" slot="prefix">[${typeobj}]</div>
        <div class="slot" slot="suffix">${this._counter[labelId]}</div>
      </paper-input>`;
    let e = document.createElement('button');
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
    let container = ev.target.parentNode.parentNode;
    let typeobj = ev.target.getAttribute('typeobj');
    this._counter[labelId]++;
    let c = this._createFormGroup();
    if (!this.shadowRoot.querySelector('#' + labelId)) {
      let id = labelId + '_' + this._counter[labelId];
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
    let id = labelId + '_' + this._counter[labelId];
    let ref = firebase.database().ref('/' + labelId);
    let paperDropdownMenu = document.createElement('paper-dropdown-menu');
    paperDropdownMenu.id = id;
    paperDropdownMenu.label = labelId;
    let paperListbox = document.createElement('paper-listbox');
    paperListbox.slot = 'dropdown-content';
    paperListbox.className = 'dropdown-content';
    let container = this._createFormGroup();
    ref.once('value')
      .then((snap) => {
        snap.forEach((item) => {
          let itemVal = item.val();
          let paperItem = document.createElement('paper-item');
          paperItem.innerHTML = itemVal;
          paperListbox.appendChild(paperItem);
        });
        if (!this.shadowRoot.querySelector('#' + labelId)) {
          paperDropdownMenu.appendChild(paperListbox);
          this._counter[labelId] = (!this._counter[labelId]) ? 0 : this._counter[labelId]++;
          let e = document.createElement('button');
          e.id = 'btn_' + id;
          e.innerHTML = '+';
          e.addEventListener('click', this._newListMult.bind(this));
          container.appendChild(paperDropdownMenu);
          container.appendChild(e);
          if (!this.shadowRoot.querySelector('#' + labelId)) {
            formGroup.appendChild(container);
          }
        }
      });
  }

  _newListMult(ev, o) {
    let labelId = ev.target.id.replace(/^btn_/, '');
    labelId = labelId.replace(/_\d*$/, '');
    let formGroup = ev.target.parentNode.parentNode;
    this._counter[labelId]++;
    let id = labelId + '_' + this._counter[labelId];
    let ref = firebase.database().ref('/' + labelId);
    let paperDropdownMenu = document.createElement('paper-dropdown-menu');
    paperDropdownMenu.id = id;
    paperDropdownMenu.label = labelId;
    let paperListbox = document.createElement('paper-listbox');
    paperListbox.slot = 'dropdown-content';
    paperListbox.className = 'dropdown-content';
    let container = this._createFormGroup();
    ref.once('value')
      .then(function (snap) {
        snap.forEach(function (item) {
          let itemVal = item.val();
          let paperItem = document.createElement('paper-item');
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
    let ref = firebase.database().ref('/' + labelId);
    let paperDropdownMenu = document.createElement('paper-dropdown-menu');
    paperDropdownMenu.id = labelId;
    paperDropdownMenu.label = labelId;
    let paperListbox = document.createElement('paper-listbox');
    paperListbox.slot = 'dropdown-content';
    paperListbox.className = 'dropdown-content';
    ref.once('value')
      .then(function (snap) {
        snap.forEach(function (item) {
          let itemVal = item.val();
          let paperItem = document.createElement('paper-item');
          paperItem.innerHTML = itemVal;
          paperListbox.appendChild(paperItem);
        });
        if (!this.shadowRoot.querySelector('#' + labelId)) {
          paperDropdownMenu.appendChild(paperListbox);
          formgroup.appendChild(paperDropdownMenu);
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
    let val = el.$.input.value;
    if (val) {
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
  }

  saveComplex() {
    let data = {};
    for (let i = 0; i < this._arrKeys.length; i++) {
      let el = this.shadowRoot.querySelector('#' + this._arrKeys[i]);
      if (el) {
        let val = (el.$.input) ? el.$.input.value : el.selectedItem.textContent;
        if (val) {
          data[this._arrKeys[i]] = val;
        }
      } else {
        let els = this.shadowRoot.querySelectorAll('[id^=' + this._arrKeys[i] + '_]');
        data[this._arrKeys[i]] = [];
        for (let j = 0; j < els.length; j++) {
          el = els[j];
          let val = (el.$.input) ? el.$.input.value : el.selectedItem.textContent;
          if (val) {
            data[this._arrKeys[i]][j] = val;
          }
          this.log('\t' + j + ' = ' + val);
        }
        if (data[this._arrKeys[i]].length === 0) {
          delete data[this._arrKeys[i]];
        }
      }
    }
    if (Object.keys(data).length !== 0) {
      let nextId = parseInt(Object.keys(this.data).pop()) + 1;
      this.data[nextId] = data;

      firebase.database().ref(this.path).child(nextId).set(data, (error) => {
        this.log(nextId);
        this.log(data);
        if (error) {
          this._showMsgPopup(error.message);
          console.log(error);
        } else {
          this._showMsgPopup('Datos guardados correctamente', this._cleanFields.bind(this));
        }
      });
    }
  }

  render() {
    return html `
      ${this.dataUser !== null ? html` 
        <h3 class='path'>${this.path.replace(/^\//, '')} <paper-spinner id="spinner" class="blue" active></paper-spinner></h3>
        <section class="wrapper__layer--bbdd-info">
          <div id="formfieldlayer"></div>    
          ${this.data !== undefined ? html`<paper-button class="save" raised @click="${this.save}">Save</paper-button>` : html`` }
          <paper-dialog id="mensaje_popup"></paper-dialog>
        </section>
      ` : html`<div class="waiting">Waiting for login...</div>`}
    `;
  }
}

window.customElements.define(FirebaseAutoform.is, FirebaseAutoform);