import View from './view';
import icons from 'url:../../img/icons.svg';
class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  #generateNext(curPage) {
    return `<button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
                    <span>${curPage + 1}</span>
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>`;
  }
  #generatePrev(curPage) {
    return `<button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
                    <span>${curPage - 1}</span>
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                </button>`;
  }
  _generateMarkup() {
    const pages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const curPage = this._data.page;
    //noo need to pagination
    if (pages === 1) return '';
    // first page
    if (pages > 1 && curPage === 1) return this.#generateNext(curPage);
    // middle page
    if (curPage > 1 && curPage < pages)
      return this.#generatePrev(curPage).concat(this.#generateNext(curPage));
    //last page
    if (pages > 1 && curPage === pages) return this.#generatePrev(curPage);
  }
  addHandlerGoTO(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goTo = +btn.dataset.goto;
      handler(goTo);
    });
  }
}

export default new PaginationView();
