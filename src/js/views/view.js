import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  _eventsToListen;

  renderMessage(msg = this._msg) {
    const markup = `
      <div class="message">
          <div>
              <svg>
                  <use href="${icons}#icon-smile"></use>
              </svg>
          </div>
          <p>${msg}</p>
      </div>`;
    this.clean();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(msg = this._errorMsg) {
    const markup = `
      <div class="error">
          <div>
              <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
              </svg>
          </div>
          <p>${msg}</p>
      </div>`;
    this.clean();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner() {
    const markup = ` <div class="spinner">
                        <svg>
                          <use href="${icons}#icon-loader"></use>
                        </svg>
                     </div>`;
    this.clean();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  clean() {
    this._parentEl.innerHTML = '';
  }
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup(this._data);
    if (!render) return markup;
    this.clean();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup(this._data);
    const obj = document.createRange().createContextualFragment(newMarkup);
    const newDom = Array.from(obj.querySelectorAll('*'));
    const curDom = Array.from(this._parentEl.querySelectorAll('*'));
    curDom.forEach((curEl, i) => {
      const newEl = newDom[i];

      if (!curEl.isEqualNode(newEl)) {
        Array.from(newEl.attributes).forEach(att => {
          curEl.setAttribute(att.name, att.nodeValue);
        });
      }
      if (
        !curEl.isEqualNode(newEl) &&
        newEl.firstChild?.nodeValue.trim() &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.firstChild.textContent = newEl.firstChild.nodeValue;
      }
    });
  }
}
