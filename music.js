if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(function(){});
}

var Music = {
  audio: null,
  isPlaying: false,
  _saveInterval: null,

  init: function() {
    if (this.audio) return;
    this.audio = new Audio('assets/audio/jatuh-suka.mp3');
    this.audio.volume = 0.4;
    this.audio.loop = false;
    this.audio.preload = 'auto';
    var self = this;
    this.audio.addEventListener('ended', function() { self._onEnded(); });
  },

  _onEnded: function() {
    this.isPlaying = false;
    clearInterval(this._saveInterval);
    localStorage.setItem('musikAktif', 'tidak');
    localStorage.removeItem('musikPosisi');
    this._updateUI(false);
    this._showStopAlert();
  },

  _showStopAlert: function() {
    var ids = ['musikStopAlert','musikStopAlertPesan','musikStopAlertLanjut','musikStopAlertLogin'];
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el) { el.style.display = 'flex'; return; }
    }
  },

  _updateUI: function(playing) {
    var btn = document.getElementById('musicBtn');
    var note = document.getElementById('musicNote');
    if (btn) {
      btn.textContent = playing ? '🎶' : '🎵';
      if (playing) btn.classList.add('playing');
      else btn.classList.remove('playing');
    }
    if (note) note.style.display = playing ? 'none' : '';
  },

  _startSaving: function() {
    var self = this;
    clearInterval(this._saveInterval);
    this._saveInterval = setInterval(function() {
      if (self.audio && self.isPlaying) {
        localStorage.setItem('musikPosisi', self.audio.currentTime);
      }
    }, 100);
  },

  play: function(startPos) {
    this.init();
    var self = this;
    var pos = startPos !== undefined ? startPos : parseFloat(localStorage.getItem('musikPosisi') || '0');
    this.audio.currentTime = pos;
    return this.audio.play().then(function() {
      self.isPlaying = true;
      localStorage.setItem('musikAktif', 'ya');
      self._updateUI(true);
      self._startSaving();
    }).catch(function(){});
  },

  pause: function() {
    if (!this.audio) return;
    this.audio.pause();
    this.isPlaying = false;
    clearInterval(this._saveInterval);
    localStorage.setItem('musikAktif', 'tidak');
    this._updateUI(false);
  },

  toggle: function() {
    if (this.isPlaying) this.pause();
    else this.play();
  },

  resume: function() {
    if (localStorage.getItem('musikAktif') === 'ya') {
      this.play();
    }
  },

  stop: function() {
    if (this.audio) this.audio.pause();
    this.isPlaying = false;
    clearInterval(this._saveInterval);
    localStorage.setItem('musikAktif', 'tidak');
    localStorage.removeItem('musikPosisi');
    this._updateUI(false);
  }
};

function toggleMusic() { Music.toggle(); }

function alertSetujuMusik() {
  document.getElementById('musikAlert').style.display = 'none';
  Music.play(0);
}

function alertTolakMusik() {
  document.getElementById('musikAlert').style.display = 'none';
  localStorage.setItem('musikAktif', 'tidak');
}

function lanjutMusik() {
  var ids = ['musikStopAlert','musikStopAlertPesan','musikStopAlertLanjut','musikStopAlertLogin'];
  for (var i = 0; i < ids.length; i++) {
    var el = document.getElementById(ids[i]);
    if (el) el.style.display = 'none';
  }
  Music.play(0);
}

function tanpaMusik() {
  var ids = ['musikStopAlert','musikStopAlertPesan','musikStopAlertLanjut','musikStopAlertLogin'];
  for (var i = 0; i < ids.length; i++) {
    var el = document.getElementById(ids[i]);
    if (el) el.style.display = 'none';
  }
  Music.stop();
}

function savePositionNow() {
  if (Music.audio && Music.isPlaying) {
    localStorage.setItem('musikPosisi', Music.audio.currentTime);
  }
}

document.addEventListener('click', function(e) {
  var a = e.target.closest('a[href]');
  if (a && Music.audio && Music.isPlaying) {
    localStorage.setItem('musikPosisi', Music.audio.currentTime);
  }
});

window.addEventListener('beforeunload', function() {
  if (Music.audio && Music.isPlaying) {
    localStorage.setItem('musikPosisi', Music.audio.currentTime);
  }
});
