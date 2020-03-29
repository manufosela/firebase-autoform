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
 * FirebaseAutoform v1.8.4
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
        --legend-bg-color: #DDD
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
      .chbx-block { display:flex; margin: 15px 0; }
      .chbx-block .label { font-size: 0.8rem; }
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
      paper-listbox {
        cursor: pointer;
      }
      paper-input, paper-dropdown-menu, high-select {
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
      label {
        display:block;
        font-size: 0.8em;
        font-family: 'Roboto', 'Noto', sans-serif;
      }
      fieldset {
        border: 1px solid var(--fieldset-border-color, #F50);
        border-radius: 20px;
        padding: 20px;
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
      button {
        width: 20px;
        height: 20px;
        margin-top: 30px;
        font-size: 12px;
        font-weight: bold;
        padding: 0;
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
      .tooltip:before {
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
      .tooltip.show {
        opacity: 1;       
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
    this.bLog = false;
    this.bShowPath = false;
    this.loggedUser = '';

    this._setElId = this._setElId.bind(this);
    this._userLogged = this._userLogged.bind(this);
    this._userLogout = this._userLogout.bind(this);
    this._setUploadedFileName = this._setUploadedFileName.bind(this);
    this._showTooltip = this._showTooltip.bind(this);
    this._hideTooltip = this._hideTooltip.bind(this);

    this.tooltip = document.createElement('div');
    this.tooltip.classList.add('tooltip');
  }

  log(msg) {
    if (this.bLog) {
      console.log(msg);
    }
  }

  _setElId(ev) {
    this.elId = ev.detail.id;
  }

  _setUploadedFileName(ev) {
    const name = ev.detail.name;
    this.shadowRoot.querySelector('[name="' + name + '"').value = ev.detail.downloadURL;
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

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('firebase-signin', this._userLogged);
    document.addEventListener('firebase-signout', this._userLogout);
    if (this.elId) {
      document.addEventListener('firebase-autolist-selectid', this._setElId);
    }
    const firebaseAreYouLoggedEvent = new Event('firebase-are-you-logged'); // (2)
    document.dispatchEvent(firebaseAreYouLoggedEvent);

    this.textareaFields = (this.querySelector('textarea-fields')) ? this.querySelector('textarea-fields').innerText.replace(/[\n\s]*/g, '').split(',') : [];
    this.readonlyFields = (this.querySelector('readonly-fields')) ? this.querySelector('readonly-fields').innerText.replace(/[\n\s]*/g, '').split(',') : [];
    this.fileuploadFields = (this.querySelector('fileupload-fields')) ? this.querySelector('fileupload-fields').innerText.replace(/[\n\s]*/g, '').split(',') : [];
    if (this.fileuploadFields.length > 0) {
      document.addEventListener('firebase-file-storage-uploaded', this._setUploadedFileName);
    }
    const grpNames = (this.querySelector('grp-names')) ? this.querySelector('grp-names').innerText.replace(/[\n\s]*/g, '').split(',') : [];
    this.grpNames = {};
    for (let el of grpNames) {
      const parts = el.split('=');
      this.grpNames['GRP_' + parts[0]] = parts[1];
    }

    this.fieldsDesc = this._getFieldDesc();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('firebase-signin', this._userLogged);
    document.removeEventListener('firebase-signout', this._userLogout);
    document.removeEventListener('firebase-autolist-selectid', this._setElId);
    document.removeEventListener('firebase-file-storage-uploaded', this._setUploadedFileName);
    for (let field in this.fieldsDesc) {
      if (this.fieldsDesc.hasOwnProperty(field)) {
        const el = this.shadowRoot.querySelector(`#${field}`);
        el.removeEventListener('click', this._showTooltip);
        el.removeEventListener('mouseover', this._showTooltip);
        el.removeEventListener('mouseout', this._hideTooltip);
      }
    }
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'elId' && this.elId !== oldValue && oldValue !== undefined) {
        this.getData();
      }
    });
  }

  _userLogged(obj) {
    if (!this.user && obj.detail.user) {
      this.user = obj.detail.user.displayName;
      this.dataUser = obj.detail.user;
      this.getData();
    }
  }

  _userLogout() {
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
    this.tooltip.style.top = target.offsetTop + 'px';
    this.tooltip.style.left = 'calc(var(--fields-max-width) + 100px)';
    if (options.content) {
      this.tooltip.innerText = options.content;
    }
    target.parentNode.appendChild(this.tooltip);
  }

  _showTooltip(ev) {
    this.tooltip.classList.add('show');
    this._tooltip(ev.target, {
      content: this.fieldsDesc[ev.target.id]
    });
  }

  _hideTooltip(ev) {
    this.tooltip.classList.remove('show');
  }

  _insertTooltips() {
    const paperInputs = this.shadowRoot.querySelectorAll('paper-input');
    for (let field in this.fieldsDesc) {
      if (this.fieldsDesc.hasOwnProperty(field)) {
        const el = this.shadowRoot.querySelector(`#${field}`);
        el.addEventListener('click', this._showTooltip);
        el.addEventListener('mouseover', this._showTooltip);
        el.addEventListener('mouseout', this._hideTooltip);
      }
    }
  }

  getData() {
    let starredStatusRef = firebase.database().ref(this.path);
    starredStatusRef.on('value', (snapshot) => {
      this.data = snapshot.val();
      this._analizeFields().then(resolve => {
        return new Promise(r => {
          this._insertFields(this.data[0]);
          this.shadowRoot.querySelector('#spinner').active = false;
          if (this.elId) {
            this._insertLegends();
            this._insertTooltips();
            document.dispatchEvent(new CustomEvent('firebase-autoform-ready', {
              detail: {
                path: this.path,
                id: this.elId,
                obj: this
              }
            }));
          }
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
    const c = this._createFormGroup('loggedUser');
    const loggedUser = (this.loggedUser !== '') ? this.loggedUser : 'logged-user';
    const user = this._getLoggedUser();
    const cssClass = (this.loggedUser !== '') ? '' : 'class="hidden"';
    c.innerHTML += `
        <paper-input type="text" label="${loggedUser}" id="__edit_user" readonly value="${user}" ${cssClass}></paper-input>
      `;
    if (!this.shadowRoot.querySelector('#__edit_user')) {
      this.shadowRoot.querySelector('#formfieldlayer').appendChild(c);
    }
  }

  _insertFields(obj) {
    this._cleanError();
    this._arrKeys = [];
    this._insertLoggedUser(obj);
    for (let keyObj in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, keyObj)) {
        this._arrKeys.push(keyObj);
        if (keyObj !== '__edit_user' && keyObj !== '__created_at') {
          const fieldForm = this._getFieldForm(obj[keyObj], keyObj);
          if (fieldForm) {
            this.shadowRoot.querySelector('#formfieldlayer').appendChild(fieldForm);
          }
        }
      }
    }
  }

  _getFieldForm(propField, labelKey) {
    let fieldForm;
    if (typeof propField === 'object' && this._parentKeys.includes(labelKey)) {
      this.log('multifield multiple ' + labelKey);
      fieldForm = this._createFormGroup(labelKey);
      this._createListMult(labelKey, fieldForm);
    } else if (this._parentKeys.includes(labelKey)) {
      fieldForm = this._createFormGroup(labelKey);
      this._createHighList(labelKey, fieldForm);
      this.log('list ' + labelKey);
    } else if (typeof propField === 'object') {
      fieldForm = this._createMF(labelKey, typeof propField[0]);
      this.log('Multifield ' + labelKey);
    } else if (propField === true || propField === false) {
      fieldForm = this._createCheckbox(labelKey);
      this.log('checkbox ' + labelKey);
    } else if (typeof propField === 'string' || typeof propField === 'number') {
      fieldForm = this._createField(labelKey, typeof propField);
      this.log('input ' + labelKey);
    }
    return fieldForm;
  }

  _getGrpId(labelKey) {
    let grpId;
    const partsId = labelKey.split('-');
    if (partsId.length > 1) {
      if (!!~labelKey.search(/_[0-9]*$/)) {
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
    const grpId = this._getGrpId(labelKey);
    let formGroupLayer = this.shadowRoot.querySelector(`#${grpId}`);
    if (!formGroupLayer) {
      formGroupLayer = (labelKey !== 'loggedUser') ? document.createElement('fieldset') : formGroupLayer = document.createElement('div');
      formGroupLayer.id = grpId;
      formGroupLayer.className = (style === 'flex') ? 'formGroupFlex' : 'formGroup';
    }
    return formGroupLayer;
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
        <firebase-uploadfile id="${labelId}" name="${labelCleanId}" path="/uploadedFiles" storage-name="NAME,FILENAME" ${(hasVal) ? `value="${elVal}"` : ''}></firebase-uploadfile>
      `;
    } else {
      HTMLTag = `
        <paper-input type="${typeobj}" label="${labelCleanId}" id="${labelId}" value="${(hasVal) ? elVal : ''}" ${readOnly} title="PROBANDO ESTA MIERDA">
          <div class="slot" slot="prefix">[${typeobj}]</div>
        </paper-input>
      `;
    }
    return HTMLTag;
  }

  _createField(labelId, typeobj) {
    const c = this._createFormGroup(labelId);
    if (!this.shadowRoot.querySelector('#' + labelId)) {
      c.innerHTML += this._getHTMLTag(labelId, typeobj);
    }
    return c;
  }

  _createCheckbox(labelId) {
    const c = this._createFormGroup(labelId);
    const [labelShown, labelCleanId] = this._getLabels(labelId);
    const hasVal = (this.elId && this.data[this.elId]);
    const elVal = (hasVal) ? this.data[this.elId][labelId] : '';
    const checked = (hasVal) ? ((elVal === true) ? 'checked="true"' : '') : '';
    const label = labelId.replace(/_/g, ' ');
    const readOnly = this.readonlyFields.includes(labelId) || this.readonly ? 'readonly' : '';
    c.innerHTML += `
      <div class="chbx-block"><div class="label">${labelCleanId}</div><paper-checkbox label="${labelId}" id="${labelId}" ${checked} ${readOnly}"></paper-checkbox></div>
    `;
    return c;
  }

  _createMF(labelId, typeobj) {
    const c = this._createFormGroup(labelId);
    this._createMultiField(c, labelId, typeobj);
    return c;
  }

  _createMultiField(container, labelId, typeobj) {
    const c = this._createFormGroup(labelId);
    this._counter[labelId] = (!this._counter[labelId]) ? 0 : this._counter[labelId]++;

    const id = labelId + '_' + this._counter[labelId];
    const readOnly = this.readonlyFields.includes(labelId) || this.readonly ? 'readonly' : '';
    c.innerHTML += `
      <paper-input type="${typeobj}" label="${labelId}" id="${id}" class="inlineblock" ${readOnly}>
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
    const c = this._createFormGroup(labelId);
    if (!this.shadowRoot.querySelector('#' + labelId)) {
      const id = labelId + '_' + this._counter[labelId];
      const readOnly = this.readonlyFields.includes(labelId) || this.readonly ? 'readonly' : '';
      c.innerHTML += `
        <paper-input type="${typeobj}" label="${labelId}" id="${id}" class="inlineblock" ${readOnly}>
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
              const id = labelId + '_' + index;
              const container = (index === 0) ? this._createFormGroup(id, 'flex') : this._createFormGroup(id);
              const paperDropdownMenu = this._createPaperDropDownElement(id, labelId);
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
              this._counter[labelId] = index;
            });
          } else {
            const id = labelId + '_' + this._counter[labelId];
            const container = this._createFormGroup(id, 'flex');
            const paperDropdownMenu = this._createPaperDropDownElement(id, labelId);
            const paperListbox = this._createPaperListBox(snap);
            paperDropdownMenu.appendChild(paperListbox);
            container.appendChild(paperDropdownMenu);
            if (this._counter[labelId] === 0) {
              this._addPlusButton(id, container);
            }
            if (!this.shadowRoot.querySelector('#' + labelId)) {
              formGroup.appendChild(container);
            }
            this._counter[labelId]++;
          }
        }
      });
  }

  _addPlusButton(id, container) {
    let addButton = this.shadowRoot.querySelector(`#${id}`);
    if (!addButton) {
      addButton = document.createElement('button');
      addButton.id = 'btn_' + id;
      addButton.innerHTML = '+';
      addButton.addEventListener('click', this._newListMult.bind(this));
      container.appendChild(addButton);
    }
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

  _createPaperDropDownElement(id, labelId) {
    let paperDropdownMenu = this.shadowRoot.querySelector(`#${id}`);
    if (!paperDropdownMenu) {
      paperDropdownMenu = document.createElement('paper-dropdown-menu');
      paperDropdownMenu.id = id;
      const [labelShown, labelCleanId] = this._getLabels(labelId);
      paperDropdownMenu.label = labelCleanId;
    }
    return paperDropdownMenu;
  }

  _createPaperListBoxElement() {
    const paperListbox = document.createElement('paper-listbox');
    paperListbox.slot = 'dropdown-content';
    paperListbox.className = 'dropdown-content';
    return paperListbox;
  }

  _newListMult(ev, o) {
    let labelId = ev.target.id.replace(/^btn_/, '');
    labelId = labelId.replace(/_\d*$/, '');
    const formGroup = ev.target.parentNode.parentNode;
    this._counter[labelId]++;
    const id = labelId + '_' + this._counter[labelId];
    const ref = firebase.database().ref('/' + labelId);
    const paperDropdownMenu = this._createPaperDropDownElement(id, labelId);
    const paperListbox = this._createPaperListBoxElement();
    const container = this._createFormGroup(labelId);
    ref.once('value')
      .then((snap) => {
        snap.forEach((item) => {
          const itemVal = item.val();
          const paperItem = document.createElement('paper-item');
          paperItem.innerHTML = itemVal;
          paperListbox.appendChild(paperItem);
        });
        if (!this.shadowRoot.querySelector('#' + labelId)) {
          paperDropdownMenu.appendChild(paperListbox);
          let c = this._createFormGroup(labelId);
          this._counter[labelId] = (!this._counter[labelId]) ? 0 : this._counter[labelId]++;
          container.appendChild(paperDropdownMenu);
          formGroup.appendChild(container);
        }
      });
  }

  _createHighList(labelId, formGroup) {
    const ref = firebase.database().ref('/' + labelId);
    const highSelectLabel = document.createElement('label');
    const highSelect = document.createElement('high-select');
    highSelect.id = labelId;
    const [labelShown, labelCleanId] = this._getLabels(labelId);
    highSelect.setAttribute('label', labelCleanId);
    highSelect.setAttribute('search', 'search');
    highSelect.setAttribute('arrow', 'arrow');
    highSelectLabel.innerText = labelCleanId;
    const hasVal = (this.elId && this.data[this.elId]);
    const elVal = (hasVal) ? this.data[this.elId][labelId] : '';
    const highOption = document.createElement('high-option');
    highOption.innerHTML = '';
    highSelect.appendChild(highOption);
    ref.once('value')
      .then((snap) => {
        snap.forEach((item) => {
          let itemVal = item.val();
          const highOption = document.createElement('high-option');
          highOption.innerHTML = itemVal;
          if (itemVal === elVal) {
            highOption.selected = 'selected';
          }
          highSelect.appendChild(highOption);
        });
        if (!this.shadowRoot.querySelector('#' + labelId)) {
          formGroup.appendChild(highSelectLabel);
          formGroup.appendChild(highSelect);
          highSelect.value = elVal;
        }
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
    const el = this.shadowRoot.querySelector('#' + this.path.replace('/', ''));
    const val = el.$.input.value || '';
    const nextId = parseInt(Object.keys(this.data).pop()) + 1;
    const newId = firebase.database().ref().child(this.path).push().key;
    const updates = {};
    updates[this.path + '/' + newId] = this.data[nextId];
    firebase.database().ref().update(updates);
    this.data[nextId] = val;
    this.log(nextId, newId);
    this.log(val);
    this._showMsgPopup('Datos guardados correctamente', this._cleanFields.bind(this));
  }

  saveComplex() {
    const data = this._tourElements();
    this._saveFirebase(data);
  }
  _getVal(el) {
    let noPaperTags = ['FIREBASE-UPLOADFILE', 'HIGH-SELECT'];
    let val = (noPaperTags.includes(el.tagName)) ? el.value : (el.$.input) ? el.$.input.value : el.value;
    if (el.tagName === 'PAPER-CHECKBOX') {
      val = (val === 'on') ? true : false;
    }
    return val;
  }

  _tourElements() {
    let data = {};
    for (let i = 0; i < this._arrKeys.length; i++) {
      let el = this.shadowRoot.querySelector('#' + this._arrKeys[i]);
      if (el) {
        const val = this._getVal(el);
        data[this._arrKeys[i]] = (val) ? val : '';
      } else {
        const key = this._arrKeys[i].split('-')[0];
        const els = this.shadowRoot.querySelectorAll('[id^=' + key + ']');
        data[this._arrKeys[i]] = [];
        for (let j = 0; j < els.length; j++) {
          el = els[j];
          const val = el.$ ? (el.$.input) ? el.$.input.value : el.value : el.value;
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

  _saveFirebase(data) {
    if (Object.keys(data).length !== 0) {
      let nextId = this.elId || parseInt(Object.keys(this.data).pop()) + 1;
      let callbackFn = (this.elId) ? null : this._cleanFields.bind(this);
      data.__edit_user = this.user;
      data.__created_at = firebase.database.ServerValue.TIMESTAMP;
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
    const path = this.path.split('/');
    return html `
      ${this.dataUser !== null ? html` 
        <h3 class='path'>
          ${(this.bShowPath) ? html`${path[path.length - 1]} ID: ` : html``} 
          <span class="id">
            ${this.elId ? html`${this.elId}` : html``}
          </span>
          <paper-spinner id="spinner" class="blue" active></paper-spinner>
        </h3>
        <div class="container">
          <section>
            <div id="formfieldlayer"></div>    
            ${this.readonly ? html`` : (this.data) !== undefined ? html`<paper-button class="save" raised @click="${this.save}">${(this.elId) ? html`Update [ID ${this.elId}]` : html`Insert new element`}</paper-button>` : html``}
            <paper-dialog id="mensaje_popup"></paper-dialog>
          </section>
        </div>
      ` : html`<div class="waiting">Waiting for login...</div>`}
    `;
  }
}

window.customElements.define(FirebaseAutoform.is, FirebaseAutoform);