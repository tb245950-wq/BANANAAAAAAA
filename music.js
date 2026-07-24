if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(function(){});
}

var PLAYLIST = [
  { src: 'assets/audio/jatuh-suka.mp3', title: 'Jatuh Suka' },
  { src: 'assets/audio/interaksi.mp3', title: 'Interaksi' },
  { src: 'assets/audio/about-you.mp3', title: 'About You' }
];

var Music = {
  audio: null,
  isPlaying: false,
  _saveInterval: null,
  _trackIndex: 0,

  init: function() {
    if (this.audio) return;
    this._trackIndex = parseInt(localStorage.getItem('musikTrack') || '0', 10);
    if (this._trackIndex >= PLAYLIST.length) this._trackIndex = 0;
    this._createAudio();
  },

  _createAudio: function() {
    if (this.audio) {
      this.audio.pause();
      this.audio.removeEventListener('ended', this._endedBound);
    }
    this.audio = new Audio(PLAYLIST[this._trackIndex].src);
    this.audio.volume = 0.4;
    this.audio.loop = false;
    this.audio.preload = 'auto';
    this._endedBound = this._onEnded.bind(this);
    this.audio.addEventListener('ended', this._endedBound);
  },

  _onEnded: function() {
    if (this._trackIndex < PLAYLIST.length - 1) {
      this._trackIndex++;
      localStorage.setItem('musikTrack', this._trackIndex);
      localStorage.setItem('musikPosisi', '0');
      var self = this;
      this._createAudio();
      this.audio.currentTime = 0;
      this.audio.addEventListener('canplay', function handler() {
        self.audio.removeEventListener('canplay', handler);
        self.audio.play().then(function() {
          self.isPlaying = true;
          self._updateUI(true);
          self._startSaving();
        }).catch(function(){});
      });
    } else {
      this.isPlaying = false;
      clearInterval(this._saveInterval);
      localStorage.setItem('musikAktif', 'tidak');
      localStorage.removeItem('musikPosisi');
      localStorage.removeItem('musikTrack');
      this._trackIndex = 0;
      this._updateUI(false);
      this._showStopAlert();
    }
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
    if (note) {
      note.style.display = playing ? 'none' : '';
      if (playing) note.textContent = '🎶 ' + PLAYLIST[this._trackIndex].title;
    }
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
    localStorage.removeItem('musikTrack');
    this._trackIndex = 0;
    this._updateUI(false);
  }
};

function toggleMusic() { Music.toggle(); }

function alertSetujuMusik() {
  document.getElementById('musikAlert').style.display = 'none';
  Music._trackIndex = 0;
  localStorage.setItem('musikTrack', '0');
  Music._createAudio();
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
  Music._trackIndex = 0;
  localStorage.setItem('musikTrack', '0');
  Music._createAudio();
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
