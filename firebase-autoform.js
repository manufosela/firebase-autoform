/**
 * TODO:
 *  Autosave fileupload
 *  Button Insert/updated disabled until finish load data
  *  Order firebase-autoform child into groupFields
 */


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
import {} from '@polymer/paper-spinner/paper-spinner.js'; // SPINNER
import {} from '@polymer/paper-dialog/paper-dialog.js'; // POPUP
import {} from 'firebase-uploadfile/firebase-uploadfile.js';
import {} from 'rich-select/rich-select.js';

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
      /**
       * Id del componente firebase-autolist del que escuchar el evento firebase-autolist-selectid
       * Si es null escucha todos los eventos firebase-autolist-selecteid
       */
      listen: {
        type: String
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

      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      .error_msg { font-weight:bold; color:var(--error-msg-color, blue); padding:15px; }
      .path { color:var(--path-title-color, #FF7800); }
      #formfieldlayer { margin-bottom:30px; }
      .inlineblock { display:inline-block; }
      .slot { margin-right: 10px; font-size: 10px; font-weight: bold; color: #AAA; }
      .waiting { padding: 20px; margin: 20px; font-size: 2rem; }
      .path { margin:0; padding: 20px; font-size: 2rem; color: var(--path-title--color) }
      .pathchild { margin:0; padding:0; height:0; }
      .containerFieldsGroupFlex { display:flex; }
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
        width: 100%;
        max-width: var(--fields-max-width, 300px);
      }
      section.child {
        padding-top:0;
        padding-left:0;
        margin-left:0;
      }
      paper-input, rich-select, select, paper-textarea {
        width: 100%;
        max-width: var(--fields-max-width, 300px);
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
        margin-top:15px;
      }
      fieldset {
        border: 1px solid var(--fieldset-border-color, #F50);
        border-radius: 20px;
        padding: 14px;
        margin: 10px;
        width: 100%;
        max-width: var(--fields-max-width, 300px);
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
      legend a {
        display: flex;
        flex-direction:columns;
        justify-content: space-between;
        cursor: pointer;
      }
      .triangulo {
        border-style: solid;
        border-width: 18px;
        width: 0;
        height: 0;
        border-width: 10px;
        width: 0;
        height: 0;
      }
      .down{
        border-color: black transparent transparent transparent;
      }
      .up{
        border-color: transparent transparent black transparent;
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
      .badwords {
        font-weight: bold;
        color: red;
      }
      .borderRed {
        border: 4px dashed red;
        border-radius: 10px;
      }
    `;
  }

  constructor() {
    super();
    this.path = '/';

    this.isChild = false;
    this.elId = null; /* Atributo id del elemento firebase-autoform */
    this.listen = null; /* Id del componente firebase-autolist del que escuchar el evento firebase-autolist-selectid */
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
    console.loggedUser = '';
    this.autosave = false;
    this.fieldChanged = '';
    this.executed = 1;

    this.groups = {};
    this.DOMGroups = {};
    this.subGroups = {};
    this.noGroups = ['GRP___created_at', 'GRP___edit_user', 'GRP___revised'];
    this.__FIELDS = ['__edit_user', '__created_at', '__revised'];
    this.MODELFIELDS = [];
    this.VALUESMODELFIELDS = {};
    this.TYPEMODELFIELDS = {};
    this.SCHEMAFIELDS = [];
    this.TYPESCHEMAFIELDS = {};
    this.HTMLFields = {};
    this.RELATIONMODELFIELD = {
      'string-array': 'SELECT',
      'array-array': 'MULTI-SELECT',
      'array-object': 'FIREBASE-AUTOFORM',
      'array-array of objects': 'FIREBASE-AUTOFORM MULTIPLE'
    };
    this.labelsFormatted = {};

    this.textareaFields = [];
    this.readonlyFields = [];
    this.datepickerFields = [];
    this.fileuploadFields = [];

    // por cual se reemplaza esta? this._valuesFieldsInRootPath = VALUESMODELFIELDS

    this.tooltip = document.createElement('div');
    this.tooltip.classList.add('tooltip');
    this.tooltip.classList.add('south');

    this._setElId_ = this._setElId_.bind(this);
    this._setUploadedFileName_ = this._setUploadedFileName_.bind(this);
    this._allIsReady = this._allIsReady.bind(this);
    this.finish = this.finish.bind(this);
    this.init = this.init.bind(this);
    this._hideTooltip_ = this._hideTooltip_.bind(this);
    this._showTooltip_ = this._showTooltip_.bind(this);
    this._addNewFormElement = this._addNewFormElement.bind(this);
    this._delFormElement = this._delFormElement.bind(this);
    this._cleanFields = this._cleanFields.bind(this);
  }

  log(...msg) {
    if (this.bLog) {
      this.log(msg);
    }
  }

  _setElId_(ev) {
    const id = ev.detail.objId;
    if (this.listen === null || this.listen === id) {
      this.elId = ev.detail.id;
    }
  }

  _setUploadedFileName_(ev) {
    const name = ev.detail.name;
    const id = ev.detail.id;
    if (this.id === id) {
      this.shadowRoot.querySelector('[name="' + name + '"').value = ev.detail.downloadURL;
    }
  }

  _insertKeysModel(keysModel) {
    function turron(b, index=0, obj = {}) {
      if (index === b.length - 1) {
        obj[b[index]] = '';
      } else {
        obj[b[index]] = [];
        obj[b[index]][0] = turron(b, index+1);
      }
      return obj;
    }
    let data = this.data;
    for(let key of keysModel) {
      const b = key.split('.');
      const j = turron(b);
      this.log('_insertKeysModel', key, j);
      data = Object.assign(data, j);
    }
    return data;
  }

  _completeModel(d = this.data) {
    let data = (Array.isArray(d)) ? d[0] : d;
    return new Promise(async resolve => {
      //let keys = this._keyfy(data, parentKey);
      //let cleanKeys = keys.map(key => key.replace(/^.*[A-Z]\d*-/, ''));
      const keys = Object.keys(data);
      const cleanKeys = keys.map(key => key.replace(/^.*[A-Z]\d*-/, ''));
      const keysInModel = this._intersectArrays(cleanKeys, this.MODELFIELDS);
      for(let i = 0; i< cleanKeys.length; i++) {
        const key = cleanKeys[i];
        let tmpData = '';
        let tmpModelData;
        if (keysInModel.includes(key) && (this.TYPEMODELFIELDS[key] === 'array of objects' || this.TYPEMODELFIELDS[key] === 'object')) {
          tmpModelData = await this._getDataPath('/model/' + key);
          tmpData = await this._completeModel(tmpModelData);
          tmpData = await this._resetAllFields(tmpData);
          data[keys[i]] = (Array.isArray(d)) ? tmpData : [tmpData];
        } else {
          data[keys[i]] = this._resetField(key, data[keys[i]]);
        }       
      }
      resolve(data);
    });
  }

  _intersectArrays(a, b) {
    if (b.length > a.length) {
      [b, a] = [a, b];
    }
    return a
      .filter(e => b.indexOf(e) > -1)
      .filter((e, i, c) => c.indexOf(e) === i); // remove duplicates
  }

  _keyfy(obj, prefix = '') {
    return Object.keys(obj).reduce((res, el) => {
      if( typeof obj[el][0] === 'object' ) {
        return [...res, ...this._keyfy(obj[el][0], prefix + el + '.')];
      } else if( Array.isArray(obj[el]) ) {
        return [...res, (prefix !== '') ? prefix + el : el];
      } else if( typeof obj[el] === 'object' && obj[el] !== null ) {
        return [...res, ...this._keyfy(obj[el], prefix + el + '.')];
      } else {
        return [...res, prefix + el];
      }
    }, []);
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

  _getFilterFields() {
    const filterFieldsDOM = (this.querySelector('filter-fields')) ? this.querySelector('filter-fields').innerText.replace(/[\n\s]*/g, '') : null;
    const filterFields = (filterFieldsDOM) ? filterFieldsDOM.split(',') : [];
    return filterFields;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('firebase-signin', this.init);
    document.addEventListener('firebase-signout', this.finish);
    document.addEventListener('firebase-autolist-selectid', this._setElId_);
    const firebaseAreYouLoggedEvent = new Event('firebase-are-you-logged'); // (2)
    document.dispatchEvent(firebaseAreYouLoggedEvent);

    this.forgottenWords = (this.querySelector('forgotten-words')) ? this.querySelector('forgotten-words').innerText.replace(/[\n\s]*/g, '').split(',') : [];
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
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('firebase-signin', this.init);
    document.removeEventListener('firebase-signout', this.finish);
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
    changedProperties.forEach(async (oldValue, propName) => {
      if ( (propName === 'elId' || propName === 'path') && this.elId !== oldValue && oldValue !== undefined) {
        this.data = await this.getDataId();
        await this._processData();
        this._allIsReady();
      }
    });
    this.shadowRoot.querySelector('#spinner').active = false;
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

  /* INIT METHOD */
  async init(obj) {
    if (!this.user && obj.detail.user) {
      this.user = obj.detail.user.displayName;
      this.dataUser = obj.detail.user;
      if (this.elId) {
        /* UPDATE */
        this.data = await this.getDataId();
        await this._processData();
      } else {
        /* INSERT */
        this.data = await this._getDataPath(this.path + '/0');
        await this._analizeFields();
        this.data = await this._completeModel();
      }
      this._allIsReady();
    } else {
      this.log('web-component not prepared, wait to other call...');
    }
  }

  finish() {
    this.dataUser = null;
    this.data = null;
  }

  _insertLegends() {
    return new Promise(resolve => {
      const containerFieldsGroups = [...this.shadowRoot.querySelectorAll('#formfieldlayer > fieldset'), ...this.shadowRoot.querySelectorAll('#formfieldlayer > fieldset > fieldset')];
      for (let frmG of containerFieldsGroups) {
        const grpId = frmG.id;
        const legend = document.createElement('legend');
        let legendText = this.grpNames[grpId];
        if (!legendText) {
          legendText = (this.labelsFormatted[grpId]) ? this.labelsFormatted[grpId].labelCleanId : '';
        }
        legend.innerText = legendText;
        
        if (legendText !== '') {
          frmG.appendChild(legend);
        }
      }
      resolve();
    });
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
      const tooltipInterval = setInterval(() => {
        val -= 0.05;
        this.tooltip.style.opacity = val;
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
    return new Promise(resolve => {
      for (let field in this.fieldsDesc) {
        if (Object.prototype.hasOwnProperty.call(this.fieldsDesc, field)) {
          this._addEventsTooltip(field);
        }
      }
      resolve();
    });
  }

  _toggleCollapse(ev) {
    const el = ev.target.parentNode.querySelector('.triangulo');
    if (el.classList.value.includes('up')) {
      el.classList.remove('up');
      el.classList.add('down');
      el.parentNode.parentNode.parentNode.classList.add('collapsed');
    } else {
      el.classList.remove('down');
      el.classList.add('up');
      el.parentNode.parentNode.parentNode.classList.remove('collapsed');
    }
  }

  _makeCollapsibleGrps() {
    return new Promise(resolve => {
      let fieldSets = this.shadowRoot.querySelectorAll('fieldset');
      /* SOLO LOS FIELDSET CON ID GRP_*  */
      fieldSets = Array.from(fieldSets).filter(el => el.id.split('_').length === 2 && el.id.match(/^GRP_/))
      for (let fieldSet of fieldSets) {
        const letter = fieldSet.id.split('_')[1];
        if (this.collapsibleGroups.includes(letter)) {
          fieldSet.classList.add('collapsed');
          const legend = fieldSet.parentElement.querySelector(`#${fieldSet.id} > legend`);
          if (!legend.querySelector('a')) {
            const legendText = legend.innerHTML;
            legend.innerHTML = '';
            const btn = document.createElement('a');
            btn.innerHTML = `
              <div>${legendText}</div>
              <div class="triangulo down"></div>
            `;

            legend.appendChild(btn);
            btn.addEventListener('click', this._toggleCollapse);
          }
        } else {
          fieldSet.classList.remove('collapsed');
        }
      }
      resolve();
    });
  }

  _addBtnEvents() {
    const arrBtnAdd = this.shadowRoot.querySelectorAll('[id^="addNew"]');
    arrBtnAdd.forEach((btn) => {
      btn.addEventListener('click', this._addNewFormElement);
    });
    const arrBtnDel = this.shadowRoot.querySelectorAll('[id^="delLast"]');
    arrBtnDel.forEach((btn) => {
      btn.addEventListener('click', this._delFormElement);
    });
  }

  _autoSaveEvents() {
    for (let key of this._arrKeys) {
      let domElement = this.shadowRoot.querySelector(`#${key}`);
      if (domElement && !this._firebaseAutoformEls.includes(key)) {
        const event = (domElement.tagName === 'PAPER-TEXTAREA') ? 'blur' : 'change';
        domElement.addEventListener(event, (ev) => {
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

  _completeView() {
    return new Promise(async resolve => {
      this.shadowRoot.querySelector('#spinner').active = false;
      await this._insertLegends();
      await this._insertTooltips();
      await this._makeCollapsibleGrps();
      this._addBtnEvents();
      if (this.autoSave) {
        this._autoSaveEvents();
        this.shadowRoot.querySelector('#bubbleSaved').classList.remove('invisible');
      }
      this.log('insertFields finish');
      resolve();
    });
  }

  _resetField(key, value) {
    if (typeof value === 'boolean' || this.TYPESCHEMAFIELDS[key] === 'boolean') {
      value = false;
    } else if (typeof value === 'number' || this.TYPESCHEMAFIELDS[key] === 'number') {
      value = 0;
    } else if (typeof value === 'string' || this.TYPESCHEMAFIELDS[key] === 'string') {
      value = '';
    }
    return value;
  }

  _resetAllFields(d = this.data) {
    let data = (Array.isArray(d)) ? d[0] : d;
    return new Promise(resolve => {
      Object.keys(data).forEach(key => {
        data[key] = this._resetField(key, data[key]);
      });
      resolve(d);
    })
  }

  _getDataPath(path = this.path) {
    return new Promise(resolve => {
      let statusRef = firebase.database().ref(path);
      statusRef.once('value')
        .then(async (snapshot) => {
          const data = snapshot.val();
          resolve(data);
        })
        .catch((msg) => {
          console.error(msg);
          this.shadowRoot.querySelector('#spinner').active = false;
          this.shadowRoot.querySelector('#formfieldlayer').innerHTML = `<h1>ERROR1 in getDataPath</h1>${msg}`;
          reject(msg);
        });
    });
  }

  getDataId(id = this.elId) {
    return new Promise(async (resolve, reject) => {
      const path = this.path + '/' + id;
      const data = await this._getDataPath(path);
      if (data) {
        resolve(data);
      } else {
        const msg = `ID >${id}< not found in path ${path}`;
        this.shadowRoot.querySelector('#spinner').active = false;
        this.shadowRoot.querySelector('#formfieldlayer').innerHTML = `<h1>ERROR2 in getDataId</h1>${msg}`;
        reject(msg);
      }
    });
  }

  async _processData() {
    this.shadowRoot.querySelector('#formfieldlayer').innerHTML = '';
    try {
      await this._analizeFields();
      await this._getAllGroups();
      await this._createContainers();
      await this._insertFields();
      await this._completeView();
      this.checkForgottenWords();
    } catch (msg) {
      console.error(`ERROR3 in _processData: ${msg}`);
      this.shadowRoot.querySelector('#spinner').active = false;
      this.shadowRoot.querySelector('#formfieldlayer').innerHTML = `Data error`;
    }
  }

  _getArrayOrObject(val) {
    let typeVal = typeof val;
    if (val.push) {
      typeVal = (typeof val[0] === 'object') ? 'array of objects' : 'array';
    }
    return typeVal;
  }

  _getModels() {
    return new Promise((resolve, reject) => {
      const starredStatusRef = firebase.database().ref('/model');
      starredStatusRef.once('value')
        .then((snapshot) => {
          snapshot.forEach((item) => {
            const itemVal = item.val();
            const itemKey = item.key;
            const typeVal = this._getArrayOrObject(itemVal);
            this.log(itemKey, typeVal);
            this.MODELFIELDS.push(itemKey);
            this.VALUESMODELFIELDS[itemKey] = itemVal;
            this.TYPEMODELFIELDS[itemKey] = typeVal;
          });
          resolve();
        });
    });
  }

  _getFieldsSchema() {
    this.log('_getFieldsSchema from ', this.id);
    return new Promise((resolve) => {
      const schema = this.data;
      for (let key in schema) {
        if (Object.prototype.hasOwnProperty.call(schema, key)) {
          this.log('field ', key, typeof (schema[key]));
          this.SCHEMAFIELDS.push(key);
          const typeschemafield = (schema[key].push) ? 'array' : typeof (schema[key]);
          this.TYPESCHEMAFIELDS[key] = typeschemafield;
        }
      }
      resolve();
    });
  }

  _getAllGroups() {
    return new Promise( async resolve => {
      await this._getGroups();
      await this._getGroupsMultiples();
      resolve();
    });
  }

  _createContainers() {
    return new Promise(async resolve => {
      await this._createContainerFieldsGroups();
      await this._createContainerFieldsGroupsMultiples();
      resolve();
    });
  }

  _analizeFields() {
    return new Promise(async (resolve, reject) => {
      await this._getModels();
      await this._getFieldsSchema();
      this._getLabelsFormatted();
      await this._getSelectFieldsType();
      resolve();
    });
  }

  _getGroups() {
    return new Promise((resolve) => {
      const groups = new Set();
      for (let labelKey of this.SCHEMAFIELDS) {
        const grpId = this._getGrpId(labelKey);
        groups.add(grpId);
      }
      this.groups = Array.from(groups);
      this.log('groups: ', this.groups);
      resolve();
    });
  }

  _getGroupsMultiples() {
    return new Promise((resolve) => {
      const keys = Object.keys(this.HTMLFields);
      const keysFBAFMult = Object.values(this.HTMLFields).map((val, index) => {
        if (val === 'FIREBASE-AUTOFORM MULTIPLE') {
          return keys[index];
        }
      }).filter(val => val !== undefined);
      for (let labelKey of keysFBAFMult) {
        const arrFirebaseAutoformElements = this.data[labelKey];
        const numberFirebaseAutoformElements = arrFirebaseAutoformElements.length;
        const grpId = this._getGrpId(labelKey);
        const groupId = grpId + '_' + this.labelsFormatted[labelKey].labelShown;
        this.subGroups[groupId] = [];
        for (let i = 0; i < numberFirebaseAutoformElements; i++) {
          this.subGroups[groupId].push(groupId + '_' + i);
          this.log('groupID: ', groupId + '_' + i);
        }
      }
      resolve();
    });
  }

  _getLoggedUser() {
    let user;
    if (this.elId) {
      if (Object.keys(this.data).includes('__edit_user')) {
        if (this.data.__edit_user !== '') {
          user = this.data.__edit_user;
        } else {
          user = this.user;
        }
      } else {
        this.data.__edit_user = this.user;
        user = this.user;
      }
    } else {
      user = this.user;
    }
    return user;
  }

  async _insertLoggedUser(obj) {
    const containerFieldsGroup = await this._createContainerFieldsGroup('loggedUser');
    const loggedUser = (console.loggedUser !== '') ? console.loggedUser : 'logged-user';
    const user = this._getLoggedUser();
    const cssClass = (console.loggedUser !== '') ? '' : 'class="hidden"';
    containerFieldsGroup.innerHTML = `
        <paper-input type="text" label="${loggedUser}" id="__edit_user" readonly value="${user}" ${cssClass}></paper-input>
      `;
    if (!this.shadowRoot.querySelector('#__edit_user')) {
      this.shadowRoot.querySelector('#formfieldlayer').appendChild(containerFieldsGroup);
    }
  }

  _insertFields(data = this.data) {
    return new Promise(async resolve => {
      this._cleanError();
      this._insertLoggedUser(data);
      const keys = Object.keys(data);
      this._arrKeys = keys;
      for (let key of keys) {
        if (!this.__FIELDS.includes(key)) {
          await this._getFieldForm(data[key], key);
        }
      }
      resolve();
    });
  }

  _getSelectFieldsType() {
    return new Promise(async resolve => {
      for (let labelKey in this.data) {
        await this._getSelectFieldType(labelKey);
      }
      this.log(this.id, 'HTMLFields: ', this.HTMLFields);
      resolve();
    });
  }

  _getSelectFieldType(labelKey) {
    return new Promise( resolve => {
      /*
      Si no está en la lista de modelos es un campo comun tipo string:	INPUT, TEXTAREA, FECHA, CHECKBOX, FIREBASE-UPLOADFILE
      Si no está en la lista de modelos es un campo comun tipo array:   INPUT MULTIPLE, TEXTAREA MULTIPLE, FECHA MULTIPLE, CHECKBOX MULTIPLE, FIREBASE-UPLOADFILE MULTIPLE

      TYPEMODEL si es de tipo Boolean es CHECKBOX.

      TYPEMODEL             TYPESCHEMA
      string/boolean/number	undefined		      INPUT, TEXTAREA, FECHA, CHECKBOX, FILE-UPLOAD
      array	                undefined		      INPUT MULTIPLE, TEXTAREA MULTIPLE, FECHA MULTIPLE, CHECKBOX MULTIPLE, FIREBASE-UPLOADFILE MULTIPLE
      string	              array		          SELECT
      array	                array		          SELECT MULTIPLE
      array	                objeto		        FIREBASE-AUTOFORM
      array	                array de objetos  FIREBASE-AUTOFORM MULTIPLE
      */
      const isModel = this.MODELFIELDS.includes(this.labelsFormatted[labelKey].labelShown);
      const typeModel = this.TYPEMODELFIELDS[this.labelsFormatted[labelKey].labelShown];
      const typeField = this.TYPESCHEMAFIELDS[labelKey];


      if (isModel) {
        this.HTMLFields[labelKey] = this.RELATIONMODELFIELD[`${typeField}-${typeModel}`];
      } else {
        const multi = (typeField === 'array') ? ' MULTIPLE' : '';
        this.HTMLFields[labelKey] = (this.textareaFields.includes(labelKey) ? 'TEXTAREA' :
          this.datepickerFields.includes(labelKey) ? 'DATE-PICKER' :
          this.fileuploadFields.includes(labelKey) ? 'FILE-UPLOAD' :
          this.TYPESCHEMAFIELDS[labelKey] === 'boolean' ? 'CHECKBOX' :
          'INPUT') + multi;
      }
      resolve();
    });
  }

  async _getFieldForm(propField, labelKey) {
    const regExpCommonField = new RegExp(/INPUT|TEXTAREA|DATE-PICKER|FILE-UPLOAD/);
    const containerId = this._getGrpId(labelKey);
    const fieldForm = this.DOMGroups[containerId];
    if (this.HTMLFields[labelKey] === 'MULTI-SELECT') {
      await this._createBlockMultipleSelect(labelKey, fieldForm);
    }
    if (this.HTMLFields[labelKey] === 'FIREBASE-AUTOFORM') {
      await this._createFirebaseAutoformChild(labelKey, fieldForm);
    }
    if (this.HTMLFields[labelKey] === 'FIREBASE-AUTOFORM MULTIPLE') {
      await this._createFirebaseAutoformChildMultiple(labelKey, fieldForm);
    }
    if (this.HTMLFields[labelKey] === 'SELECT') {
      await this._createRichList(labelKey, fieldForm);
    }
    if (this.HTMLFields[labelKey] === 'INPUT MULTIPLE') {
      await this._createBlockInputMultiple(labelKey, typeof propField['0']);
    }
    if (this.HTMLFields[labelKey] === 'CHECKBOX') {
      await this._createCheckbox(labelKey, fieldForm);
    }
    if (regExpCommonField.exec(this.HTMLFields[labelKey])) {
      await this._createCommonHTMLField(labelKey, typeof propField, fieldForm);
    }
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

  _createContainerFieldsGroup(labelKey, style) {
    return new Promise( (resolve, reject) => {
      if (this.shadowRoot.querySelector('#'+labelKey)) {
        const msg = `${labelKey} group ya creado`;
        console.error(msg);
        reject(msg);
      }
      const DOMGroup = (labelKey !== 'loggedUser') ? document.createElement('fieldset') : document.createElement('div');
      DOMGroup.id = labelKey;
      DOMGroup.className = (style === 'flex') ? 'containerFieldsGroupFlex' : 'containerFieldsGroup';
      DOMGroup.classList.add('collapsed');
      if (!this.shadowRoot.querySelector(`#${labelKey}`)) {
        this.shadowRoot.querySelector('#formfieldlayer').appendChild(DOMGroup);
      }
      resolve(DOMGroup);
    });
  }

  _createContainerFieldsGroups() {
    return new Promise(async (resolve) => {
      const groups = this.groups.filter(group => !this.noGroups.includes(group));
      for (let group of groups) {
        const domGroup = await this._createContainerFieldsGroup(group);
        if (domGroup) {
          this.DOMGroups[group] = domGroup;
        }
      }
      resolve(this.DOMGroups);
    });
  }

  _createContainerFieldsGroupsMultiples() {
    return new Promise(async (resolve) => {
      for (let subGroupId in this.subGroups) {
        const parentGroup = subGroupId.match(/GRP_[A-Z]/)[0];
        const domSubgroup = await this._createContainerFieldsGroup(subGroupId);
        const legend = document.createElement('legend');
        const title = subGroupId.replace(/GRP_[A-Z]_/, '').replace(/_/g, ' ');
        legend.innerHTML = title;
        domSubgroup.appendChild(legend);
        this.shadowRoot.querySelector('#' + parentGroup).appendChild(domSubgroup);
        this.log('subgroupId', subGroupId, this.subGroups[subGroupId]);
      }
      resolve(this.DOMGroups);
    });
  }

  _getLabelsFormatted() {
    for (let labelKey of this.SCHEMAFIELDS) {
      const [labelShown, labelCleanId] = this._getLabels(labelKey);
      this.labelsFormatted[labelKey] = {};
      this.labelsFormatted[labelKey].labelShown = labelShown;
      this.labelsFormatted[labelKey].labelCleanId = labelCleanId;
    }
  }

  _getLabels(labelKey) {
    const labelKeyParts = labelKey.split('-');
    const labelShown = labelKeyParts[labelKeyParts.length - 1];
    const labelCleanId = labelShown.replace(/_/g, ' ');
    return [labelShown, labelCleanId];
  }

  _getHTMLTag(labelKey, typeobj) {
    const hasVal = (this.elId && this.data[labelKey]);
    const elVal = (hasVal) ? this.data[labelKey].replace(/"/g, '&#34;') : '';
    const readOnly = this.readonlyFields.includes(labelKey) || this.readonly ? 'readonly' : '';
    let labelCleanId = this.labelsFormatted[labelKey].labelCleanId;
    const labelShown = this.labelsFormatted[labelKey].labelShown;
    let HTMLTag;
    labelCleanId += (this.readonlyFields.includes(labelShown) ? ' [READONLY]' : '');
    if (this.textareaFields.includes(labelKey)) {
      HTMLTag = `
        <paper-textarea rows="3" type="${typeobj}" label="${labelCleanId}" id="${labelKey}" value="${(hasVal) ? elVal : ''}" ${readOnly}>
          <div class="slot" slot="prefix">[${typeobj}]</div>
        </paper-textarea>
      `;
    } else if (this.fileuploadFields.includes(labelKey)) {
      HTMLTag = `
        <firebase-uploadfile id="${labelKey}" name="${labelCleanId}" path="/uploadedFiles" storage-name="NAME,FILENAME" ${(hasVal) ? `value="${elVal}"` : ''} delete-btn="true"></firebase-uploadfile>
      `;
    } else if (this.datepickerFields.includes(labelKey)) {
      HTMLTag = `
        <label for="${labelKey}">${labelCleanId}</label><input type="date" id="${labelKey}" name="${labelCleanId}" ${(hasVal) ? `value="${elVal}"` : ''} />
      `
    } else {
      HTMLTag = `
        <paper-input type="${typeobj}" label="${labelCleanId}" id="${labelKey}" value="${(hasVal) ? elVal : ''}" ${readOnly}></paper-input>
      `;
    }
    return HTMLTag;
  }

  _createCommonHTMLField(labelKey, typeobj, fieldForm) {
    return new Promise(resolve => {
      if (!this.shadowRoot.querySelector('#' + labelKey)) {
        fieldForm.innerHTML += this._getHTMLTag(labelKey, typeobj);
      }
      resolve(fieldForm);
    });
  }

  _createCheckbox(labelKey, containerFieldsGroup) {
    return new Promise(resolve => {
      const hasVal = (this.elId && this.data);
      const elVal = (hasVal) ? this.data[labelKey] : '';
      const checked = (hasVal) ? ((elVal === true) ? 'checked="true"' : '') : '';
      const readOnly = this.readonlyFields.includes(labelKey) || this.readonly ? 'readonly' : '';
      containerFieldsGroup.innerHTML += `
        <div class="chbx-block"><div class="label">${this.labelsFormatted[labelKey].labelCleanId}</div><paper-checkbox label="${labelKey}" id="${labelKey}" ${checked} ${readOnly}"></paper-checkbox></div>
      `;
      resolve(containerFieldsGroup);
    });
  }

  _createBlockInputMultiple(labelKey, typeobj) {
    const parentContainerId = this._getGrpId(labelKey);
    return new Promise(async resolve => {
      const containerFieldsGroup = await this._createContainerFieldsGroup(labelKey);
      this._createInputMultiple(containerFieldsGroup, labelKey, typeobj).then(() => {
        this.shadowRoot.querySelector('#' + parentContainerId).appendChild(containerFieldsGroup);
        if (this._counter[labelKey] >= 1) {
          this.shadowRoot.querySelector('[id^="delLast' + this.labelsFormatted[labelKey].labelShown + '"]').classList.remove('invisible');
        }
        resolve();
      });
    });
  }

  _addBtn(id, label, containerFieldsGroup, labelKey, typeobj, className) {
    const btn = document.createElement('button');
    btn.setAttribute('id', id);
    btn.setAttribute('data-group', labelKey);
    btn.textContent = label;
    btn.setAttribute('typeobj', typeobj);
    btn.setAttribute('class', className);
    containerFieldsGroup.appendChild(btn);
  }

  _createButtonsMultiple(labelKey, containerFieldsGroup, typeobj) {
    const labelCleanId = this.labelsFormatted[labelKey].labelCleanId;
    const labelShown = this.labelsFormatted[labelKey].labelShown;
    this._addBtn('addNew' + labelShown, 'Add new "' + labelCleanId + '"', containerFieldsGroup, labelKey, typeobj, '');
    this._addBtn('delLast' + labelShown, 'Del last "' + labelCleanId + '"', containerFieldsGroup, labelKey, typeobj, 'invisible');
  }

  _createPaperInput(id, typeobj, label, readonly, value) {
    const paperInput = document.createElement('paper-input');
    paperInput.id = id;
    paperInput.type = typeobj;
    paperInput.label = label;
    paperInput.classList.add('inlineblock');
    if (readonly) {
      paperInput.readonly = 'true';
    }
    if (value) {
      paperInput.set('value', value);
    }
    return paperInput;
  }

  _createInputMultiple(containerFieldsGroup, labelKey, typeobj) {
    return new Promise(resolve => {
      this._counter[labelKey] = (!this._counter[labelKey]) ? 0 : this._counter[labelKey]++;
      let id = labelKey + '_' + this._counter[labelKey];
      const readOnly = this.readonlyFields.includes(labelKey) || this.readonly;
      const label = this.labelsFormatted[labelKey].labelCleanId;
      let paperInput;
      if (this.elId) {
        const data = this.data[labelKey]
        if (data) {
          for (let value of data) {
            id = labelKey + '_' + this._counter[labelKey];
            paperInput = this._createPaperInput(id, typeobj, label, readOnly, value);
            paperInput.innerHTML += `<div class="slot" slot="suffix">${(this._counter[labelKey]+1)}</div>`;
            containerFieldsGroup.appendChild(paperInput);
            this._counter[labelKey]++;
          }
          this._counter[labelKey]--;
        } else {
          paperInput = this._createPaperInput(id, typeobj, label, readOnly);
          containerFieldsGroup.appendChild(paperInput);
        }
      } else {
        paperInput = this._createPaperInput(id, typeobj, label, readOnly);
        containerFieldsGroup.appendChild(paperInput);
      }
      this._createButtonsMultiple(labelKey, containerFieldsGroup, typeobj);
      resolve();
    });
  }

  _addNewFormElement(ev) {
    const labelKey = ev.target.dataset.group;
    const typeobj = ev.target.getAttribute('typeobj');
    if (typeobj === 'firebase-autoform') {
      this._addFbAfFromFbAfMultiple(ev, labelKey);
    } else {
      this._addInputFromInputMultiple(ev, labelKey, typeobj);
    }
  }

  _delFormElement(ev) {
    const labelKey = ev.target.dataset.group;
    this._deleteElementFromFieldMultiple(ev, labelKey);
  }

  _getObjectKeysValuesEmpty(obj) {
    return Object.keys(obj).reduce((result, item) => {
      result[item] = '';
      return result;
    }, {});
  }

  _createNewIdInFirebase(path, labelShown) {
    return new Promise((resolve) => {
      const ref = firebase.database().ref(path);
      ref.once('value')
        .then((snap) => {
          const newId = snap.val().length;
          const valuesData = this.VALUESMODELFIELDS[labelShown][0];
          const valueSnap = this._getObjectKeysValuesEmpty(valuesData);
          ref.child(newId).set(valueSnap);
          resolve(newId);
        });
    });
  }

  async _addFbAfFromFbAfMultiple(ev, labelKey) {
    const parentNode = ev.target.parentNode
    const referenceNode = ev.target;  //parentNode.querySelector('#addNewcrítica');
    const labelShown = this.labelsFormatted[labelKey].labelShown;
    const path = parentNode.querySelector('firebase-autoform').path;
    const elId = await this._createNewIdInFirebase(path, labelShown);
    this._counter[labelKey] = elId;
    const id = labelKey + '_' + this._counter[labelKey];
    const groupName = this.labelsFormatted[labelKey].labelCleanId + ((this._counter[labelKey]) ? '_' + this._counter[labelKey] : '');
    if (this._counter[labelKey] >= 1) {
      this.shadowRoot.querySelector('[id^="delLast' + labelShown + '"]').classList.remove('invisible');
    }
    const newNode = this._createFirebaseAutoform(id, elId, path, groupName);
    parentNode.insertBefore(newNode, referenceNode);
  }

  _addInputFromInputMultiple(ev, labelKey, typeobj) {
    const referenceNode = this.shadowRoot.querySelector('#' + labelKey + '_' + this._counter[labelKey]);
    this._counter[labelKey]++;
    const id = labelKey + '_' + this._counter[labelKey];
    if (this._counter[labelKey] >= 1) {
      this.shadowRoot.querySelector('[id^="delLast' + this.labelsFormatted[labelKey].labelShown + '"]').classList.remove('invisible');
    }
    const newNode = this._createPaperInput(id, typeobj, this.labelsFormatted[labelKey].labelCleanId, (this.readonlyFields.includes(labelKey) || this.readonly));
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  _deleteElementFromFieldMultiple(ev, labelKey) {
    if (this._counter[labelKey] > 0) {
      this.shadowRoot.querySelector('#' + labelKey + '_' + this._counter[labelKey]).remove();
      this._counter[labelKey]--;
      if (this._counter[labelKey] === 0) {
        this.shadowRoot.querySelector('[id="delLast' + this.labelsFormatted[labelKey].labelShown + '"]').classList.add('invisible');
      }
      if (this.autoSave) {
        this.save();
      }
    }
  }

  _createMultipleSelect(labelKey, snap) {
    const elId = this.elId || 0;
    const select = document.createElement('select');
    select.id = labelKey;
    select.setAttribute('multiple', 'true');
    snap.forEach((item) => {
      const option = document.createElement('option');
      const itemVal = item.val();
      option.value = itemVal;
      option.innerText = itemVal;
      if (this.data[labelKey]) {
        if (this.data[labelKey].includes(itemVal)) {
          option.setAttribute('selected', 'true');
        }
      }
      select.appendChild(option);
    });
    return select;
  }

  _createBlockMultipleSelect(labelKey, containerFieldsGroup) {
    return new Promise(resolve => {
      const labelShown = this.labelsFormatted[labelKey].labelShown;
      const ref = firebase.database().ref('/model/' + labelShown);
      ref.once('value')
        .then((snap) => {
          if (!this.shadowRoot.querySelector('#' + labelKey)) {
            const label = document.createElement('label');
            label.for = labelShown;
            label.innerText = labelShown;
            const select = this._createMultipleSelect(labelKey, snap);
            containerFieldsGroup.appendChild(label);
            containerFieldsGroup.appendChild(select);
            resolve();
          }
        });
    });
  }

  _insertModelInNewElement(ref, valueSnap, labelShown) {
    const data = {};
    let valuesData;
    if (this.VALUESMODELFIELDS[labelShown].push) {
      valuesData = this.VALUESMODELFIELDS[labelShown][0];
    } else {
      if (this.TYPEMODELFIELDS[labelShown] === 'object') {
        valuesData = this.VALUESMODELFIELDS[labelShown];
      } else {
        valuesData = Object.keys(this.VALUESMODELFIELDS[labelShown]);
      }
    }
    valueSnap = this._getObjectKeysValuesEmpty(valuesData);
    data[0] = valueSnap;
    ref.set(data);
  }

  _createFirebaseAutoform(id, elId, path, groupName) {
    const firebaseAutoform = document.createElement('firebase-autoform');
    firebaseAutoform.innerHTML = `<grp-names>A=${groupName}</grp-names>`;
    firebaseAutoform.setAttribute('id', id);
    firebaseAutoform.setAttribute('path', path);
    firebaseAutoform.setAttribute('el-id', elId);
    firebaseAutoform.setAttribute('is-child', true);
    firebaseAutoform.setAttribute('read-only', this.readonly || false);
    firebaseAutoform.setAttribute('auto-save', this.autoSave || false);
    firebaseAutoform.setAttribute('hide-id', true || false);
    return firebaseAutoform;
  }

  _createFirebaseAutoformChild(labelKey, containerFieldsGroup) {
    this._firebaseAutoformEls.push(labelKey);
    return new Promise(async resolve => {
      if (!this._counter[labelKey]) {
        this._counter[labelKey] = 0;
      }
      const childElId = this._counter[labelKey];
      const elId = this.elId || await this._getNextId();
      const path = this.path + '/' + elId + '/' + labelKey;
      const ref = firebase.database().ref(path);
      const groupName = this.labelsFormatted[labelKey].labelCleanId;
      ref.once('value')
        .then((snap) => {
          const valueSnap = snap.val();
          let idDomAttribute = labelKey;
          if (valueSnap === null || valueSnap === '') {
            if (this.HTMLFields[labelKey] === 'FIREBASE-AUTOFORM MULTIPLE') {
              idDomAttribute += '_' + elId;
            }
            this._insertModelInNewElement(ref, valueSnap, this.labelsFormatted[labelKey].labelShown);
            const firebaseAutoform = this._createFirebaseAutoform(idDomAttribute, childElId, path, groupName);
            containerFieldsGroup.appendChild(firebaseAutoform);
          } else {
            Object.keys(valueSnap).forEach((key) => {
              idDomAttribute = labelKey;
              let grpName = groupName;
              if (this.HTMLFields[labelKey] === 'FIREBASE-AUTOFORM MULTIPLE') {
                idDomAttribute += '_' + key;
                grpName += '_' + key;
              }
              this.log(labelKey, idDomAttribute, grpName);
              const firebaseAutoform = this._createFirebaseAutoform(idDomAttribute, key, path, grpName);
              containerFieldsGroup.appendChild(firebaseAutoform);
              this._counter[labelKey]++;
            });
            this._counter[labelKey]--;
          }
          resolve(containerFieldsGroup);
        });
    });
  }

  _createFirebaseAutoformChildMultiple(labelKey, containerFieldsGroupBase) {
    return new Promise(async (resolve) => {
      this._counter[labelKey] = 0;
      const elId = this.elId || 0;
      const labelShown = this.labelsFormatted[labelKey].labelShown;
      const arrFirebaseAutoformElements = this.data[labelKey];
      const numberFirebaseAutoformElements = arrFirebaseAutoformElements.length;
      const groupId = `${containerFieldsGroupBase.id}_${labelShown}`;
      this.log('Numero de firebase-autoforms: ', numberFirebaseAutoformElements);
      this.log('groupId', groupId);
      const containerFieldsGroup = this.shadowRoot.querySelector('#' + groupId);
      await this._createFirebaseAutoformChild(labelKey, containerFieldsGroup);
      this._createButtonsMultiple(labelKey, containerFieldsGroup, 'firebase-autoform');
      if (this._counter[labelKey] >= 1) {
        this.shadowRoot.querySelector('[id^="delLast' + labelShown + '"]').classList.remove('invisible');
      }
      resolve(containerFieldsGroup);
    });
  }

  _createRichList(labelKey, containerFieldsGroup) {
    return new Promise(resolve => {
      const ref = firebase.database().ref('/model/' + this.labelsFormatted[labelKey].labelShown);
      const richSelectLabel = document.createElement('label');
      const richSelect = document.createElement('rich-select');
      richSelect.id = labelKey;
      richSelect.setAttribute('label', this.labelsFormatted[labelKey].labelCleanId);
      richSelect.setAttribute('search', 'search');
      richSelect.setAttribute('arrow', 'arrow');
      richSelectLabel.innerText = this.labelsFormatted[labelKey].labelCleanId;
      const hasVal = (this.elId && this.data);
      const elVal = (hasVal) ? this.data[labelKey] : '';
      let selectedEl = 0;
      let richOption = document.createElement('rich-option');
      richOption.innerHTML = '';
      richSelect.appendChild(richOption);
      ref.once('value')
        .then((snap) => {
          snap.forEach((item) => {
            let itemVal = item.val();
            richOption = document.createElement('rich-option');
            richOption.innerHTML = itemVal;
            if (itemVal.toLowerCase() === elVal.toLowerCase()) {
              selectedEl = parseInt(item.key) + 1;
            }
            richSelect.appendChild(richOption);
          });
          richSelect.children[selectedEl].selected = true;
          if (!this.shadowRoot.querySelector('#' + labelKey)) {
            containerFieldsGroup.appendChild(richSelectLabel);
            containerFieldsGroup.appendChild(richSelect);
          }
          richSelect.value = elVal;
          if (this.fieldsDesc[labelKey]) {
            this._addEventsTooltip(labelKey);
          }
          resolve(containerFieldsGroup);
        });
    });
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

  async save() {
    if (this.elId) {
      if (this._arrKeys.length) {
        this.saveComplex();
      } else {
        this.saveSimple();
      }
    } else {
      this.elId = await this._getNextId();
      await firebase.database().ref(this.path).child(this.elId).set(this.data);
    }
  }

  saveSimple() {
    const domElelements = this.shadowRoot.querySelectorAll('#formfieldlayer fieldset paper-input');
    let newData = ['string'];
    for (let element of domElelements) {
      newData.push(element.value);
    }
    this.data = newData;
    firebase.database().ref(this.path).set(newData, (error) => {
      console.error(error);
    });
    this._showMsgPopup('Datos guardados correctamente', () => {});
  }

  checkForgottenWords() {
    const groups = this.collapsibleGroups;
    
    groups.forEach((group) => {
      const badWords = [];
      const textToCheck = this.data[`${group}02-descripción`];
      this.forgottenWords.forEach((forgottenWord) => {
        const index = textToCheck.indexOf(forgottenWord);
        if (!!~index) {
          const strTmp = textToCheck.substr(index);
          const indexEnd = strTmp.indexOf(' ');
          const badWord = strTmp.substr(0, indexEnd);
          badWords.push(badWord);
          console.log('encontrado ' + badWord);
        }
      });
      const el = this.shadowRoot.querySelector(`#${group}02-descripción`);
      if (badWords.length > 0) {
        let spanBadWords;
        if (!el.parentNode.querySelector('#BADWORDS_' + group)) {
          el.classList.add('borderRed');
          spanBadWords = document.createElement('span');
          spanBadWords.id = 'BADWORDS_' + group;
          spanBadWords.classList.add('badwords');
          el.parentNode.insertBefore(spanBadWords, el);
        } else {
          spanBadWords = el.parentNode.querySelector('#BADWORDS_' + group)
        }
        spanBadWords.innerHTML = "Usando palabras no permitidas: " + badWords.join(', ');
      } else {
        el.classList.remove('borderRed');
        if (el.parentNode.querySelector('#BADWORDS_' + group)) {
          el.parentNode.querySelector('#BADWORDS_' + group).remove();
        }
      }
    });
  }

  saveComplex() {
    this.data = this._getCurrentDataFromElements();
    this.checkForgottenWords();
    this._saveFirebase();
  }

  _getValueMultiple(el) {
    const paperInputs = Array.from(el.children).filter(el => el.tagName === 'PAPER-INPUT');
    const values = paperInputs.map(el => el.value);
    return values;
  }

  _getElementValue(el) {
    let noPaperTags = ['FIREBASE-UPLOADFILE', 'RICH-SELECT', 'SELECT', 'INPUT', 'FIELDSET'];
    let val = null;
    if (el.tagName === 'PAPER-INPUT' || el.tagName === 'PAPER-TEXTAREA') {
      val = el.$.input.value;
    } else if (el.tagName === 'PAPER-CHECKBOX') {
      val = (!!el.$.checkbox.classList.value.match('checked')) ? true : false;
    } else if (el.tagName === 'SELECT') {
      val = Array.from(el.querySelectorAll('option:checked'), e => e.value);
    } else if (el.tagName === 'FIELDSET') {
      val = this._getValueMultiple(el);
    } else if (el.tagName === 'RICH-SELECT') {
      val = el.chosen.innerText;
    } else {
      val = el.value;
    }
    this.log(el.tagName, val);
    return val;
  }

  _getAllDataGrp(data, key) {
    const cleanKey = key.split('-')[0];
    const els = this.shadowRoot.querySelectorAll(`[id^=${cleanKey}]`);
    data[key] = [];
    for (const [elIndex, element] of els.entries()) {
      const val = element.$ ? (element.$.input) ? element.$.input.value : element.value : element.value;
      data[key][elIndex] = (val) ? val : '';
      this.log(`	${elIndex} = ${val}`);
    }
    if (data[key].length === 0) {
      delete data[key];
    }
    return data;
  }

  _getCurrentDataFromElements() {
    let data = {};
    let result;
    for (const key of this._arrKeys) {
      if (this.HTMLFields[key] === 'FIREBASE-AUTOFORM MULTIPLE') {
        const fbAfNodes = this.shadowRoot.querySelectorAll(`[id^="${key}_"]`);
        const fbAfArray = Array.from(fbAfNodes);
        const fbAfs = fbAfArray.slice(0, fbAfArray.length);
        fbAfs.forEach((fbAf) => {
          result = fbAf._getCurrentDataFromElements();
          data[key] = (Array.isArray(result)) ? result : [result];
        });
      } else if (this.HTMLFields[key] === 'FIREBASE-AUTOFORM') {
        result = this.shadowRoot.querySelector(`#${key}`).data;
        data[key] = (Array.isArray(result)) ? result : [result];
      } else {
        let el = this.shadowRoot.querySelector(`#${key}`);
        if (el) {
          const val = this._getElementValue(el);
          data[key] = (val) ? val : this._resetField(key, val);
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
    bubble.style.top = `${bubbleTop}px`;
    bubble.style.left = `${el.offsetLeft + 150}px`;
    let opacity = 1;
    let idInterval = setInterval(() => {
      const val = parseInt(bubble.style.top) - 2;
      if (val < bubbleTop - offset) {
        clearInterval(idInterval);
      }
      opacity -= 0.05;
      bubble.style.opacity = opacity;
      bubble.style.top = `${val}px`;
    }, 40);
  }

  _getNextId() {
    return new Promise( resolve => {
      firebase.database().ref(this.path).once('value')
        .then(async (snapshot) => {
          const nextId = Object.keys(snapshot.val()).length;
          resolve(nextId);
        });
    });
  }

  async _saveFirebase() {
    const data = this.data;
    this.elId = this.elId || await this._getNextId();
    let nextId = this.elId;
    let callbackFn = (this.elId) ? null : this._cleanFields;
    data.__edit_user = this.user;
    data.__created_at = firebase.database.ServerValue.TIMESTAMP;
    this.data = data;
    if (this.isChild) {
      this.elId = nextId;
    }

    firebase.database().ref(this.path).child(nextId).set(data, (error) => {
      this.log('nextId', nextId);
      this.log('saved data', data);
      if (error) {
        this._showMsgPopup(error.message);
        console.error(error);
      } else {
        if (!this._firebaseAutoformEls.includes(this.fieldChanged)) {
          if (this.fieldChanged !== '') {
            const el = this.shadowRoot.querySelector(`#${this.fieldChanged}`);
            this.fieldChanged = '';
            const bubble = this.shadowRoot.querySelector('#bubbleSaved');
            this._showBubbleFieldMsg(bubble, el);
          } else {
            if (!this.isChild) {
              this._showMsgPopup('Datos guardados correctamente', callbackFn);
            }
            if (this.isChild) {
              this._firebaseAutoformEls.forEach((el) => {
                this.shadowRoot.querySelector(`#${el}`).save();
              });
            }
          }
        } else {
          // this.log('todo guardado');
        }
        document.dispatchEvent(new CustomEvent('firebase-autoform-data-saved', {
          detail: {
            path: this.path,
            id: this.elId,
            data: data
          }
        }));
      }
    });
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