// Copyright 2022 manufosela.
// SPDX-License-Identifier: MIT

import { css } from 'lit';

export const firebaseAutoformStyles = css`
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
    font-size: 100%;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .error_msg {
    font-weight: bold;
    color: var(--error-msg-color, blue);
    padding: 15px;
  }
  .path {
    color: var(--path-title-color, #ff7800);
  }
  #formfieldlayer {
    margin-bottom: 30px;
  }
  .inlineblock {
    display: inline-block;
  }
  .slot {
    margin-right: 10px;
    font-size: 10px;
    font-weight: bold;
    color: #aaa;
  }
  .waiting {
    padding: 20px;
    margin: 20px;
    font-size: 2rem;
  }
  .path {
    margin: 0;
    padding: 20px;
    font-size: 2rem;
    color: var(--path-title--color);
  }
  .pathchild {
    margin: 0;
    padding: 0;
    height: 0;
  }
  .containerFieldsGroupFlex {
    display: flex;
  }
  .chbx-block {
    display: flex;
    margin: 15px 0;
  }
  .chbx-block .label {
    font-size: 0.7rem;
    color: var(--label-color, #f30);
  }
  .chbx-block paper-checkbox {
    margin-left: 1rem;
  }

  .container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    white-space: normal;
  }
  section {
    padding: 20px;
    margin: 0 20px 0 20px;
    width: 100%;
    max-width: var(--fields-max-width, 300px);
  }
  section.child {
    padding-top: 0;
    padding-left: 0;
    margin-left: 0;
  }
  paper-input,
  rich-select,
  select,
  paper-textarea {
    width: 99%;
    max-width: var(--fields-max-width, 300px);
    --secondary-text-color: var(--label-color, #f30);
  }
  paper-input:host(label) {
    font-weight: bold;
  }

  paper-spinner.blue::shadow .circle {
    border-color: var(--spinner-color, #4285f4);
  }
  paper-button.register {
    background: gray;
    color: blue;
  }
  paper-button.register:hover {
    background: #ccc;
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
    --progress-bg-color: var(--uploadfile-progress-bg-color, #ddd);
    --progress-color1: var(--uploadfile-progress-color1, #09c);
    --progress-color2: var(--uploadfile-progress-color2, #f44);
    --bgcolor-button: var(--uploadfile-bgcolor-button, #ddd);
    --color-button: var(--uploadfile-color-button, #f50);
  }
  label {
    display: block;
    font-size: 0.7em;
    font-family: 'Roboto', 'Noto', sans-serif;
    color: var(--label---color-button, #f30);
    margin-bottom: 5px;
    margin-top: 15px;
  }
  fieldset {
    border: 1px solid var(--fieldset-border-color, #f50);
    border-radius: 20px;
    padding: 9px;
    margin: 10px;
    width: 100%;
    max-width: var(--fields-max-width, 300px);
  }
  legend {
    padding: 0 20px;
    background: var(--legend-bg-color, #ddd);
    border-radius: 10px;
    color: var(--fieldset-border-color, #f50);
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
    visibility: hidden;
    display: none;
  }
  .tooltip {
    position: absolute;
    width: auto;
    max-width: 400px;
    padding: 10px;
    color: #fff;
    background: #333;
    opacity: 0;
    box-shadow: 2px 2px 5px #aaa;
    -webkit-box-shadow: 2px 2px 5px #aaa;
    -moz-box-shadow: 2px 2px 5px #aaa;
  }
  .west:before {
    content: ' ';
    position: absolute;
    top: 50%;
    left: -16px;
    width: 0;
    height: 0;
    margin-top: -8px;
    border: 8px solid transparent;
    border-right-color: #333;
  }
  .south:before {
    content: ' ';
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
    flex-direction: columns;
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
  .down {
    border-color: black transparent transparent transparent;
  }
  .up {
    border-color: transparent transparent black transparent;
  }
  .bubbleSaved {
    content: 'Saved';
    position: absolute;
    height: 1.5em;
    line-height: 1.5em;
    padding: 0 0.46em;
    text-align: center;
    text-shadow: 0 0.063em 0 rgba(0, 0, 0, 0.2);
    background-color: #f93;
    color: #fff;
    width: 100px;
    box-shadow: 0 0.063em 0.063em rgba(0, 0, 0, 0.2);
    border-radius: 4em;
    z-index: 1;
    opacity: 0;
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

  .bocadillo-cuadrado {
    position: absolute;
    height: var(--json-autoform-bocadillo-cuadrado-height, 200px);
    width: var(--json-autoform-bocadillo-cuadrado-width, 500px);
    background: var(--json-autoform-bocadillo-cuadrado-background, #fff);
    box-shadow: 1px 12px 33px rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    padding: var(--json-autoform-bocadillo-cuadrado-padding, 1rem);
    font-family: var(--json-autoform-bocadillo-cuadrado-font-family, system-ui);
  }

  .bocadillo-cuadrado:before {
    border: 25px solid white;
    content: '';
    border-left-color: transparent;
    border-bottom-color: transparent;
    border-right-color: transparent;
    position: absolute;
    bottom: -48px;
    left: calc(50% - 25px);
  }

  .info-icon {
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABaUlEQVRIid2VPU7DQBCFPxzFDeEKHCDhDoQCShQilCtERAjIJVDEGaDi5zCIhoDABGjhAKYgBTHFzOIV2rXXSZcnjTbyzL63eZ5Zw7IjBnrADZAAXxoJcK25eF7yLvAOZCXxBuxVIY6AM4vgHjgCmsCqRgs4BsZW3Uj3lsKQfwP9kk0RcKC1RqQQXYt8M+Q0irYl0vEVxeSe9z01xg4XBpp7Bequgh655z5bigRqwIPm981Dm8h0wjkw85CsaLjwA1zob6dNL6re9BCEoKUciSuZarJRQFBkEcCa5lPzIKhvK8DY92exLfCh6/oCAmbvp0vgTtftBQR2dL11JU2bjpm/TR/516Y2YuTiypDxrypwqLkJnkEDmQVzVbR9RQ5sAVPk5e6WFY8skQHy132oISef6p7TkNNElkiGjP8JMkQNjQ1gSO75TMkrtX0HubjKPjgTAmzxoY50xBXwjExoCjwBl5rzvtDlwC8o13JbRpxVtAAAAABJRU5ErkJggg==')
      no-repeat scroll 0 0 transparent;
    cursor: help;
  }
  .info-space {
    width: 24px;
    height: 24px;
    margin: 7px 5px 7px 0;
    float: left;
  }
`;
