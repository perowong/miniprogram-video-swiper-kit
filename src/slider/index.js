const screenWidth = systemInfo.screenWidth;

let sliderHandlerStartX = 0,
  sliderHandlerEndX = 0;
const SLIDER_STATUS_NORMAL = 'normal';
const SLIDER_STATUS_ACTIVE = 'active';
const SLIDER_STATUS_DRAG = 'drag';

const STATUS_CHANGE_TIME = 3 * 1000;
let statusChangeTimer = null;

let lastDeltaProgress = 0;
let isProgressObserverAvailable = true;
let _sliderStatus = SLIDER_STATUS_NORMAL;

Component({
  options: {
    addGlobalClass: true,
    pureDataPattern: /^_/
  },
  /**
   * component's properties
   */
  properties: {
    // show: true,
    duration: 0,
    isProgressActive: false,
    infoAreaBottom: 0,
    progress: {
      type: Number,
      value: 0,
      observer(newVal, oldVal) {
        if (
          !isProgressObserverAvailable ||
          newVal === oldVal ||
          _sliderStatus === SLIDER_STATUS_DRAG
        ) {
          return;
        }
        isProgressObserverAvailable = false;

        this.setData(
          {
            selfProgress: newVal
          },
          () => {
            isProgressObserverAvailable = true;
          }
        );
      }
    }
  },

  /**
   * component's initial data
   */
  data: {
    selfProgress: 0,
    _pivotProgress: 0,
    sliderStatus: SLIDER_STATUS_NORMAL,
    _nextProgress: 0,
    curTime: '',
    videoTime: ''
  },

  /**
   * component's methods
   */
  methods: {
    reset() {
      console.log('reset');
      this.setData({ selfProgress: 0 });
    },

    _onSliderTouchStart(e) {
      statusChangeTimer && clearTimeout(statusChangeTimer);

      const { touches } = e;
      sliderHandlerStartX = touches[0].pageX;

      this.setData({
        sliderStatus: SLIDER_STATUS_ACTIVE
      });
      _sliderStatus = SLIDER_STATUS_ACTIVE;

      this.data._pivotProgress = this.data.selfProgress;
      lastDeltaProgress = 0;
    },

    _onSliderTouchMove(e) {
      const { touches } = e;
      sliderHandlerEndX = touches[0].pageX;

      const deltaProgress = ((sliderHandlerEndX - sliderHandlerStartX) / screenWidth) * 100;

      if (Math.abs(lastDeltaProgress - deltaProgress) < 1) {
        return;
      }
      lastDeltaProgress = deltaProgress;

      let nextProgress = this.data._pivotProgress + deltaProgress;

      if (nextProgress < 0) {
        nextProgress = 0;
      }
      if (nextProgress > 100) {
        nextProgress = 100;
      }

      const curMs = this._getMsByProgress(nextProgress);
      const { mm: curMm, ss: curSs } = this._ms2mmss(curMs);
      const { mm: videoMm, ss: videoSs } = this._ms2mmss(this.data.duration);

      const nextData = {
        selfProgress: nextProgress,
        curTime: `${curMm}:${curSs}`,
        videoTime: `${videoMm}:${videoSs}`
      };

      if (_sliderStatus !== SLIDER_STATUS_DRAG) {
        nextData.sliderStatus = SLIDER_STATUS_DRAG;

        this.setData(nextData);
        _sliderStatus = SLIDER_STATUS_DRAG;

        this.triggerEvent('onDragStart');
      } else {
        this.setData(nextData);
      }
      this.data._nextProgress = nextProgress;
    },

    _onSliderTouchEnd(e) {
      this.setData({
        sliderStatus: SLIDER_STATUS_ACTIVE
      });
      _sliderStatus = SLIDER_STATUS_ACTIVE;

      this.triggerEvent('onDragEnd', {
        progress: this.data._nextProgress
      });

      statusChangeTimer = setTimeout(() => {
        this.setData({
          sliderStatus: SLIDER_STATUS_NORMAL
        });
        _sliderStatus = SLIDER_STATUS_NORMAL;
      }, STATUS_CHANGE_TIME);
    },

    _getMsByProgress(progress) {
      return this.data.duration * (progress / 100);
    },

    _ms2mmss(ms) {
      const s = Math.floor(ms / 1000);
      let ss = s % 60;
      let mm = Math.floor(s / 60);

      return {
        mm: mm >= 10 ? mm : `0${mm}`,
        ss: ss >= 10 ? ss : `0${ss}`
      };
    }
  }
});
