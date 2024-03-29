/* eslint-disable no-loop-func */
/* eslint-disable no-bitwise */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import { html, LitElement } from 'lit';
import {
  getDatabase,
  ref,
  onValue,
  set,
  update,
  connectDatabaseEmulator,
  serverTimestamp,
} from 'firebase/database'; // get, child, push,
import { firebaseAutoformStyles } from './FirebaseAutoformStyles.js';

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
 * FirebaseAutoform v3.0.0
 *
 * @customElement firebase-autoform
 * @lit
 * @demo demo/index.html
 */
export class FirebaseAutoform extends LitElement {
  static get styles() {
    return [firebaseAutoformStyles];
  }

  static get is() {
    return 'firebase-autoform';
  }

  static get properties() {
    return {
      path: {
        type: String,
      },
      waitingMsg: {
        type: String,
        attribute: 'wating-msg',
      },
      elementSelectedId: {
        type: String,
        attribute: 'el-id',
      },
      loginId: {
        type: String,
        attribute:
          'login-id' /* Reference id from firebase-loginbutton to listen events */,
      },
      emulation: {
        type: Boolean,
        attribute: 'emulation',
        reflect: true,
      },
      listen: {
        type: String,
      },
      isChild: {
        type: Boolean,
        attribute: 'is-child',
      },
      readonly: {
        type: Boolean,
      },
      loggedUser: {
        type: String,
        attribute: 'logged-user',
      },
      readonlyFields: {
        type: Array,
      },
      textareaFields: {
        type: Array,
      },
      fileuploadFields: {
        type: Array,
      },
      datepickerFields: {
        type: Array,
      },
      filterFields: {
        type: Array,
      },
      autoSave: {
        type: Boolean,
        attribute: 'auto-save',
      },
      data: {
        type: Object,
      },
      userData: {
        type: Object,
      },
      bLog: {
        type: Boolean,
      },
      bShowPath: {
        type: Boolean,
        attribute: 'show-path',
      },
      bHideId: {
        type: Boolean,
        attribute: 'hide-id',
      },
      uploadedFilesPath: {
        type: String,
        attribute: 'files-path',
      },
      notInitialized: {
        type: Boolean,
      },
    };
  }

  constructor() {
    super();
    this.path = '/';

    this.isChild = false;
    this.elementSelectedId =
      null; /* Atributo id del elemento de la bbdd seleccionado para cargar con firebase-autoform */
    this.listen =
      null; /* Id del componente firebase-autolist del que escuchar el evento firebase-autolist-selectid */
    this.data = null;
    this.userData = null;
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
    this.executed = 1;
    this.initialized = false;

    this.groups = {};
    this.DOMGroups = {};
    this.subGroups = {};
    this.noGroups = [
      'GRP___created_at',
      'GRP___edit_user',
      'GRP___revised',
      'GRP___autorevised',
    ];
    this.__FIELDS = [
      '__edit_user',
      '__created_at',
      '__revised',
      '__autorevised',
    ];
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
      'array-array of objects': 'FIREBASE-AUTOFORM MULTIPLE',
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

    this._addNewFormElement = this._addNewFormElement.bind(this);
    this._delFormElement = this._delFormElement.bind(this);
    this._cleanFields = this._cleanFields.bind(this);

    this._wcReady = this._wcReady.bind(this);
    this._firebaseLogin = this._firebaseLogin.bind(this);
    this._firebaseLogout = this._firebaseLogout.bind(this);
  }

  firstUpdated() {
    if (super.firstUpdated) super.firstUpdated();
    if (!this.initialized) {
      document.dispatchEvent(
        new CustomEvent('are-it-logged-into-firebase', {
          detail: {
            id: this.loginId,
          },
        })
      );
    }
  }

  consoleLog(...msg) {
    if (this.bLog) {
      this.consoleLog(msg);
    }
  }

  _setElId_(ev) {
    const id = ev.detail.objId;
    if (this.listen === null || this.listen === id) {
      this.elementSelectedId = ev.detail.id;
    }
  }

  _setUploadedFileName_(ev) {
    const { name } = ev.detail;
    const { id } = ev.detail;
    if (this.id === id) {
      this.shadowRoot.querySelector(`[name="${name}"`).value =
        ev.detail.downloadURL;
    }
  }

  _insertKeysModel(keysModel) {
    function turron(b, index = 0, obj = {}) {
      if (index === b.length - 1) {
        obj[b[index]] = '';
      } else {
        obj[b[index]] = [];
        obj[b[index]][0] = turron(b, index + 1);
      }
      return obj;
    }
    let { data } = this;
    for (const key of keysModel) {
      const b = key.split('.');
      const j = turron(b);
      this.consoleLog('_insertKeysModel', key, j);
      data = Object.assign(data, j);
    }
    return data;
  }

  async _completeModel(d = this.data) {
    const data = Array.isArray(d) ? d[0] : d;
    // let keys = this._keyfy(data, parentKey);
    // let cleanKeys = keys.map(key => key.replace(/^.*[A-Z]\d*-/, ''));
    const keys = Object.keys(data);
    const cleanKeys = keys.map(key => key.replace(/^.*[A-Z]\d*-/, ''));
    const keysInModel = this._intersectArrays(cleanKeys, this.MODELFIELDS);
    for (let i = 0; i < cleanKeys.length; i += 1) {
      const key = cleanKeys[i];
      let tmpData = '';
      let tmpModelData;
      if (
        keysInModel.includes(key) &&
        (this.TYPEMODELFIELDS[key] === 'array of objects' ||
          this.TYPEMODELFIELDS[key] === 'object')
      ) {
        tmpModelData = await this._getDataPath(`/model/${key}`);
        tmpData = await this._completeModel(tmpModelData);
        tmpData = await this._resetAllFields(tmpData);
        data[keys[i]] = Array.isArray(d) ? tmpData : [tmpData];
      } else {
        data[keys[i]] = this._resetField(key, data[keys[i]]);
      }
    }
    return data;
  }

  _intersectArrays(a, b) {
    this._null = null;
    if (b.length > a.length) {
      [b, a] = [a, b];
    }
    return a
      .filter(e => b.indexOf(e) > -1)
      .filter((e, i, c) => c.indexOf(e) === i); // remove duplicates
  }

  _keyfy(obj, prefix = '') {
    return Object.keys(obj).reduce((res, el) => {
      if (typeof obj[el][0] === 'object') {
        return [...res, ...this._keyfy(obj[el][0], `${prefix + el}.`)];
      }
      if (Array.isArray(obj[el])) {
        return [...res, prefix !== '' ? prefix + el : el];
      }
      if (typeof obj[el] === 'object' && obj[el] !== null) {
        return [...res, ...this._keyfy(obj[el], `${prefix + el}.`)];
      }
      return [...res, prefix + el];
    }, []);
  }

  _getFieldDesc() {
    const fieldsDesc = {};
    const fieldsDescDOM = this.querySelectorAll('description-field')
      ? this.querySelectorAll('description-field')
      : [];
    for (const fieldDesc of fieldsDescDOM) {
      const fieldDescParts = fieldDesc.innerHTML.split('$=');
      const repeatedFields = fieldDescParts[0].split('|');
      for (const field of repeatedFields) {
        fieldsDesc[field] = fieldDescParts[1];
      }
    }
    return fieldsDesc;
  }

  _getCollapsibleGroups() {
    const fieldsCollapGrpDOM = this.querySelector('grp-collapsible')
      ? this.querySelector('grp-collapsible').innerText.replace(/[\n\s]*/g, '')
      : null;
    return fieldsCollapGrpDOM ? fieldsCollapGrpDOM.split(',') : [];
  }

  _getFilterFields() {
    const filterFieldsDOM = this.querySelector('filter-fields')
      ? this.querySelector('filter-fields').innerText.replace(/[\n\s]*/g, '')
      : null;
    const filterFields = filterFieldsDOM ? filterFieldsDOM.split(',') : [];
    return filterFields;
  }

  connectedCallback() {
    if (super.connectedCallback) super.connectedCallback();
    document.addEventListener('firebase-signin', this.init);
    document.addEventListener('firebase-signout', this.finish);
    document.addEventListener('firebase-autolist-selectid', this._setElId_);
    const firebaseAreYouLoggedEvent = new Event('firebase-are-you-logged'); // (2)
    document.dispatchEvent(firebaseAreYouLoggedEvent);

    this.forgottenWords = this.querySelector('forgotten-words')
      ? this.querySelector('forgotten-words')
          .innerText.replace(/[\n\s]*/g, '')
          .split(',')
      : [];
    this.textareaFields = this.querySelector('textarea-fields')
      ? this.querySelector('textarea-fields')
          .innerText.replace(/[\n\s]*/g, '')
          .split(',')
      : [];
    this.readonlyFields = this.querySelector('readonly-fields')
      ? this.querySelector('readonly-fields')
          .innerText.replace(/[\n\s]*/g, '')
          .split(',')
      : [];
    this.datepickerFields = this.querySelector('date-picker')
      ? this.querySelector('date-picker')
          .innerText.replace(/[\n\s]*/g, '')
          .split(',')
      : [];
    this.fileuploadFields = this.querySelector('fileupload-fields')
      ? this.querySelector('fileupload-fields')
          .innerText.replace(/[\n\s]*/g, '')
          .split(',')
      : [];
    if (this.fileuploadFields.length > 0) {
      document.addEventListener(
        'firebase-file-storage-uploaded',
        this._setUploadedFileName_
      );
    }
    const grpNames = this.querySelector('grp-names')
      ? this.querySelector('grp-names')
          .innerText.replace(/[\n\s]*/g, '')
          .split(',')
      : [];
    this.grpNames = {};
    for (const el of grpNames) {
      const parts = el.split('=');
      this.grpNames[`GRP_${parts[0]}`] = parts[1];
    }

    this.fieldsDesc = this._getFieldDesc();
    this.collapsibleGroups = this._getCollapsibleGroups();
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) super.disconnectedCallback();
    document.removeEventListener('firebase-signin', this.init);
    document.removeEventListener('firebase-signout', this.finish);
    document.removeEventListener('firebase-autolist-selectid', this._setElId_);
    document.removeEventListener(
      'firebase-file-storage-uploaded',
      this._setUploadedFileName_
    );
  }

  updated(changedProperties) {
    changedProperties.forEach(async (oldValue, propName) => {
      if (
        (propName === 'elementSelectedId' || propName === 'path') &&
        this.elementSelectedId !== oldValue &&
        oldValue !== undefined
      ) {
        this.data = await this.getDataId();
        await this._processData();
        this._allIsReady();
      }
    });
    // this.shadowRoot.querySelector('#spinner').active = false;
  }

  _allIsReady() {
    document.dispatchEvent(
      new CustomEvent('firebase-autoform-ready', {
        detail: {
          path: this.path,
          id: this.elementSelectedId,
          obj: this,
        },
      })
    );
  }

  _firebaseLogin(event) {
    const refId = event.detail.id;
    if (refId === this.loginId) {
      this.firebaseApp = event.detail.firebaseApp;
      this.db = getDatabase(this.firebaseApp);
      this.userData = event.detail.user;
      if (this.emulation) {
        connectDatabaseEmulator(this.db);
      }
      this.storage = event.detail.firebaseStorage;
      this.consoleLog(
        '_firebaseLogin',
        this.firebaseApp,
        this.db,
        this.userData,
        this.storage
      );
      this._wcReady();
      return true;
    }
    return false;
  }

  _firebaseLogout() {
    this.firebaseApp = null;
    this.db = null;
    this.userDisplayNameData = null;
    this.storage = null;
  }

  _wcReady() {
    const componentCreatedEvent = new CustomEvent('wc-ready', {
      detail: {
        id: this.id,
        componentName: this.tagName,
        component: this,
      },
    });
    document.dispatchEvent(componentCreatedEvent);
  }

  /* INIT METHOD */
  async init(obj) {
    if (this._firebaseLogin(obj) && !this.initialized) {
      this.initialized = true;
      this.userDisplayName = this.userData.displayName;
      if (this.elementSelectedId && !this.data) {
        /* UPDATE */
        this.data = await this.getDataId();
        await this._processData();
      } else {
        /* INSERT */
        this.data = await this._getDataPath(`${this.path}/0`);
        await this._analizeFields();
        this.data = await this._completeModel();
      }
      this._wcReady();
    } else {
      this.consoleLog('No hay usuario ni vienen datos de usuario');
    }
  }

  finish() {
    this.userData = null;
    this.data = null;
  }

  _insertLegends() {
    return new Promise(resolve => {
      const containerFieldsGroups = [
        ...this.shadowRoot.querySelectorAll('#formfieldlayer > fieldset'),
        ...this.shadowRoot.querySelectorAll(
          '#formfieldlayer > fieldset > fieldset'
        ),
      ];
      for (const frmG of containerFieldsGroups) {
        const grpId = frmG.id;
        const legend = document.createElement('legend');
        let legendText = this.grpNames[grpId];
        if (!legendText) {
          legendText = this.labelsFormatted[grpId]
            ? this.labelsFormatted[grpId].labelCleanId
            : '';
        }
        legend.innerText = legendText;

        if (legendText !== '') {
          frmG.appendChild(legend);
        }
      }
      resolve();
    });
  }

  _toggleCollapse(ev) {
    this._null = null;
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
      fieldSets = Array.from(fieldSets).filter(
        el => el.id.split('_').length === 2 && el.id.match(/^GRP_/)
      );
      for (const fieldSet of fieldSets) {
        const letter = fieldSet.id.split('_')[1];
        if (this.collapsibleGroups.includes(letter)) {
          fieldSet.classList.add('collapsed');
          const legend = fieldSet.parentElement.querySelector(
            `#${fieldSet.id} > legend`
          );
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
    arrBtnAdd.forEach(btn => {
      btn.addEventListener('click', this._addNewFormElement);
    });
    const arrBtnDel = this.shadowRoot.querySelectorAll('[id^="delLast"]');
    arrBtnDel.forEach(btn => {
      btn.addEventListener('click', this._delFormElement);
    });
  }

  _autoSaveEvents() {
    for (const key of this._arrKeys) {
      const domElement = this.shadowRoot.querySelector(`#${key}`);
      if (domElement && !this._firebaseAutoformEls.includes(key)) {
        const event =
          domElement.tagName === 'PAPER-TEXTAREA' ? 'blur' : 'change';
        domElement.addEventListener(event, ev => {
          this.fieldChanged = ev.target.id;
          this.save();
        });
        domElement.addEventListener('focus', ev => {
          let pNode = ev.target.parentNode;
          pNode = pNode.id === '' ? pNode.parentNode : pNode;
          if (pNode.classList.toString().includes('collapsed')) {
            pNode.classList.remove('collapsed');
          }
        });
      }
    }
  }

  _idExits() {
    const included = this.data.includes
      ? this.data.includes(this.elementSelectedId)
      : Object.keys(this.data).includes(this.elementSelectedId);
    return this.elementSelectedId && included;
  }

  async _completeView() {
    this.shadowRoot.querySelector('#spinner').active = false;
    await this._insertLegends();
    await this._makeCollapsibleGrps();
    this._addBtnEvents();
    if (this.autoSave) {
      this._autoSaveEvents();
      this.shadowRoot
        .querySelector('#bubbleSaved')
        .classList.remove('invisible');
    }
    this.consoleLog('insertFields finish');
  }

  _resetField(key, value) {
    if (
      typeof value === 'boolean' ||
      this.TYPESCHEMAFIELDS[key] === 'boolean'
    ) {
      value = false;
    } else if (
      typeof value === 'number' ||
      this.TYPESCHEMAFIELDS[key] === 'number'
    ) {
      value = 0;
    } else if (
      typeof value === 'string' ||
      this.TYPESCHEMAFIELDS[key] === 'string'
    ) {
      value = '';
    }
    return value;
  }

  _resetAllFields(d = this.data) {
    const data = Array.isArray(d) ? d[0] : d;
    return new Promise(resolve => {
      Object.keys(data).forEach(key => {
        data[key] = this._resetField(key, data[key]);
      });
      resolve(d);
    });
  }

  _getDataPath(path = this.path) {
    return new Promise(resolve => {
      const refDb = ref(this.db, path);
      onValue(refDb, snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          resolve(data);
        } else {
          this.shadowRoot.querySelector('#spinner').active = false;
          this.shadowRoot.querySelector(
            '#formfieldlayer'
          ).innerHTML = `<h1>ERROR1 in getDataPath</h1>`;
          throw new Error(`ERROR1 in getDataPath '${path}'`);
        }
      });
    });
  }

  async getDataId(id = this.elementSelectedId) {
    const path = `${this.path}/${id}`;
    const data = await this._getDataPath(path);
    if (data) {
      return data;
    }
    const msg = `ID >${id}< not found in path ${path}`;
    this.shadowRoot.querySelector('#spinner').active = false;
    this.shadowRoot.querySelector(
      '#formfieldlayer'
    ).innerHTML = `<h1>ERROR2 in getDataId</h1>${msg}`;
    return msg;
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
    this._null = null;
    let typeVal = typeof val;
    if (val.push) {
      typeVal = typeof val[0] === 'object' ? 'array of objects' : 'array';
    }
    return typeVal;
  }

  _getModels() {
    return new Promise(resolve => {
      const refDb = ref(this.db, '/model');
      onValue(refDb, snapshot => {
        if (snapshot.exists()) {
          snapshot.forEach(item => {
            const itemVal = item.val();
            const itemKey = item.key;
            const typeVal = this._getArrayOrObject(itemVal);
            this.consoleLog(itemKey, typeVal);
            this.MODELFIELDS.push(itemKey);
            this.VALUESMODELFIELDS[itemKey] = itemVal;
            this.TYPEMODELFIELDS[itemKey] = typeVal;
          });
          resolve();
        } else {
          throw new Error(`ERROR4 in getModels`);
        }
      });
    });
  }

  _getFieldsSchema() {
    this.consoleLog('_getFieldsSchema from ', this.id);
    return new Promise(resolve => {
      const schema = this.data;
      Object.keys(schema).forEach(key => {
        if (Object.prototype.hasOwnProperty.call(schema, key)) {
          this.consoleLog('field ', key, typeof schema[key]);
          this.SCHEMAFIELDS.push(key);
          const typeschemafield = schema[key].push
            ? 'array'
            : typeof schema[key];
          this.TYPESCHEMAFIELDS[key] = typeschemafield;
        }
      });
      resolve();
    });
  }

  async _getAllGroups() {
    await this._getGroups();
    await this._getGroupsMultiples();
  }

  async _createContainers() {
    await this._createContainerFieldsGroups();
    await this._createContainerFieldsGroupsMultiples();
  }

  async _analizeFields() {
    await this._getModels();
    await this._getFieldsSchema();
    this._getLabelsFormatted();
    await this._getSelectFieldsType();
  }

  _getGroups() {
    return new Promise(resolve => {
      const groups = new Set();
      for (const labelKey of this.SCHEMAFIELDS) {
        const grpId = this._getGrpId(labelKey);
        groups.add(grpId);
      }
      this.groups = Array.from(groups);
      this.consoleLog('groups: ', this.groups);
      resolve();
    });
  }

  _getGroupsMultiples() {
    return new Promise(resolve => {
      const keys = Object.keys(this.HTMLFields);
      const keysFBAFMult = Object.values(this.HTMLFields)
        .map((val, index) => {
          if (val === 'FIREBASE-AUTOFORM MULTIPLE') {
            return keys[index];
          }
          return undefined;
        })
        .filter(val => val !== undefined);

      for (const labelKey of keysFBAFMult) {
        const arrFirebaseAutoformElements = this.data[labelKey];
        const numberFirebaseAutoformElements =
          arrFirebaseAutoformElements.length;
        const grpId = this._getGrpId(labelKey);
        const groupId = `${grpId}_${this.labelsFormatted[labelKey].labelShown}`;
        this.subGroups[groupId] = [];
        for (let i = 0; i < numberFirebaseAutoformElements; i += 1) {
          this.subGroups[groupId].push(`${groupId}_${i}`);
          this.consoleLog('groupID: ', `${groupId}_${i}`);
        }
      }
      resolve();
    });
  }

  _getLoggedUser() {
    let user;
    if (this.elementSelectedId) {
      if (Object.keys(this.data).includes('__edit_user')) {
        if (this.data.__edit_user !== '') {
          user = this.data.__edit_user;
        } else {
          user = this.userDisplayName;
        }
      } else {
        this.data.__edit_user = this.userDisplayName;
        user = this.userDisplayName;
      }
    } else {
      user = this.userDisplayName;
    }
    return user;
  }

  async _insertLoggedUser() {
    const containerFieldsGroup = await this._createContainerFieldsGroup(
      'loggedUser'
    );
    const loggedUser =
      console.loggedUser !== '' ? console.loggedUser : 'logged-user';
    const user = this._getLoggedUser();
    const cssClass = console.loggedUser !== '' ? '' : 'class="hidden"';
    containerFieldsGroup.innerHTML = `
        <paper-input type="text" label="${loggedUser}" id="__edit_user" readonly value="${user}" ${cssClass}></paper-input>
      `;
    if (!this.shadowRoot.querySelector('#__edit_user')) {
      this.shadowRoot
        .querySelector('#formfieldlayer')
        .appendChild(containerFieldsGroup);
    }
  }

  async _insertFields(data = this.data) {
    this._cleanError();
    this._insertLoggedUser(data);
    const keys = Object.keys(data);
    this._arrKeys = keys;
    for (const key of keys) {
      if (!this.__FIELDS.includes(key)) {
        await this._getFieldForm(data[key], key);
      }
    }
  }

  _getSelectFieldsType() {
    return new Promise(resolve => {
      Object.keys(this.data).forEach(async labelKey => {
        await this._getSelectFieldType(labelKey);
      });
      this.consoleLog(this.id, 'HTMLFields: ', this.HTMLFields);
      resolve();
    });
  }

  _getSelectFieldType(labelKey) {
    return new Promise(resolve => {
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
      const isModel = this.MODELFIELDS.includes(
        this.labelsFormatted[labelKey].labelShown
      );
      const typeModel =
        this.TYPEMODELFIELDS[this.labelsFormatted[labelKey].labelShown];
      const typeField = this.TYPESCHEMAFIELDS[labelKey];

      if (isModel) {
        this.HTMLFields[labelKey] =
          this.RELATIONMODELFIELD[`${typeField}-${typeModel}`];
      } else {
        const multi = typeField === 'array' ? ' MULTIPLE' : '';
        this.HTMLFields[labelKey] =
          (this.textareaFields.includes(labelKey)
            ? 'TEXTAREA'
            : this.datepickerFields.includes(labelKey)
            ? 'DATE-PICKER'
            : this.fileuploadFields.includes(labelKey)
            ? 'FILE-UPLOAD'
            : this.TYPESCHEMAFIELDS[labelKey] === 'boolean'
            ? 'CHECKBOX'
            : 'INPUT') + multi;
      }
      resolve();
    });
  }

  async _getFieldForm(propField, labelKey) {
    const regExpCommonField = new RegExp(
      /INPUT|TEXTAREA|DATE-PICKER|FILE-UPLOAD/
    );
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
    this._null = null;
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
    return new Promise((resolve, reject) => {
      if (this.shadowRoot.querySelector(`#${labelKey}`)) {
        const msg = `${labelKey} group ya creado`;
        console.error(msg);
        reject(msg);
      }
      const DOMGroup =
        labelKey !== 'loggedUser'
          ? document.createElement('fieldset')
          : document.createElement('div');
      DOMGroup.id = labelKey;
      DOMGroup.className =
        style === 'flex' ? 'containerFieldsGroupFlex' : 'containerFieldsGroup';
      DOMGroup.classList.add('collapsed');
      if (!this.shadowRoot.querySelector(`#${labelKey}`)) {
        this.shadowRoot.querySelector('#formfieldlayer').appendChild(DOMGroup);
      }
      resolve(DOMGroup);
    });
  }

  _createContainerFieldsGroups() {
    return new Promise(resolve => {
      const groups = this.groups.filter(
        group => !this.noGroups.includes(group)
      );
      groups.forEach(async group => {
        const domGroup = await this._createContainerFieldsGroup(group);
        if (domGroup) {
          this.DOMGroups[group] = domGroup;
        }
      });
      resolve(this.DOMGroups);
    });
  }

  _createContainerFieldsGroupsMultiples() {
    return new Promise(resolve => {
      Object.keys(this.subGroups).forEach(async group => {
        const subGroupId = this.subGroups[group];
        const parentGroup = subGroupId.match(/GRP_[A-Z]/)[0];
        const domSubgroup = await this._createContainerFieldsGroup(subGroupId);
        const legend = document.createElement('legend');
        const title = subGroupId.replace(/GRP_[A-Z]_/, '').replace(/_/g, ' ');
        legend.innerHTML = title;
        domSubgroup.appendChild(legend);
        this.shadowRoot
          .querySelector(`#${parentGroup}`)
          .appendChild(domSubgroup);
        this.consoleLog('subgroupId', subGroupId, this.subGroups[subGroupId]);
      });
      resolve(this.DOMGroups);
    });
  }

  _getLabelsFormatted() {
    for (const labelKey of this.SCHEMAFIELDS) {
      const [labelShown, labelCleanId] = this._getLabels(labelKey);
      this.labelsFormatted[labelKey] = {};
      this.labelsFormatted[labelKey].labelShown = labelShown;
      this.labelsFormatted[labelKey].labelCleanId = labelCleanId;
    }
  }

  _getLabels(labelKey) {
    this._null = null;
    const labelKeyParts = labelKey.split('-');
    const labelShown = labelKeyParts[labelKeyParts.length - 1];
    const labelCleanId = labelShown.replace(/_/g, ' ');
    return [labelShown, labelCleanId];
  }

  _getHTMLTag(labelKey, typeobj) {
    const hasVal = this.elementSelectedId && this.data[labelKey];
    const elVal = hasVal ? this.data[labelKey].replace(/"/g, '&#34;') : '';
    const readOnly =
      this.readonlyFields.includes(labelKey) || this.readonly ? 'readonly' : '';
    let { labelCleanId } = this.labelsFormatted[labelKey];
    const { labelShown } = this.labelsFormatted[labelKey];
    const uploadedFilesPath = this.uploadedFilesPath || '/uploadedFiles';
    let HTMLTag;
    labelCleanId += this.readonlyFields.includes(labelShown)
      ? ' [READONLY]'
      : '';
    if (this.textareaFields.includes(labelKey)) {
      HTMLTag = `
        <div class="info-space info-icon tooltip-info">
          <div class="tooltiptext">
            ${this.fieldsDesc[labelKey]}
          </div>
        </div>
        <paper-textarea rows="3" type="${typeobj}" label="${labelCleanId}" id="${labelKey}" value="${
        hasVal ? elVal : ''
      }" ${readOnly}>
          <div class="slot" slot="prefix">[${typeobj}]</div>
        </paper-textarea>
      `;
    } else if (this.fileuploadFields.includes(labelKey)) {
      HTMLTag = `
        <div class="info-space info-icon tooltip-info">
          <div class="tooltiptext">
            ${this.fieldsDesc[labelKey]}
          </div>
        </div>
        <firebase-uploadfile
          id="${labelKey}"
          login-btn-id="${this.loginId}"
          ${hasVal ? `value="${elVal}"` : ''}
          name="${labelCleanId}"
          path="${uploadedFilesPath}"
          storage-name="NAME,FILENAME"
          delete-btn="true"
        >
        </firebase-uploadfile>
        <!--<input type="file" name="${labelCleanId}" id="${labelKey}" value="${
        hasVal ? elVal : ''
      }" ${readOnly}>-->
      `;
    } else if (this.datepickerFields.includes(labelKey)) {
      HTMLTag = `
        <div class="info-space info-icon tooltip-info">
          <div class="tooltiptext">
            ${this.fieldsDesc[labelKey]}
          </div>
        </div>
        <label for="${labelKey}">${labelCleanId}</label><input type="date" id="${labelKey}" name="${labelCleanId}" ${
        hasVal ? `value="${elVal}"` : ''
      } />
      `;
    } else {
      HTMLTag = `
        <div class="info-space info-icon tooltip-info">
          <div class="tooltiptext">
            ${this.fieldsDesc[labelKey]}
          </div>
        </div>
        <paper-input type="${typeobj}" label="${labelCleanId}" id="${labelKey}" value="${
        hasVal ? elVal : ''
      }" ${readOnly}></paper-input>
      `;
    }
    return HTMLTag;
  }

  _createCommonHTMLField(labelKey, typeobj, fieldForm) {
    return new Promise(resolve => {
      if (!this.shadowRoot.querySelector(`#${labelKey}`)) {
        fieldForm.innerHTML += this._getHTMLTag(labelKey, typeobj);
      }
      resolve(fieldForm);
    });
  }

  _createCheckbox(labelKey, containerFieldsGroup) {
    return new Promise(resolve => {
      const hasVal = this.elementSelectedId && this.data;
      const elVal = hasVal ? this.data[labelKey] : '';
      const checked = hasVal ? (elVal === true ? 'checked="true"' : '') : '';
      const readOnly =
        this.readonlyFields.includes(labelKey) || this.readonly
          ? 'readonly'
          : '';
      containerFieldsGroup.innerHTML += `
        <div class="chbx-block"><div class="label">${this.labelsFormatted[labelKey].labelCleanId}</div><paper-checkbox label="${labelKey}" id="${labelKey}" ${checked} ${readOnly}"></paper-checkbox></div>
      `;
      resolve(containerFieldsGroup);
    });
  }

  async _createBlockInputMultiple(labelKey, typeobj) {
    const parentContainerId = this._getGrpId(labelKey);
    const containerFieldsGroup = await this._createContainerFieldsGroup(
      labelKey
    );
    await this._createInputMultiple(containerFieldsGroup, labelKey, typeobj);
    this.shadowRoot
      .querySelector(`#${parentContainerId}`)
      .appendChild(containerFieldsGroup);
    if (this._counter[labelKey] >= 1) {
      this.shadowRoot
        .querySelector(
          `[id^="delLast${this.labelsFormatted[labelKey].labelShown}"]`
        )
        .classList.remove('invisible');
    }
  }

  _addBtn(id, label, containerFieldsGroup, labelKey, typeobj, className) {
    this._null = null;
    const btn = document.createElement('button');
    btn.setAttribute('id', id);
    btn.setAttribute('data-group', labelKey);
    btn.textContent = label;
    btn.setAttribute('typeobj', typeobj);
    btn.setAttribute('class', className);
    containerFieldsGroup.appendChild(btn);
  }

  _createButtonsMultiple(labelKey, containerFieldsGroup, typeobj) {
    const { labelCleanId } = this.labelsFormatted[labelKey];
    const { labelShown } = this.labelsFormatted[labelKey];
    this._addBtn(
      `addNew${labelShown}`,
      `Add new "${labelCleanId}"`,
      containerFieldsGroup,
      labelKey,
      typeobj,
      ''
    );
    this._addBtn(
      `delLast${labelShown}`,
      `Del last "${labelCleanId}"`,
      containerFieldsGroup,
      labelKey,
      typeobj,
      'invisible'
    );
  }

  _createPaperInput(id, typeobj, label, readonly, value) {
    this._null = null;
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
      this._counter[labelKey] = !this._counter[labelKey]
        ? 0
        : (this._counter[labelKey] += 1);
      let id = `${labelKey}_${this._counter[labelKey]}`;
      const readOnly = this.readonlyFields.includes(labelKey) || this.readonly;
      const label = this.labelsFormatted[labelKey].labelCleanId;
      let paperInput;
      if (this.elementSelectedId) {
        const data = this.data[labelKey];
        if (data) {
          for (const value of data) {
            id = `${labelKey}_${this._counter[labelKey]}`;
            paperInput = this._createPaperInput(
              id,
              typeobj,
              label,
              readOnly,
              value
            );
            paperInput.innerHTML += `<div class="slot" slot="suffix">${
              this._counter[labelKey] + 1
            }</div>`;
            containerFieldsGroup.appendChild(paperInput);
            this._counter[labelKey] += 1;
          }
          this._counter[labelKey] -= 1;
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
    this._null = null;
    return Object.keys(obj).reduce((result, item) => {
      result[item] = '';
      return result;
    }, {});
  }

  _createNewIdInFirebase(path, labelShown) {
    return new Promise(resolve => {
      const refDb = ref(this.db, path);
      onValue(refDb, snapshot => {
        if (snapshot.exists()) {
          const newId = snapshot.val().length;
          const valuesData = this.VALUESMODELFIELDS[labelShown][0];
          const valueSnap = this._getObjectKeysValuesEmpty(valuesData);
          ref.child(newId).set(valueSnap);
          resolve(newId);
        }
      });
    });
  }

  async _addFbAfFromFbAfMultiple(ev, labelKey) {
    const { parentNode } = ev.target;
    const referenceNode = ev.target; // parentNode.querySelector('#addNewcrítica');
    const { labelShown } = this.labelsFormatted[labelKey];
    const { path } = parentNode.querySelector('firebase-autoform');
    const elementSelectedId = await this._createNewIdInFirebase(
      path,
      labelShown
    );
    this._counter[labelKey] = elementSelectedId;
    const id = `${labelKey}_${this._counter[labelKey]}`;
    const groupName =
      this.labelsFormatted[labelKey].labelCleanId +
      (this._counter[labelKey] ? `_${this._counter[labelKey]}` : '');
    if (this._counter[labelKey] >= 1) {
      this.shadowRoot
        .querySelector(`[id^="delLast${labelShown}"]`)
        .classList.remove('invisible');
    }
    const newNode = this._createFirebaseAutoform(
      id,
      elementSelectedId,
      path,
      groupName
    );
    parentNode.insertBefore(newNode, referenceNode);
  }

  _addInputFromInputMultiple(ev, labelKey, typeobj) {
    const referenceNode = this.shadowRoot.querySelector(
      `#${labelKey}_${this._counter[labelKey]}`
    );
    this._counter[labelKey] += 1;
    const id = `${labelKey}_${this._counter[labelKey]}`;
    if (this._counter[labelKey] >= 1) {
      this.shadowRoot
        .querySelector(
          `[id^="delLast${this.labelsFormatted[labelKey].labelShown}"]`
        )
        .classList.remove('invisible');
    }
    const newNode = this._createPaperInput(
      id,
      typeobj,
      this.labelsFormatted[labelKey].labelCleanId,
      this.readonlyFields.includes(labelKey) || this.readonly
    );
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  _deleteElementFromFieldMultiple(ev, labelKey) {
    if (this._counter[labelKey] > 0) {
      this.shadowRoot
        .querySelector(`#${labelKey}_${this._counter[labelKey]}`)
        .remove();
      this._counter[labelKey] -= 1;
      if (this._counter[labelKey] === 0) {
        this.shadowRoot
          .querySelector(
            `[id="delLast${this.labelsFormatted[labelKey].labelShown}"]`
          )
          .classList.add('invisible');
      }
      if (this.autoSave) {
        this.save();
      }
    }
  }

  _createMultipleSelect(labelKey, snap) {
    // const elementSelectedId = this.elementSelectedId || 0;
    const select = document.createElement('select');
    select.id = labelKey;
    select.setAttribute('multiple', 'true');
    snap.forEach(item => {
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
      const { labelShown } = this.labelsFormatted[labelKey];
      const refDb = ref(this.db, `/model/${labelShown}`);
      onValue(refDb, snapshot => {
        if (snapshot.exists()) {
          if (!this.shadowRoot.querySelector(`#${labelKey}`)) {
            const info = document.createElement('div');
            info.classList.add('info-space', 'info-icon', 'tooltip-info');
            const infotext = document.createElement('div');
            infotext.classList.add('tooltiptext');
            infotext.innerHTML = this.fieldsDesc[labelKey];
            info.appendChild(infotext);
            const label = document.createElement('label');
            label.for = labelShown;
            label.innerText = labelShown;
            const select = this._createMultipleSelect(labelKey, snapshot);
            containerFieldsGroup.appendChild(info);
            containerFieldsGroup.appendChild(label);
            containerFieldsGroup.appendChild(select);
            resolve();
          }
        }
      });
    });
  }

  _insertModelInNewElement(labelShown) {
    const data = {};
    let valuesData;
    if (this.VALUESMODELFIELDS[labelShown].push) {
      valuesData = this.VALUESMODELFIELDS[labelShown][0];
    } else if (this.TYPEMODELFIELDS[labelShown] === 'object') {
      valuesData = this.VALUESMODELFIELDS[labelShown];
    } else {
      valuesData = Object.keys(this.VALUESMODELFIELDS[labelShown]);
    }
    const valueSnap = this._getObjectKeysValuesEmpty(valuesData);
    data[0] = valueSnap;
    set(ref(this.db, this.path), data);
  }

  _createFirebaseAutoform(id, elementSelectedId, path, groupName) {
    const firebaseAutoform = document.createElement('firebase-autoform');
    firebaseAutoform.innerHTML = `<grp-names>A=${groupName}</grp-names>`;
    firebaseAutoform.setAttribute('id', id);
    firebaseAutoform.setAttribute('path', path);
    firebaseAutoform.setAttribute('element-selectedId', elementSelectedId);
    firebaseAutoform.setAttribute('is-child', true);
    firebaseAutoform.setAttribute('read-only', this.readonly || false);
    firebaseAutoform.setAttribute('auto-save', this.autoSave || false);
    firebaseAutoform.setAttribute('hide-id', true || false);
    return firebaseAutoform;
  }

  async _createFirebaseAutoformChild(labelKey, containerFieldsGroup) {
    this._firebaseAutoformEls.push(labelKey);
    if (!this._counter[labelKey]) {
      this._counter[labelKey] = 0;
    }
    const childElId = this._counter[labelKey];
    const elementSelectedId =
      this.elementSelectedId || (await this._getNextId());
    const path = `${this.path}/${elementSelectedId}/${labelKey}`;
    const refDb = ref(this.db, path);
    const groupName = this.labelsFormatted[labelKey].labelCleanId;
    onValue(refDb, snapshot => {
      if (snapshot.exists()) {
        const valueSnap = snapshot.val();
        let idDomAttribute = labelKey;
        if (valueSnap === null || valueSnap === '') {
          if (this.HTMLFields[labelKey] === 'FIREBASE-AUTOFORM MULTIPLE') {
            idDomAttribute += `_${elementSelectedId}`;
          }
          this._insertModelInNewElement(
            this.labelsFormatted[labelKey].labelShown
          );
          const firebaseAutoform = this._createFirebaseAutoform(
            idDomAttribute,
            childElId,
            path,
            groupName
          );
          containerFieldsGroup.appendChild(firebaseAutoform);
        } else {
          Object.keys(valueSnap).forEach(key => {
            idDomAttribute = labelKey;
            let grpName = groupName;
            if (this.HTMLFields[labelKey] === 'FIREBASE-AUTOFORM MULTIPLE') {
              idDomAttribute += `_${key}`;
              grpName += `_${key}`;
            }
            this.consoleLog(labelKey, idDomAttribute, grpName);
            const firebaseAutoform = this._createFirebaseAutoform(
              idDomAttribute,
              key,
              path,
              grpName
            );
            containerFieldsGroup.appendChild(firebaseAutoform);
            this._counter[labelKey] += 1;
          });
          this._counter[labelKey] -= 1;
        }
      }
      return containerFieldsGroup;
    });
  }

  async _createFirebaseAutoformChildMultiple(
    labelKey,
    containerFieldsGroupBase
  ) {
    this._counter[labelKey] = 0;
    // const elementSelectedId = this.elementSelectedId || 0;
    const { labelShown } = this.labelsFormatted[labelKey];
    const arrFirebaseAutoformElements = this.data[labelKey];
    const numberFirebaseAutoformElements = arrFirebaseAutoformElements.length;
    const groupId = `${containerFieldsGroupBase.id}_${labelShown}`;
    this.consoleLog(
      'Numero de firebase-autoforms: ',
      numberFirebaseAutoformElements
    );
    this.consoleLog('groupId', groupId);
    const containerFieldsGroup = this.shadowRoot.querySelector(`#${groupId}`);
    await this._createFirebaseAutoformChild(labelKey, containerFieldsGroup);
    this._createButtonsMultiple(
      labelKey,
      containerFieldsGroup,
      'firebase-autoform'
    );
    if (this._counter[labelKey] >= 1) {
      this.shadowRoot
        .querySelector(`[id^="delLast${labelShown}"]`)
        .classList.remove('invisible');
    }
    return containerFieldsGroup;
  }

  _createRichList(labelKey, containerFieldsGroup) {
    return new Promise(resolve => {
      const refDb = ref(
        this.db,
        `/model/${this.labelsFormatted[labelKey].labelShown}`
      );
      const info = document.createElement('div');
      info.classList.add('info-space', 'info-icon', 'tooltip-info');
      const infotext = document.createElement('div');
      infotext.classList.add('tooltiptext');
      infotext.innerHTML = this.fieldsDesc[labelKey];
      info.appendChild(infotext);
      const richSelectLabel = document.createElement('label');
      const richSelect = document.createElement('rich-select');
      richSelect.id = labelKey;
      richSelect.setAttribute(
        'label',
        this.labelsFormatted[labelKey].labelCleanId
      );
      richSelect.setAttribute('search', 'search');
      richSelect.setAttribute('arrow', 'arrow');
      richSelectLabel.innerText = this.labelsFormatted[labelKey].labelCleanId;
      const hasVal = this.elementSelectedId && this.data;
      const elVal = hasVal ? this.data[labelKey] : '';
      let selectedEl = 0;
      let richOption = document.createElement('rich-option');
      richOption.innerHTML = '';
      richSelect.appendChild(richOption);
      onValue(refDb, snapshot => {
        if (snapshot.exists()) {
          snapshot.forEach(item => {
            const itemVal = item.val();
            richOption = document.createElement('rich-option');
            richOption.innerHTML = itemVal;
            if (itemVal.toLowerCase() === elVal.toLowerCase()) {
              selectedEl = parseInt(item.key, 10) + 1;
            }
            richSelect.appendChild(richOption);
          });
          richSelect.children[selectedEl].selected = true;
          if (!this.shadowRoot.querySelector(`#${labelKey}`)) {
            containerFieldsGroup.appendChild(info);
            containerFieldsGroup.appendChild(richSelectLabel);
            containerFieldsGroup.appendChild(richSelect);
          }
          richSelect.value = elVal;
          resolve(containerFieldsGroup);
        }
      });
    });
  }

  _showError(msg) {
    this.shadowRoot.querySelector('#formfieldlayer').innerHTML = '';
    const arrMsg = {
      nopath: `Path <span class="path">${this.path}</span> doesn't exists`,
      none: '',
    };
    const d = !this.shadowRoot.querySelector('.error_msg')
      ? document.createElement('div')
      : this.shadowRoot.querySelector('.error_msg');
    d.className = 'error_msg';
    d.innerHTML = arrMsg[msg];
    if (!this.shadowRoot.querySelector('.error_msg')) {
      this.shadowRoot.querySelector('#formfieldlayer').appendChild(d);
    }
  }

  _cleanFields() {
    [
      ...this.shadowRoot.querySelectorAll('#formfieldlayer paper-input'),
    ].forEach(element => {
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
    this.shadowRoot.querySelector(
      '#mensaje_popup'
    ).innerHTML = `<h1>${msg}</h1>`;
    this.shadowRoot.querySelector('#mensaje_popup').toggle();
    this._closeInSeconds(2, callback);
  }

  async save() {
    if (this.elementSelectedId) {
      if (this._arrKeys.length) {
        this.saveComplex();
      } else {
        this.saveSimple();
      }
    } else {
      this.elementSelectedId = await this._getNextId();
      await set(
        ref(this.db, `${this.path}/${this.elementSelectedId}`),
        this.data
      );
    }
  }

  async saveSimple() {
    const domElelements = this.shadowRoot.querySelectorAll(
      '#formfieldlayer fieldset paper-input'
    );
    const newData = ['string'];
    for (const element of domElelements) {
      newData.push(element.value);
    }
    this.data = newData;
    await set(ref(this.db, this.path), newData);
    this._showMsgPopup('Datos guardados correctamente', () => {});
  }

  checkForgottenWords() {
    const groups = this.collapsibleGroups;
    this.badWords = [];

    groups.forEach(group => {
      const badWords = [];
      const textToCheck = this.data[`${group}02-descripción`];
      this.forgottenWords.forEach(forgottenWord => {
        const index = textToCheck.indexOf(forgottenWord);
        if (~index) {
          const strTmp = textToCheck.substr(index);
          const indexEnd =
            strTmp.indexOf(' ') > 0 ? strTmp.indexOf(' ') : strTmp.length;
          const badWord = strTmp.substr(0, indexEnd);
          badWords.push(badWord);
          this.consoleLog(`encontrado ${badWord}`);
        }
      });
      const el = this.shadowRoot.querySelector(`#${group}02-descripción`);
      if (badWords.length > 0) {
        let spanBadWords;
        if (!el.parentNode.querySelector(`#BADWORDS_${group}`)) {
          el.classList.add('borderRed');
          spanBadWords = document.createElement('span');
          spanBadWords.id = `BADWORDS_${group}`;
          spanBadWords.classList.add('badwords');
          el.parentNode.insertBefore(spanBadWords, el);
        } else {
          spanBadWords = el.parentNode.querySelector(`#BADWORDS_${group}`);
        }
        spanBadWords.innerHTML = `Usando palabras no permitidas: ${badWords.join(
          ', '
        )}`;
      } else {
        el.classList.remove('borderRed');
        if (el.parentNode.querySelector(`#BADWORDS_${group}`)) {
          el.parentNode.querySelector(`#BADWORDS_${group}`).remove();
        }
      }
      this.badWords = [...this.badWords, ...badWords].filter(w => w);
    });
  }

  saveComplex() {
    this.data = this._getCurrentDataFromElements();
    this.checkForgottenWords();
    this._saveFirebase();
  }

  // eslint-disable-next-line class-methods-use-this
  _getValueMultiple(el) {
    const paperInputs = Array.from(el.children).filter(
      _el => _el.tagName === 'PAPER-INPUT'
    );
    const values = paperInputs.map(_el => _el.value);
    return values;
  }

  _getElementValue(el) {
    // const noPaperTags = ['FIREBASE-UPLOADFILE', 'RICH-SELECT', 'SELECT', 'INPUT', 'FIELDSET'];
    let val = null;
    if (el.tagName === 'PAPER-INPUT' || el.tagName === 'PAPER-TEXTAREA') {
      val = el.$.input.value;
    } else if (el.tagName === 'PAPER-CHECKBOX') {
      val = !!el.$.checkbox.classList.value.match('checked');
    } else if (el.tagName === 'SELECT') {
      val = Array.from(el.querySelectorAll('option:checked'), e => e.value);
    } else if (el.tagName === 'FIELDSET') {
      val = this._getValueMultiple(el);
    } else if (el.tagName === 'RICH-SELECT') {
      val = el.chosen.innerText;
    } else {
      val = el.value;
    }
    this.consoleLog(el.tagName, val);
    return val;
  }

  _getAllDataGrp(_data, key) {
    const data = _data;
    const cleanKey = key.split('-')[0];
    const els = this.shadowRoot.querySelectorAll(`[id^=${cleanKey}]`);
    data[key] = [];
    for (const [elIndex, element] of els.entries()) {
      const val = element.$
        ? element.$.input
          ? element.$.input.value
          : element.value
        : element.value;
      data[key][elIndex] = val || '';
      this.consoleLog(`	${elIndex} = ${val}`);
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
        fbAfs.forEach(fbAf => {
          result = fbAf._getCurrentDataFromElements();
          data[key] = Array.isArray(result) ? result : [result];
        });
      } else if (this.HTMLFields[key] === 'FIREBASE-AUTOFORM') {
        result = this.shadowRoot.querySelector(`#${key}`).data;
        data[key] = Array.isArray(result) ? result : [result];
      } else {
        const el = this.shadowRoot.querySelector(`#${key}`);
        if (el) {
          const val = this._getElementValue(el);
          data[key] = val || this._resetField(key, val);
        } else {
          data = this._getAllDataGrp(data, key);
        }
      }
    }
    return data;
  }

  _showBubbleFieldMsg(_bubble, el) {
    this._null = null;
    const bubble = _bubble;
    const offset = 40;
    const bubbleTop = el.offsetTop + 10;
    bubble.style.opacity = 1;
    bubble.style.top = `${bubbleTop}px`;
    bubble.style.left = `${el.offsetLeft + 150}px`;
    let opacity = 1;
    const idInterval = setInterval(() => {
      const val = parseInt(bubble.style.top, 10) - 2;
      if (val < bubbleTop - offset) {
        clearInterval(idInterval);
      }
      opacity -= 0.05;
      bubble.style.opacity = opacity;
      bubble.style.top = `${val}px`;
    }, 40);
  }

  _getNextId() {
    return new Promise(resolve => {
      const refDb = ref(this.db, this.path);
      onValue(refDb, snapshot => {
        if (snapshot.exists()) {
          const nextId = Object.keys(snapshot.val()).length;
          resolve(nextId);
        }
      });
    });
  }

  _showBocadillo(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    const { target } = ev;
    this.bocadillo = this.shadowRoot.querySelector('#bocadillo');
    if (this.bocadillo.style.display === 'none') {
      this.bocadillo.style.display = 'block';
      const { scrollY } = window;
      const targetInfoTop = target.getBoundingClientRect().top;
      const targetInfoHeight = target.getBoundingClientRect().height;
      const bocadilloInfoHeight = this.bocadillo.getBoundingClientRect().height;
      const targetInfoBottom =
        targetInfoTop - targetInfoHeight - bocadilloInfoHeight + scrollY;
      const bocadilloContent =
        this.fieldsDesc[target.nextElementSibling.id] ||
        this.fieldsDesc[target.nextElementSibling.nextElementSibling.id];
      this.bocadillo.innerHTML = `<p>${bocadilloContent}</p>`;
      this.bocadillo.style.top = `${targetInfoBottom}px`;
      this.shadowRoot.addEventListener('click', this._hideBocadillo.bind(this));
    } else {
      this._hideBocadillo();
    }
  }

  _hideBocadillo() {
    this.bocadillo.style.display = 'none';
    this.removeEventListener('click', this._hideBocadillo.bind(this));
  }

  async _saveFirebase() {
    if (this.badWords.length > 0) {
      this._showMsgPopup(`
        ANTES DE GUARDAR CORRIGE LOS ERRORES.<br>
        Corrige las <span style="color:red;">palabras no permitidas</span>:<br>
        <p style="color:#FF7939; font-weight:bold; font-size:1.2rem;">${this.badWords.join(
          ', '
        )}</p>
        Debe cambiarlas por un eufemismo.<br>
        Mira en 'Consejos' para mas información
      `);
    } else {
      const { data } = this;
      this.elementSelectedId =
        this.elementSelectedId || (await this._getNextId());
      const nextId = this.elementSelectedId;
      const callbackFn = this.elementSelectedId ? null : this._cleanFields;
      data.__edit_user = this.userDisplayName;
      data.__created_at = serverTimestamp();
      if (this.badWords.length > 0) {
        data.__autorevised = `NOK!!Usas las palabras no permitidas: ${this.badWords.join(
          ', '
        )}, que se debe cambiar por un eufemismo. Mira en 'Consejos' para mas información`;
      } else {
        data.__autorevised = null;
      }

      this.data = data;
      if (this.isChild) {
        this.elementSelectedId = nextId;
      }

      update(ref(this.db, `${this.path}/${this.elementSelectedId}`), data)
        .then(() => {
          this.consoleLog('nextId', nextId);
          this.consoleLog('saved data', data);
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
                this._firebaseAutoformEls.forEach(el => {
                  this.shadowRoot.querySelector(`#${el}`).save();
                });
              }
            }
            document.dispatchEvent(
              new CustomEvent('firebase-autoform-data-saved', {
                detail: {
                  id: this.id,
                  path: this.path,
                  elSelId: this.elementSelectedId,
                  data,
                },
              })
            );
          }
        })
        .catch(error => {
          this._showMsgPopup(error.message);
          throw error;
        });
    }
  }

  render() {
    const path = this.path.split('/');
    const _child = this.isChild ? 'child' : '';
    return html`
      ${this.userData !== null
        ? html`
            <h3 class="path${_child}">
              ${this.bShowPath ? html`${path[path.length - 1]}` : html``}
              <span class="id">
                ${this.elementSelectedId && !this.bHideId
                  ? html` ID: ${this.elementSelectedId}`
                  : html``}
              </span>
              <paper-spinner id="spinner" class="blue" active></paper-spinner>
            </h3>
            <div class="container">
              <section class="${_child}">
                <div id="formfieldlayer"></div>
                ${this.readonly
                  ? html``
                  : this.data !== undefined && !this.isChild
                  ? html`<paper-button
                      id="saveBtn"
                      class="save"
                      raised
                      @click="${this.save}"
                      >${this._simple
                        ? html`Update`
                        : this.elementSelectedId
                        ? html`Update [ID ${this.elementSelectedId}]`
                        : html`Insert new element`}</paper-button
                    >`
                  : html``}
                <paper-dialog id="mensaje_popup"></paper-dialog>
              </section>
            </div>
            <div id="bubbleSaved" class="invisible bubbleSaved">Saved</div>
            <div
              id="bocadillo"
              class="bocadillo-cuadrado"
              style="display:none"
            ></div>
          `
        : html`<div class="waiting">
            FirebaseAutoform - Waiting for login...
          </div>`}
    `;
  }
}
