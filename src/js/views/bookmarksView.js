import previewView from './previewView';
import View from './view';

class BookmarksView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMsg = 'No bookmarks yet. Find a nice recipe and bookmark it 🔍';

  addHandlerBookmarks(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
