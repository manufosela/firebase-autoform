import {
  LitElement,
  html,
  css
} from 'lit-element';
import 'firebase/firebase-database';
import {} from '@polymer/paper-button/paper-button.js';
import {} from '@polymer/paper-input/paper-input.js';
import {} from '@polymer/paper-input/paper-textarea.js';
import {} from '@polymer/paper-checkbox/paper-checkbox.js';
import {} from '@polymer/paper-spinner/paper-spinner.js';
import {} from '@polymer/paper-dialog/paper-dialog.js';
import {} from '@polymer/paper-item/paper-item.js';
import {} from '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import {} from '@polymer/paper-listbox/paper-listbox.js';
import {} from 'firebase-uploadfile/firebase-uploadfile.js';
import {} from 'high-select/lib/high-select.js';

/**
 * `firebase-autoform`
 * FirebaseAutoform v2.4.0
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
      isChild: {
        type: Boolean,
        attribute: 'is-child'
      },
      readonly: {
        type: Boolean
      },
      loggedUser: {
        type: String,
        attribute: 'logged-user'
      },
      readonlyFields: {
        type: Array
      },
      textareaFields: {
        type: Array
      },
      fileuploadFields: {
        type: Array
      },
      datepickerFields: {
        type: Array
      },
      filterFields: {
        type: Array
      },
      autoSave: {
        type: Boolean,
        attribute: 'auto-save'
      },
      data: {
        type: Object
      },
      dataUser: {
        type: Object
      },
      bLog: {
        type: Boolean
      },
      bShowPath: {
        type: Boolean,
        attribute: 'show-path'
      },
      bHideId: {
        type: Boolean,
        attribute: 'hide-id'
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
        --fieldset-border-color: #F50;
        --legend-bg-color: #DDD;
        --label-color: #F30;

        --uploadfile-progress-bg-color, #eee;
        --uploadfile-progress-color1: #09c;
        --uploadfile-progress-color2: #f44;
        --uploadfile-progress-width: 500px
        --uploadfile-bgcolor-button: #106BA0;
        --uploadfile-color-button: #FFF;
        --uploadfile-progress-width: 400px;
      */
      :host {
        display: block;
        font-size:100%;
      }

      .error_msg { font-weight:bold; color:var(--error-msg-color, blue); padding:15px; }
      .path { color:var(--path-title-color, #FF7800); }
      #formfieldlayer { margin-bottom:30px; }
      .inlineblock { display:inline-block; }
      .slot { margin-right: 10px; font-size: 10px; font-weight: bold; color: #AAA; }
      .waiting { padding: 20px; margin: 20px; font-size: 2rem; }
      .path { margin:0; padding: 20px; font-size: 2rem; color: var(--path-title--color) }
      .pathchild { margin:0; padding:0; height:0; }
      .formGroupFlex { display:flex; }
      .chbx-block { display:flex; margin: 15px 0; }
      .chbx-block .label { font-size: 0.7rem; color:var(--label-color, #F30); }
      .chbx-block paper-checkbox { margin-left: 1rem; }
      
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
      section.child {
        padding-top:0;
        padding-left:0;
        margin-left:0;
      }
      paper-listbox {
        cursor: pointer;
      }
      paper-input, paper-dropdown-menu, high-select, select, paper-textarea {
        width: var(--fields-max-width, 300px);
        --secondary-text-color: var(--label-color, #F30);
      }
      paper-input:host(label) {
        font-weight:bold;
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
      firebase-uploadfile {
        --progress-width: var(--uploadfile-progress-width, 400px);
        --progress-bg-color: var(--uploadfile-progress-bg-color, #DDD);
        --progress-color1: var(--uploadfile-progress-color1, #09c);
        --progress-color2: var(--uploadfile-progress-color2, #f44);
        --bgcolor-button: var(--uploadfile-bgcolor-button, #DDD);
        --color-button: var(--uploadfile-color-button, #F50);
      }
      label {
        display:block;
        font-size: 0.7em;
        font-family: 'Roboto', 'Noto', sans-serif;
        color: var(--label---color-button, #F30);
        margin-bottom:5px;
      }
      fieldset {
        border: 1px solid var(--fieldset-border-color, #F50);
        border-radius: 20px;
        padding: 14px;
        margin: 10px;
        width: var(--fields-max-width, 300px);
      }
      fieldset fieldset {
        border:0;
      }
      legend {
        padding: 0 20px;
        background: var(--legend-bg-color, #DDD);
        border-radius: 10px;
        color: var(--fieldset-border-color, #F50);
      }
      select {
        border: 0;
        border-bottom: 1pxc solid #000;
      }
      button {
        margin-top: 30px;
        font-size: 12px;
        font-weight: bold;
        border-radius: 20px;
        padding: 2px 11px;
        height: auto;
      }
      .hidden {
        visibility:hidden;
        display:none;
      }      
      .tooltip {
        position:absolute;
        width:auto;
        max-width:400px;
        padding:10px;
        color:#fff;
        background:#333;
        opacity:0;
        box-shadow:2px 2px 5px #aaa; -webkit-box-shadow:2px 2px 5px #aaa; -moz-box-shadow:2px 2px 5px #aaa;
      }
      .west:before {
        content:' '; 
        position:absolute;
        top:50%;
        left:-16px; 
        width:0;
        height:0;
        margin-top:-8px; 
        border:8px solid transparent;
        border-right-color:#333;
      }
      .south:before {
        content: " ";
        position: absolute;
        top: 100%;
        left: 49%;
        width: 0;
        height: 0;
        margin-top: 0;
        border: 8px solid transparent;
        border-top-color: #333;
      }
      .tooltip.show {
        opacity: 1;       
      }
      .collapsed {
        overflow: hidden;
        height: 5px;
      }
      .toggle {
        cursor: pointer;
        content: " ";
        position: relative;
        left: 10px;
        width: 0;
        height: 0;
        margin-top: 0;
        border: 8px solid transparent;
      }
      .down {
        border-top-color: #333;
        top: 15px;
      }
      .up {
        border-bottom-color: #333;
        top: -13px;
      }
      .bubbleSaved {
        content:"Saved";
        position:absolute;
        height:1.5em;
        line-height:1.5em;
        padding:0 .46em;
        text-align:center;
        text-shadow:0 0.063em 0 rgba(0,0,0,.2);
        background-color: #F93;
        color: #FFF;
        width: 100px;
        box-shadow:0 0.063em 0.063em rgba(0,0,0,.2);
        border-radius:4em;
        z-index:1;
        opacity:0;
      }
      .invisible {
        display: none;
      }
    `;
  }

  constructor() {
    super();
    this.path = '/';

    this.isChild = false;
    this.elId = null; /* Atributo id del elemento firebase-autoform */
    this.data = null;
    this.dataUser = null;
    this._fieldsInRootPath = [];
    this._valuesFieldsInRootPath = [];
    this._firebaseAutoformEls = [];
    this._counter = [];
    this._arrKeys = [];
    this.bLog = false;
    this.bShowPath = false;
    this.bHideId = false;
    this.loggedUser = '';
    this.autosave = false;
    this.fieldChanged = '';

    this.groups = {};

    this.tooltip = document.createElement('div');
    this.tooltip.classList.add('tooltip');
    this.tooltip.classList.add('south');

    this._setElId_ =  this._setElId_.bind(this);
    this._setUploadedFileName_ = this._setUploadedFileName_.bind(this);
    this._allIsReady = this._allIsReady.bind(this);
    this._userLogout_ = this._userLogout_.bind(this);
    this._userLogged_ = this._userLogged_.bind(this);
    this._hideTooltip_ = this._hideTooltip_.bind(this);
    this._showTooltip_ = this._showTooltip_.bind(this);
  }

  log(msg) {
    if (this.bLog) {
      console.log(msg);
    }
  }

  _setElId_(ev) {
    this.elId = ev.detail.id;
  }

  _setUploadedFileName_(ev) {
    const name = ev.detail.name;
    const id = ev.detail.id;
    if (this.id === id) {
      this.shadowRoot.querySelector('[name="' + name + '"').value = ev.detail.downloadURL;
    }
  }

  _getFieldDesc() {
    const fieldsDesc = {};
    const fieldsDescDOM = (this.querySelectorAll('description-field')) ? this.querySelectorAll('description-field') : [];
    for (let fieldDesc of fieldsDescDOM) {
      const fieldDescParts = fieldDesc.innerText.split('=');
      const repeatedFields = fieldDescParts[0].split('|');
      for (let field of repeatedFields) {
        fieldsDesc[field] = fieldDescParts[1];
      }
    }
    return fieldsDesc;
  }

  _getCollapsibleGroups() {
    const fieldsCollapGrpDOM = (this.querySelector('grp-collapsible')) ? this.querySelector('grp-collapsible').innerText.replace(/[\n\s]*/g, '') : null;
    return (fieldsCollapGrpDOM) ? fieldsCollapGrpDOM.split(',') : [];
  }

  _getMandatoryFields() {
    const mandatoryFieldsDOM = (this.querySelector('mandatory-fields')) ? this.querySelector('mandatory-fields').innerText.replace(/[\n\s]*/g, '') : null;
    const mandatoryFields = (mandatoryFieldsDOM) ? mandatoryFieldsDOM.split(',') : [];
    return mandatoryFields;
  }

  _getFilterFields() {
    const filterFieldsDOM = (this.querySelector('filter-fields')) ? this.querySelector('filter-fields').innerText.replace(/[\n\s]*/g, '') : null;
    const filterFields = (filterFieldsDOM) ? filterFieldsDOM.split(',') : [];
    return filterFields;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('firebase-signin', this._userLogged_);
    document.addEventListener('firebase-signout', this._userLogout_);
    document.addEventListener('firebase-autolist-selectid', this._setElId_);
    const firebaseAreYouLoggedEvent = new Event('firebase-are-you-logged'); // (2)
    document.dispatchEvent(firebaseAreYouLoggedEvent);

    this.textareaFields = (this.querySelector('textarea-fields')) ? this.querySelector('textarea-fields').innerText.replace(/[\n\s]*/g, '').split(',') : [];
    this.readonlyFields = (this.querySelector('readonly-fields')) ? this.querySelector('readonly-fields').innerText.replace(/[\n\s]*/g, '').split(',') : [];
    this.datepickerFields = (this.querySelector('date-picker')) ? this.querySelector('date-picker').innerText.replace(/[\n\s]*/g, '').split(',') : [];
    this.fileuploadFields = (this.querySelector('fileupload-fields')) ? this.querySelector('fileupload-fields').innerText.replace(/[\n\s]*/g, '').split(',') : [];
    if (this.fileuploadFields.length > 0) {
      document.addEventListener('firebase-file-storage-uploaded', this._setUploadedFileName_);
    }
    const grpNames = (this.querySelector('grp-names')) ? this.querySelector('grp-names').innerText.replace(/[\n\s]*/g, '').split(',') : [];
    this.grpNames = {};
    for (let el of grpNames) {
      const parts = el.split('=');
      this.grpNames['GRP_' + parts[0]] = parts[1];
    }

    this.fieldsDesc = this._getFieldDesc();
    this.collapsibleGroups = this._getCollapsibleGroups();
    this.mandatoryFields = this._getMandatoryFields();

  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('firebase-signin', this._userLogged_);
    document.removeEventListener('firebase-signout', this._userLogout);
    document.removeEventListener('firebase-autolist-selectid', this._setElId_);
    document.removeEventListener('firebase-file-storage-uploaded', this._setUploadedFileName_);
    for (let field in this.fieldsDesc) {
      if (Object.prototype.hasOwnProperty.call(this.fieldsDesc, field)) {
        const el = this.shadowRoot.querySelector(`#${field}`);
        el.removeEventListener('click', this._showTooltip_);
        el.removeEventListener('mouseover', this._showTooltip_);
        el.removeEventListener('mouseout', this._hideTooltip_);
      }
    }
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'elId' && this.elId !== oldValue && oldValue !== undefined) {
        this.getData().then(this._allIsReady());
      }
      if (propName === 'path' && this.path !== oldValue && oldValue !== undefined) {
        this.getData().then(this._allIsReady());
      }
    });
  }

  _addMandatoryFieldsEventListeners() {
    const allMandatoryFields = this.mandatoryFields.map((fields) => fields.split('&')).flat();
    for (let field of allMandatoryFields) {
      if (this.shadowRoot.querySelector(`#${field}`)) {
        this.shadowRoot.querySelector(`#${field}`).addEventListener('change', (ev) => {
          console.log(`dejando el campo ${ev.target}`);
        });
      }
    }
  }

  _allIsReady() {
    document.dispatchEvent(new CustomEvent('firebase-autoform-ready', {
      detail: {
        path: this.path,
        id: this.elId,
        obj: this
      }
    }));
  }

  _userLogged_(obj) {
    if (!this.user && obj.detail.user) {
      this.user = obj.detail.user.displayName;
      this.dataUser = obj.detail.user;
      this.getData()
        .then(this._allIsReady())
        .catch((msg) => {
          this.shadowRoot.querySelector('#spinner').active = false;
          this.shadowRoot.querySelector('#formfieldlayer').innerHTML = `<h1>ERROR</h1>${msg}`;
        });
    }
  }

  _userLogout_() {
    this.dataUser = null;
    this.data = null;
  }

  _insertLegends() {
    const formGroups = this.shadowRoot.querySelectorAll('#formfieldlayer > fieldset');
    for (let frmG of formGroups) {
      const grpId = frmG.id;
      if (this.grpNames[grpId] && !frmG.querySelector('legend')) {
        const legend = document.createElement('legend');
        legend.innerText = this.grpNames[grpId];
        frmG.appendChild(legend);
      }
    }
  }

  _tooltip(target, options) {
    if (options.content) {
      this.tooltip.innerText = options.content;
    }
    target.parentNode.appendChild(this.tooltip);
    this.tooltip.style.top = (target.offsetTop - this.tooltip.offsetHeight - 10) + 'px';
    this.tooltip.style.left = target.offsetLeft + 'px'; // 'calc(var(--fields-max-width) + 100px)';
  }

  _showTooltip_(ev) {
    clearTimeout(this.tooltipTimeout);
    this.tooltip.style.opacity = 1;
    this.tooltip.classList.add('show');
    this._tooltip(ev.target, {
      content: this.fieldsDesc[ev.target.id]
    });
    let val = 1;
    setTimeout(() => {
      const tooltipInterval = setInterval(()=> {
        val -= 0.05;
        this.tooltip.style.opacity =  val;
        if (val <= 0) {
          clearInterval(tooltipInterval);
        }
      }, 50);
    }, 3000);
  }

  _hideTooltip_(ev) {
    this.tooltip.classList.remove('show');
    this.tooltip.style.left = '-1000px';
  }

  _addEventsTooltip(field) {
    const el = this.shadowRoot.querySelector(`#${field}`);
    if (el) {
      el.addEventListener('mouseover', this._showTooltip_);
      el.addEventListener('mouseout', this._hideTooltip_);
    }
  }

  _insertTooltips() {
    for (let field in this.fieldsDesc) {
      if (Object.prototype.hasOwnProperty.call(this.fieldsDesc, field)) {
        this._addEventsTooltip(field);
      }
    }
  }

  _toggleCollapse(ev) {
    const el = ev.target;
    if (el.classList.value.includes('up')) {
      el.classList.remove('up');
      el.classList.add('down');
      el.parentNode.parentNode.classList.add('collapsed');
    } else {
      el.classList.remove('down');
      el.classList.add('up');
      el.parentNode.parentNode.classList.remove('collapsed');
    }
  }

  _makeCollapsibleGrps() {
    const fieldSets = this.shadowRoot.querySelectorAll('fieldset');
    for (let fieldSet of fieldSets) {
      const letter = fieldSet.id.split('_')[1];
      if (this.collapsibleGroups.includes(letter)) {
        fieldSet.classList.add('collapsed');
        const legend = fieldSet.querySelector('legend');
        if (!legend.querySelector('a')) {
          const btn = document.createElement('a');
          btn.classList.add('toggle');
          btn.classList.add('down');
          legend.appendChild(btn);
          btn.addEventListener('click', this._toggleCollapse);
        }
      }
    }
  }

  _addBtnEvents() {
    const arrBtnAdd = this.shadowRoot.querySelectorAll('[id^="addNew"]');
    arrBtnAdd.forEach((btn)=>{
      btn.addEventListener('click', this._newMultiField.bind(this));
    });
    const arrBtnDel = this.shadowRoot.querySelectorAll('[id^="delLast"]');
    arrBtnDel.forEach((btn)=>{
      btn.addEventListener('click', this._delMultiField.bind(this));
    });
  }

  _autoSaveEvents() {
    for (let key of this._arrKeys) {
      let domElement = this.shadowRoot.querySelector(`#${key}`);
      if (domElement && !this._firebaseAutoformEls.includes(key)) {
        const event = (domElement.tagName === 'PAPER-TEXTAREA') ? 'blur' : 'change';
        domElement.addEventListener(event, (ev)=> {
          this.fieldChanged = ev.target.id;
          this.save();
        });
        domElement.addEventListener('focus', (ev) => {
          let pNode = ev.target.parentNode;
          pNode = (pNode.id === '') ? pNode.parentNode : pNode;
          if (pNode.classList.toString().includes('collapsed')) {
            pNode.classList.remove('collapsed');
          }
        });
      }
    }
  }

  _idExits() {
    const included = (this.data.includes) ? this.data.includes(this.elId) : Object.keys(this.data).includes(this.elId);
    return this.elId && included;
  }

  getData() {
    const myPromise = new Promise((resolve, reject) => {
      let starredStatusRef = firebase.database().ref(this.path);
      starredStatusRef.once('value')
        .then((snapshot) => {
          this.data = snapshot.val();
          if (this._idExits) {
            this._analizeFields()
              .then(() => {
                const myPromise2 = new Promise(resolve2 => {
                  this._insertFields(this.data['0']).then(() => {
                    this.shadowRoot.querySelector('#spinner').active = false;
                    this._insertLegends();
                    this._insertTooltips();
                    this._makeCollapsibleGrps();
                    this._addBtnEvents();
                    if (this.autoSave) {
                      this._autoSaveEvents();
                      this.shadowRoot.querySelector('#bubbleSaved').classList.remove('invisible');
                    }
                    this.log('insertFields finish');
                  });
                  resolve2();
                });
                return myPromise2;
              }).catch((msg) => {
                this.shadowRoot.querySelector('#spinner').active = false;
                this.shadowRoot.querySelector('#formfieldlayer').innerHTML = `<h1>ERROR</h1>${msg}`;
              });
          } else {
            const msg = 'ID not found';
            this.shadowRoot.querySelector('#spinner').active = false;
            this.shadowRoot.querySelector('#formfieldlayer').innerHTML = `<h1>ERROR</h1>${msg}`;
          }
          resolve();
        })
        .catch((msg) => {
          this.shadowRoot.querySelector('#spinner').active = false;
          this.shadowRoot.querySelector('#formfieldlayer').innerHTML = `<h1>ERROR</h1>${msg}`;
        });
    });
    return myPromise;
  }

  ____getData() {
    const myPromise = new Promise((resolve, reject) => {
      let starredStatusRef = firebase.database().ref(this.path);
      starredStatusRef.once('value')
        .then((snapshot) => {
          this.data = snapshot.val();
          this._analizeFields()
            .then(() => {
              const myPromise2 = new Promise(resolve2 => {
                this._insertFields(this.data['0']).then(() => {
                  this.shadowRoot.querySelector('#spinner').active = false;
                  this._insertLegends();
                  this._insertTooltips();
                  this._makeCollapsibleGrps();
                  this._addBtnEvents();
                  if (this.autoSave) {
                    this._autoSaveEvents();
                    this.shadowRoot.querySelector('#bubbleSaved').classList.remove('invisible');
                  }
                  this.log('insertFields finish');
                });
                resolve2();
              });
              return myPromise2;
            }).catch((msg) => {
              this.shadowRoot.querySelector('#spinner').active = false;
              this.shadowRoot.querySelector('#formfieldlayer').innerHTML = `<h1>ERROR</h1>${msg}`;
            });
          resolve();
        })
        .catch((msg) => {
          this.shadowRoot.querySelector('#spinner').active = false;
          this.shadowRoot.querySelector('#formfieldlayer').innerHTML = `<h1>ERROR</h1>${msg}`;
        });
    });
    return myPromise;
  }

  _analizeFields() {
    this.shadowRoot.querySelector('#spinner').active = true;
    this.shadowRoot.querySelector('#formfieldlayer').textContent = '';
    this.groups = {};
    return new Promise((resolve, reject) => {
      if (this.data) {
        if (this.data['0']) {
          console.log('SCHEMA: ', this.data['0']);
          if (Array.isArray(this.data['0'])) {
            console.log('ES UN ARRAY ', this.data['0']);
            this._getDataZeroKeys(resolve);
          } else if (typeof this.data['0'] === 'object') {
            console.log('ES UN OBJETO ', this.data[0]);
            this._simple = false;
            this._getFieldsInRootPath(resolve);
          } else {
            console.log('ES SIMPLE');
            this._simple = true;
            this._cleanError();
            const groupName = this.path.replace('/', '');
            let k = [ groupName ];
            this._createFormGroup(groupName).then(c => {
              for (let key in this.data) {
                if (Object.prototype.hasOwnProperty.call(this.data, key) && key !== '0') {
                  const field = this.data[key];
                  const domElement = document.createElement('paper-input');
                  const slotElement = document.createElement('div');
                  domElement.value = field;
                  if (this.readonly) {
                    domElement.readonly = 'true';
                  }
                  slotElement.textContent = key;
                  slotElement.slot = 'suffix';
                  domElement.appendChild(slotElement);
                  c.appendChild(domElement);
                }
              }
              this.shadowRoot.querySelector('#formfieldlayer').appendChild(c);
              this.shadowRoot.querySelector('#spinner').active = false;
            });
          }
        } else {
          reject('No data[0] found');
        }
      } else {
        reject(`No data. Path is correct? (${this.path})`);
      }
    });
  }


  _getDataZeroKeys(resolve) {
    let ref = firebase.database().ref('this.path');
    let keys = [];
    let counts = [];
    console.log('ZEROKEYS: ', this.path);
    ref.once('value')
      .then(snap => {
        const dataZero = snap.val()['0'];
        for (let key in dataZero) {
          if (Object.prototype.hasOwnProperty.call(dataZero, key)) {
            keys.push(key);
          }
        }
        console.log('keys with entry', keys);
        this._fieldsInRootPath = keys;
        return resolve();
      })
      .catch((err) => {
        console.log(err);
        console.log(this.path);
      });
  }

  _getFieldsInRootPath(resolve) {
    let ref = firebase.database().ref('/');
    let keys = [];
    let values = {};
    ref.once('value')
      .then(snap => {
        snap.forEach(function(item) {
          let itemVal = item.val();
          let itemKey = item.key;
          keys.push(itemKey);
          values[itemKey] = itemVal;
        });
        console.log('keys with entry', keys);
        this._fieldsInRootPath = keys;
        this._valuesFieldsInRootPath = values;
        return resolve();
      });
  }

  /*_getFieldsInRootPath(resolve) {
    let ref = firebase.database().ref(this.path + '/0');
    let keys = [];
    ref.once('value')
      .then(snap => {
        snap.forEach((item) => {
          // let itemVal = item.val();
          let itemKey = item.key;
          keys.push(itemKey);
        });
        this.log('keys with entry', keys);
        this._fieldsInRootPath = keys;
        return resolve();
      });
  }*/

  _getLoggedUser() {
    let user;
    if (this.elId) {
      if (Object.keys(this.data[this.elId]).includes('__edit_user')) {
        if (this.data[this.elId].__edit_user !== '') {
          user = this.data[this.elId].__edit_user;
        } else {
          user = this.user;
        }
      } else {
        this.data[this.elId].__edit_user = this.user;
        user = this.user;
      }
    } else {
      user = this.user;
    }
    return user;
  }

  _insertLoggedUser(obj) {
    this._createFormGroup('loggedUser').then(c => {
      const loggedUser = (this.loggedUser !== '') ? this.loggedUser : 'logged-user';
      const user = this._getLoggedUser();
      const cssClass = (this.loggedUser !== '') ? '' : 'class="hidden"';
      c.innerHTML = `
          <paper-input type="text" label="${loggedUser}" id="__edit_user" readonly value="${user}" ${cssClass}></paper-input>
        `;
      if (!this.shadowRoot.querySelector('#__edit_user')) {
        this.shadowRoot.querySelector('#formfieldlayer').appendChild(c);
      }
    });
  }

  _insertFields(obj) {
    return new Promise(resolve => {
      const arrPromises = [];
      this._cleanError();
      this._insertLoggedUser(obj);

      const keys = Object.keys(obj);
      this._arrKeys = keys;
      let counter = 0;
      let keyObj = keys[counter];

      const fill = () => {
        for (let fieldFormKey in this.groups) {
          if (Object.prototype.hasOwnProperty.call(this.groups, fieldFormKey)) {
            if (fieldFormKey.search(/GRP_[a-zA-Z]*$/) !== -1) {
              this.shadowRoot.querySelector('#formfieldlayer').appendChild(this.groups[fieldFormKey]);
            } else {
              const regExp = new RegExp(/(GRP_[a-zA-Z]*).*/);
              const parentFieldset = regExp.exec(fieldFormKey);
              try {
                this.shadowRoot.querySelector('#' + parentFieldset[1]).appendChild(this.groups[fieldFormKey]);
              } catch (err) {
                console.log(err);
                console.log(parentFieldset[1], fieldFormKey, this.groups[fieldFormKey]);
              }
            }
          }
        }
      };

      const fn = () => {
        counter++;
        keyObj = keys[counter];
        if (counter < keys.length) {
          if (keyObj !== '__edit_user' && keyObj !== '__created_at') {
            return this._getFieldForm(obj[keyObj], keyObj);
          }
        } else {
          fill();
          resolve();
        }
      };

      keyObj = keys[counter];
      let chain = this._getFieldForm(obj[keyObj], keyObj);
      for (let key of keys) {
        chain = chain.then(fn);
      }
    });
  }

  _getFieldForm(propField, labelKey) {
    let myPromise;
    const [labelShown, labelCleanId] = this._getLabels(labelKey);
    if (typeof propField === 'object' && this._fieldsInRootPath.includes(labelShown)) {
      console.log('** multifield multiple ' + labelKey);
      myPromise = this._createFormGroup(labelKey).then((fieldForm) => {
        return this._createListMult(labelKey, fieldForm);
      });
    } else if (this._fieldsInRootPath.includes(labelShown)) {
      /* SI EL VALOR CON KEY 0 ES UN STRING ES UN SELECT */
      /* SI EL VALOR CON KEY 0 ES UN OBJETO ES OTRO FIREBASE_AUTOFORM */
      if (typeof this._valuesFieldsInRootPath[labelShown][0] === 'object') {
        /* FIREBASE ELEMENTS */
        console.log('** firebase-autoform ' + labelKey);
        this._firebaseAutoformEls.push(labelKey);
        myPromise = this._createFormGroup(labelKey).then((fieldForm) => {
          return this._createFirebaseAutoformChild(labelKey, fieldForm);
        });
      } else {
        /* SELECT ELEMENTS */
        console.log('** select ' + labelKey);
        myPromise = this._createFormGroup(labelKey).then((fieldForm) => {
          return this._createHighList(labelKey, fieldForm);
        });
        this.log('list ' + labelKey);
      }
    } else if (typeof propField === 'object')  {
      /* INPUT TEXT MULTIPLES ELEMENTS */
      console.log('** createMF ' + labelKey);
      console.log(labelKey, typeof propField, propField);
      myPromise = this._createMF(labelKey, typeof propField['0'], propField);
    } else if (propField === true || propField === false) {
      /* CHECKBOX ELEMENTS */
      console.log('** checkbox ' + labelKey);
      myPromise = this._createFormGroup(labelKey).then(fieldForm => {
        return this._createCheckbox(labelKey, fieldForm);
      });
    } else if (typeof propField === 'string' || typeof propField === 'number') {
      /* INPUT TEXT, TEXTAREA OR FIREBASE-UPLOAD ELEMENTS */
      console.log('** input text ' + labelKey);
      myPromise = this._createFormGroup(labelKey).then(fieldForm => {
        return this._createField(labelKey, typeof propField, fieldForm);
      });
    }
    return myPromise;
  }

  _getGrpId(labelKey) {
    let grpId;
    const partsId = labelKey.split('-');
    if (partsId.length > 1) {
      if (labelKey.search(/_[0-9]*$/) !== -1) {
        grpId = `GRP_${labelKey}`;
      } else {
        const grpName = partsId[0].replace(/[0-9]*/g, '');
        grpId = `GRP_${grpName}`;
      }
    } else {
      grpId = `GRP_${labelKey}`;
    }
    return grpId;
  }

  _createFormGroup(labelKey, style) {
    return new Promise((resolve) => {
      const grpId = this._getGrpId(labelKey);

      //let formGroupLayer = this.shadowRoot.querySelector(`#${grpId}`);
      if (!this.groups[grpId]) {
        this.groups[grpId] = (labelKey !== 'loggedUser') ? document.createElement('fieldset') : document.createElement('div'); 
        this.groups[grpId].id = grpId;
        this.groups[grpId].className = (style === 'flex') ? 'formGroupFlex' : 'formGroup';
      }
      resolve(this.groups[grpId]);
    });
  }

  _getLabels(labelId) {
    const labelIdParts = labelId.split('-');
    const labelShown = labelIdParts[labelIdParts.length - 1];
    const labelCleanId = labelShown.replace(/_/g, ' ');
    return [labelShown, labelCleanId];
  }

  _getHTMLTag(labelId, typeobj) {
    const hasVal = (this.elId && this.data[this.elId][labelId]);
    const elVal = (hasVal) ? this.data[this.elId][labelId].replace(/"/g, '&#34;') : '';
    const readOnly = this.readonlyFields.includes(labelId) || this.readonly ? 'readonly' : '';
    const [labelShown, labelCleanId] = this._getLabels(labelId);

    const label = labelShown + (this.readonlyFields.includes(labelShown) ? ' [READONLY]' : '');
    let HTMLTag;
    if (this.textareaFields.includes(labelId)) {
      HTMLTag = `
        <paper-textarea rows="3" type="${typeobj}" label="${labelCleanId}" id="${labelId}" value="${(hasVal) ? elVal : ''}" ${readOnly}>
          <div class="slot" slot="prefix">[${typeobj}]</div>
        </paper-textarea>
      `;
    } else if (this.fileuploadFields.includes(labelId)) {
      HTMLTag = `
        <firebase-uploadfile id="${labelId}" name="${labelCleanId}" path="/uploadedFiles" storage-name="NAME,FILENAME" ${(hasVal) ? `value="${elVal}"` : ''} delete-btn="true"></firebase-uploadfile>
      `;
    } else if (this.datepickerFields.includes(labelId)) {
      HTMLTag = `
        <label for="${labelId}">${labelCleanId}</label><input type="date" id="${labelId}" name="${labelCleanId}" ${(hasVal) ? `value="${elVal}"` : ''} />
      `
    }else {
      HTMLTag = `
        <paper-input type="${typeobj}" label="${labelCleanId}" id="${labelId}" value="${(hasVal) ? elVal : ''}" ${readOnly}></paper-input>
      `;
    }
    return HTMLTag;
  }

  _createField(labelId, typeobj, fieldForm) {
    return new Promise(resolve => {
      if (!this.shadowRoot.querySelector('#' + labelId)) {
        fieldForm.innerHTML += this._getHTMLTag(labelId, typeobj);
      }
      resolve(fieldForm);
    });
  }

  _createCheckbox(labelId, formGroup) {
    return new Promise(resolve => {
      const [labelShown, labelCleanId] = this._getLabels(labelId);
      const hasVal = (this.elId && this.data[this.elId]);
      const elVal = (hasVal) ? this.data[this.elId][labelId] : '';
      const checked = (hasVal) ? ((elVal === true) ? 'checked="true"' : '') : '';
      const label = labelId.replace(/_/g, ' ');
      const readOnly = this.readonlyFields.includes(labelId) || this.readonly ? 'readonly' : '';
      formGroup.innerHTML += `
        <div class="chbx-block"><div class="label">${labelCleanId}</div><paper-checkbox label="${labelId}" id="${labelId}" ${checked} ${readOnly}"></paper-checkbox></div>
      `;
      resolve(formGroup);
    });
  }

  _createMF(labelId, typeobj, propField) {
    if (typeobj !== 'undefined' && typeobj !== 'object') {
      console.log(typeobj);
      console.log('implementar grupo multiple', labelId);
      return new Promise(resolve => {
        this._createFormGroup(labelId).then(c => {
          this._createMultiField(c, labelId, typeobj);
          resolve(c);
        });
      });
    } else {
      console.log('implementar grupo complejo ', labelId);
      return new Promise(resolve => {
        this._createFormGroup(labelId).then(c => {
          const fbaf = document.createElement('firebase-autoform');
          fbaf.id = labelId;
          fbaf.setAttribute('path', this.path + '/' + labelId);
          console.log('path ', fbaf.path);
          c.appendChild(fbaf);
          resolve(c);
        });
      });
    }
  }

  _addBtn(id, label, container, labelId, typeobj, className) {
    const btn = document.createElement('button');
    btn.setAttribute('id', id);
    btn.setAttribute('data-group', labelId);
    btn.textContent = label;
    btn.setAttribute('typeobj', typeobj);
    btn.setAttribute('class', className);
    container.appendChild(btn);
  }

  _createMultiField(container, labelId, typeobj) {
    this._counter[labelId] = (!this._counter[labelId]) ? 0 : this._counter[labelId]++;
    const [labelShown, labelCleanId] = this._getLabels(labelId);
    const id = labelId + '_' + this._counter[labelId];
    const readOnly = this.readonlyFields.includes(labelId) || this.readonly ? 'readonly' : '';
    container.innerHTML += `
      <paper-input type="${typeobj}" label="${labelCleanId}" id="${id}" class="inlineblock" ${readOnly}>
        <div class="slot" slot="suffix">${this._counter[labelId]}</div>
      </paper-input>`;
    /* CREATE BUTTON */
    this._addBtn('addNew' + labelShown, 'Add new "' + labelCleanId + '"', container, labelId, typeobj, '');
    this._addBtn('delLast' + labelShown, 'Del last "' + labelCleanId + '"', container, labelId, typeobj, 'invisible');
  }

  _newMultiField(ev) {
    const labelId = ev.target.dataset.group;
    const typeobj = ev.target.getAttribute('typeobj');
    const referenceNode = this.shadowRoot.querySelector('#' + labelId + '_' + this._counter[labelId]);
    this._counter[labelId]++;
    const id = labelId + '_' + this._counter[labelId];
    const [labelShown, labelCleanId] = this._getLabels(labelId);
    if (this._counter[labelId] > 0) { this.shadowRoot.querySelector('[id^="delLast' + labelShown + '"]').classList.remove('invisible'); }
    const newNode = document.createElement('paper-input');
    newNode.setAttribute('type', typeobj);
    newNode.setAttribute('label', labelCleanId);
    newNode.setAttribute('id', id);
    newNode.setAttribute('class', 'inlineblock');
    if (this.readonlyFields.includes(labelId) || this.readonly) {
      newNode.setAttribute('readOnly', 'true');
    }
    newNode.innerHTML += `<div class="slot" slot="suffix">${this._counter[labelId]}</div>`;
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  _delMultiField(ev) {
    const labelId = ev.target.dataset.group;
    const [labelShown, labelCleanId] = this._getLabels(labelId);
    if (this._counter[labelId] > 0) {
      this.shadowRoot.querySelector('#' + labelId + '_' + this._counter[labelId]).remove();
      this._counter[labelId]--;
      if (this._counter[labelId] === 0) {
        this.shadowRoot.querySelector('[id="delLast' + labelShown + '"]').classList.add('invisible');
      }
    }
  }

  _createSelectMultiple(labelId, snap) {
    const select = document.createElement('select');
    select.id = labelId;
    select.setAttribute('multiple', 'true');
    snap.forEach((item) => {
      const option = document.createElement('option');
      const itemVal = item.val();
      option.value = itemVal;
      option.innerText = itemVal;
      if (this.data[this.elId][labelId]) {
        if (this.data[this.elId][labelId].includes(itemVal)) {
          option.setAttribute('selected', 'true');
        }
      }
      select.appendChild(option);
    });
    return select;
  }

  _createComplexObject(labelId, formGroup) {

  }

  _createListMult(labelId, formGroup) {
    return new Promise(resolve => {
      const [labelShown, labelCleanId] = this._getLabels(labelId);
      const ref = firebase.database().ref('/' + labelShown);
      ref.once('value')
        .then((snap) => {
          if (!this.shadowRoot.querySelector('#' + labelId)) {
            this._createFormGroup(labelId).then(container => {
              const label = document.createElement('label');
              label.for = labelShown;
              label.innerText = labelShown;
              const select = this._createSelectMultiple(labelId, snap);
              container.appendChild(label);
              container.appendChild(select);
              resolve(container);
            });
          }
        });
    });
  }

  _checkValueSnap(ref, valueSnap, labelShown) {
    let id = 0;  /* NO USO EL 0 PORQUE EL 0 SE USA POR DEFECTO PARA EL SCHEMA */
    if (valueSnap === null) {
      valueSnap = Object.keys(this._valuesFieldsInRootPath[labelShown][0]).reduce((result, item) => {
        result[item] = ''; return result;
      }, {});
      const data = {};
      data[id] = valueSnap;
      ref.set(data);
    } else {
      /* HAY QUE IMPLEMENTAR CUANDO TIENE YA VALORES */
      /* Y OBTENER EL ID QUE ES LO QUE DEVOLVEMOS */
      console.log(valueSnap.id);
      id = valueSnap.length - 1;
    }
    return id;
  }

  _createFirebaseAutoformChild(labelId, formGroup) {
    return new Promise(resolve => {
      const [labelShown, labelCleanId] = this._getLabels(labelId);
      const path = this.path + '/' + this.elId + '/' + labelId;
      console.log(path);
      const ref = firebase.database().ref(path);
      const firebaseAutoformLabel = document.createElement('label');
      const firebaseAutoform = document.createElement('firebase-autoform');
      firebaseAutoform.id = labelId;
      ref.once('value')
        .then((snap) => {
          let valueSnap = snap.val();
          let id = this._checkValueSnap(ref, valueSnap, labelShown);
          firebaseAutoformLabel.innerText = labelCleanId;

          firebaseAutoform.setAttribute('path', path);
          firebaseAutoform.setAttribute('el-id', id);
          firebaseAutoform.setAttribute('is-child', true);
          firebaseAutoform.setAttribute('read-only', this.readonly || false);
          firebaseAutoform.setAttribute('auto-save', this.autoSave || false);
          firebaseAutoform.setAttribute('hide-id', true || false);

          if (!this.shadowRoot.querySelector('#' + labelId)) {
            formGroup.appendChild(firebaseAutoformLabel);
            formGroup.appendChild(firebaseAutoform);
          }
          resolve(formGroup);
        });
    });
  }

  _createHighList(labelId, formGroup) {
    return new Promise(resolve => {
      const [labelShown, labelCleanId] = this._getLabels(labelId);
      const ref = firebase.database().ref('/' + labelShown);
      const highSelectLabel = document.createElement('label');
      const highSelect = document.createElement('high-select');
      highSelect.id = labelId;
      highSelect.setAttribute('label', labelCleanId);
      highSelect.setAttribute('search', 'search');
      highSelect.setAttribute('arrow', 'arrow');
      highSelectLabel.innerText = labelCleanId;
      const hasVal = (this.elId && this.data[this.elId]);
      const elVal = (hasVal) ? this.data[this.elId][labelId] : '';
      let selectedEl = 0;
      let highOption = document.createElement('high-option');
      highOption.innerHTML = '';
      highSelect.appendChild(highOption);
      ref.once('value')
        .then((snap) => {
          snap.forEach((item) => {
            let itemVal = item.val();
            highOption = document.createElement('high-option');
            highOption.innerHTML = itemVal;
            if (itemVal === elVal) {
              selectedEl = parseInt(item.key) + 1;
            }
            highSelect.appendChild(highOption);
          });
          highSelect.children[selectedEl].selected = true;
          if (!this.shadowRoot.querySelector('#' + labelId)) {
            formGroup.appendChild(highSelectLabel);
            formGroup.appendChild(highSelect);
          }
          highSelect.value = elVal;
          if (this.fieldsDesc[labelId]) {
            this._addEventsTooltip(labelId);
          }
          resolve(formGroup);
        });
    });
  }

  _createListMS(labelId, formGroup) {
    // TODO
    // <paper-dropdown-menu-multi label="Names" selections="[&quot;Sarah&quot;,&quot;Tessa&quot;,&quot;Hitaru&quot;]" maxdisplay="3"></paper-dropdown-menu-multi>
  }

  _showError(msg) {
    this.shadowRoot.querySelector('#formfieldlayer').innerHTML = '';
    const arrMsg = {
      nopath: 'Path <span class="path">' + this.path + '</span> doesn\'t exists',
      none: ''
    };
    const d = (!this.shadowRoot.querySelector('.error_msg')) ? document.createElement('div') : this.shadowRoot.querySelector('.error_msg');
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
    const errmsg = this.shadowRoot.querySelector('.error_msg');
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
    const domElelements = this.shadowRoot.querySelectorAll('#formfieldlayer fieldset paper-input');
    let newData = [ 'string' ];
    for (let element of domElelements) {
      newData.push(element.value);
    }
    this.data = newData;
    firebase.database().ref(this.path).set(newData, (error) => { console.log(error); });
    this._showMsgPopup('Datos guardados correctamente', () => {});
  }

  saveComplex() {
    const data = this._tourElements();
    this._saveFirebase(data);
  }
  _getVal(el) {
    let noPaperTags = ['FIREBASE-UPLOADFILE', 'HIGH-SELECT', 'SELECT', 'INPUT'];
    let val = (noPaperTags.includes(el.tagName)) ? el.value : (el.$.input) ? el.$.input.value : el.value;
    if (el.tagName === 'PAPER-CHECKBOX') {
      val = (val === 'on') ? true : false;
    }
    if (el.tagName === 'SELECT') {
      val = Array.from(el.querySelectorAll('option:checked'), e => e.value);
    }
    return val;
  }

  _getAllDataGrp(data, key) {
    const cleanKey = key.split('-')[0];
    const els = this.shadowRoot.querySelectorAll('[id^=' + cleanKey + ']');
    data[key] = [];
    for (const [elIndex, element] of els.entries()) {
      const val = element.$ ? (element.$.input) ? element.$.input.value : element.value : element.value;
      data[key][elIndex] = (val) ? val : '';
      this.log('\t' + elIndex + ' = ' + val);
    }
    if (data[key].length === 0) {
      delete data[key];
    }
    return data;
  }

  _tourElements() {
    let data = {};
    for (const key of this._arrKeys) {
      let el = this.shadowRoot.querySelector('#' + key);
      if (this._firebaseAutoformEls.includes(key)) {
        data[key] = this.shadowRoot.querySelector('#' + key).data;
      } else {
        if (el) {
          const val = this._getVal(el);
          data[key] = (val) ? val : '';
        } else {
          data = this._getAllDataGrp(data, key);
        }
      }
    }
    return data;
  }

  _showBubbleFieldMsg(bubble, el) {
    const offset = 40;
    const bubbleTop = el.offsetTop + 10;
    bubble.style.opacity = 1;
    bubble.style.top = bubbleTop + 'px';
    bubble.style.left = (el.offsetLeft + 150) + 'px';
    let opacity = 1;
    let idInterval = setInterval(() => {
      const val = parseInt(bubble.style.top) - 2;
      if (val < bubbleTop - offset) {
        clearInterval(idInterval);
      }
      opacity -= 0.05;
      bubble.style.opacity = opacity;
      bubble.style.top = val + 'px';
    }, 40);
  }

  _saveFirebase(data) {
    if (Object.keys(data).length !== 0) {
      let nextId = this.elId || parseInt(Object.keys(this.data).pop()) + 1;
      let callbackFn = (this.elId) ? null : this._cleanFields.bind(this);
      data.__edit_user = this.user;
      data.__created_at = firebase.database.ServerValue.TIMESTAMP;
      this.data[nextId] = data;
      if (this.isChild) {
        this.elId = nextId;
      }

      firebase.database().ref(this.path).child(nextId).set(data, (error) => {
        this.log(nextId);
        this.log(data);
        console.log('saved data', data);
        if (error) {
          this._showMsgPopup(error.message);
          console.log(error);
        } else {
          if (!this._firebaseAutoformEls.includes(this.fieldChanged)) {
            if (this.fieldChanged !== '') {
              const el = this.shadowRoot.querySelector('#' + this.fieldChanged);
              this.fieldChanged = '';
              const bubble = this.shadowRoot.querySelector('#bubbleSaved');
              this._showBubbleFieldMsg(bubble, el);
            } else {
              if (!this.isChild) {
                this._showMsgPopup('Datos guardados correctamente', callbackFn);
              }
              document.dispatchEvent(new CustomEvent('firebase-autoform-data-saved', {
                detail: {
                  path: this.path,
                  id: this.elId,
                  data: data
                }
              }));
              if (this.isChild) {
                this._firebaseAutoformEls.forEach((el) => {
                  this.shadowRoot.querySelector('#' + el).save();
                });
              }
            }
          } else {
            console.log('todo guardado');
          }
        }
      });
    }
  }

  render() {
    const path = this.path.split('/');
    const child = (this.isChild) ? 'child' : '';
    return html `
      ${this.dataUser !== null ? html` 
        <h3 class='path${child}'>
          ${(this.bShowPath) ? html`${path[path.length - 1]}` : html``} 
          <span class="id">
            ${this.elId && !this.bHideId ? html` ID: ${this.elId}` : html``}
          </span>
          <paper-spinner id="spinner" class="blue" active></paper-spinner>
        </h3>
        <div class="container">
          <section class="${child}">
            <div id="formfieldlayer"></div>    
            ${this.readonly ? html`` : (this.data !== undefined && !this.isChild) ? html`<paper-button id="saveBtn" class="save" raised @click="${this.save}">${(this._simple) ? html`Update` : (this.elId) ? html`Update [ID ${this.elId}]` : html`Insert new element`}</paper-button>` : html``}
            <paper-dialog id="mensaje_popup"></paper-dialog>
          </section>
        </div>
        <div id="bubbleSaved" class="invisible bubbleSaved">Saved</div>
      ` : html`<div class="waiting">Waiting for login...</div>`}
    `;
  }
}

window.customElements.define(FirebaseAutoform.is, FirebaseAutoform);