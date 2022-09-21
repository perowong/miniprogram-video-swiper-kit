let startY, endY, isOpacityChanged;
import { OPACITY_DRAG_DISTANCE, OPACITY_WHEN_SWIPING, ALL_CLEAR, NO_OPACITY } from './const';

let waitingTimer = null;

const initialData = () => ({
  sliderProgress: 0,
  infoOpacity: 1,

  isPlayingItems: {},
  _isPlayingItems: {}, // synchronous isPlayingItems

  isWaitingItems: {},
  _isWaitingItems: {}, // synchronous isWaitingItems

  current: 0,
  _current: 0, // synchronous current

  _videoMetadataMap: {}
});

Component({
  options: {
    pureDataPattern: /^_/,
    multipleSlots: true
  },
  /**
   * component's properties
   */
  properties: {
    safeBottom: Number,
    infoAreaBottom: Number,
    list: Array,
    showSlider: {
      type: Boolean,
      value: true
    },
    sliderThreshold: {
      type: Number,
      value: 30
    },
    mutateCurrent: {
      type: Number,
      observer(newVal, oldVal) {
        if (newVal !== oldVal) {
          wx.nextTick(() => {
            this.setData({ current: newVal });
          });
        }
      }
    }
  },

  /**
   * component's initial data
   */
  data: initialData(),

  lifetimes: {
    attached() {
      wx.onAppHide(() => {
        const { current } = this.data;
        this.triggerEvent('releaseVideoSwiperWhenAppHide', { current, ctx: this });
      });
    }
  },

  /**
   * component's methods
   */
  methods: {
    resetPrivateData() {
      this.setData(initialData());
    },

    _idPrefix(vid) {
      return `videoSwiper-${vid}`;
    },

    _triggerEvent(name, { current, itemId, ...rest }) {
      this.triggerEvent(name, {
        current,
        itemId,
        item: this.data.list[current],
        ...rest
      });
    },

    /**
     * swiper's methods
     */
    onSwiperChange(e) {
      const {
        detail: { current }
      } = e;

      this.data._current = current;
    },

    onSwiperAnimationFinish(e) {
      const {
        detail: { current, currentItemId }
      } = e;
      const lastIdx = this.data.current;

      if (lastIdx === current) {
        return;
      }

      this.data._current = current;
      this.setData({
        current,
        sliderProgress: 0
      });

      /**
       * 1. pause the last video
       * 2. check whether video's metadata has loaded
       *   - yes: play the next video
       *   - no: set a 600ms setTimeout waiting timer to show loading icon after 1s when video would not play yet.
       *         If video plays, clear the waiting timer
       */
      const lastItemId = this.data.list[lastIdx].id;
      this._pauseVideo(this._idPrefix(lastItemId), lastItemId, 'swiperAnimationFinish');

      if (!this._hasVideoMetadata(currentItemId)) {
        waitingTimer = setTimeout(() => {
          this.data._isWaitingItems[currentItemId] = true;
          this.setData({
            isWaitingItems: this.data._isWaitingItems
          });
        }, 600);
      } else {
        this._playVideo(this._idPrefix(currentItemId), currentItemId, 'swiperAnimationFinish');
      }

      this._triggerEvent('swipeVideoChanged', { current, itemId: currentItemId });
    },

    /**
     * On video tap response
     */
    onVideoTap(e) {
      const {
        currentTarget: {
          id,
          dataset: { itemId, swiperItemId }
        }
      } = e;

      const videoId = id || swiperItemId;
      // it's should use isPlayingItems result, because user click the visualized icon button
      if (this.data.isPlayingItems[itemId]) {
        this._pauseVideo(videoId, itemId, 'userTapVideo');
      } else {
        this._playVideo(videoId, itemId, 'userTapVideo');
      }
    },

    /**
     * On video's native events response
     */
    onVideoPlay(e) {
      const {
        currentTarget: {
          id,
          dataset: { itemId }
        }
      } = e;
      console.log('on video play: ', id);

      waitingTimer && clearTimeout(waitingTimer);
      waitingTimer = null;

      this.data._isPlayingItems[itemId] = true;
      this.data._isWaitingItems[itemId] = false;
      this.setData({
        isPlayingItems: this.data._isPlayingItems,
        isWaitingItems: this.data._isWaitingItems
      });

      const current = this.data.current;
      this._triggerEvent('videoPlay', { current, itemId });
    },

    onVideoPause(e) {
      const {
        currentTarget: {
          id,
          dataset: { itemId }
        }
      } = e;
      console.log('on video pause: ', id);
      this.data._isPlayingItems[itemId] = false;
      this.setData({
        isPlayingItems: this.data._isPlayingItems
      });

      const current = this.data.current;
      this._triggerEvent('videoPause', { current, itemId });
    },

    onVideoTimeUpdate(e) {
      const {
        detail: { currentTime, duration },
        currentTarget: {
          dataset: { itemId }
        }
      } = e;

      const { current, list, showSlider, sliderThreshold } = this.data;
      const curItem = list[current];

      // make it compatible with some item without id (e.g. wx advertisement) or exception
      // [wx bug] currentTime and duration sometimes would be 0 and null
      if (!curItem || !curItem.id || !currentTime || !duration) {
        return;
      }

      this._triggerEvent('videoTimeupdate', {
        current,
        itemId,
        item: curItem,
        // [wx bug, time thread bug] the previous video's ontimeupdate is still active after swiping to the next video small second.
        playItemId: itemId,
        currentTime,
        duration
      });

      if (showSlider && duration >= sliderThreshold) {
        this.setData({
          sliderProgress: (currentTime / duration) * 100
        });
      }

      if (itemId !== curItem.id) {
        this._pauseVideo(this._idPrefix(itemId), itemId, 'timeUpdate');
      }

      // compatibility
      if (this.data._isWaitingItems[itemId]) {
        this.data._isWaitingItems[itemId] = false;
        this.setData({
          isWaitingItems: this.data._isWaitingItems
        });
      }
    },

    /**
     * On video data waiting and loaded
     */
    _setVideoMetadata(id) {
      this.data._videoMetadataMap[id] = true;
    },

    _hasVideoMetadata(id) {
      return this.data._videoMetadataMap[id];
    },

    onVideoLoadedMetadata(e) {
      const {
        currentTarget: {
          id,
          dataset: { idx, itemId }
        }
      } = e;

      const { _current } = this.data;
      if (_current === idx && !this.data._isPlayingItems[itemId]) {
        this._playVideo(id, itemId, 'loadedMetadata');
      }

      this._setVideoMetadata(itemId);

      this._triggerEvent('onLoadedMetadata', {
        current: _current,
        itemId
      });
    },

    /**
     * Control video play, pause, seek, etc.
     */
    _getVideoCtxExec(videoId, { eventName, args, source }) {
      console.log(`${eventName} ${videoId}, args: ${args}, source: ${source}`);

      this.createSelectorQuery()
        .select(`#${videoId}`)
        .context(function (res) {
          res && res.context[eventName] && res.context[eventName](args);
        })
        .exec();
    },

    _playVideo(videoId, itemId, source) {
      if (!videoId || this.data._isPlayingItems[itemId]) {
        return;
      }

      this.data._isPlayingItems[itemId] = true;
      this._getVideoCtxExec(videoId, {
        eventName: 'play',
        source
      });
    },

    _pauseVideo(videoId, itemId, source) {
      if (!videoId || !this.data._isPlayingItems[itemId]) {
        return;
      }

      this.data._isPlayingItems[itemId] = false;
      this._getVideoCtxExec(videoId, {
        eventName: 'pause',
        source
      });
    },

    _seekVideo(videoId, time, source) {
      this._getVideoCtxExec(videoId, {
        eventName: 'seek',
        args: time,
        source
      });
    },

    /**
     * Touch stuff
     * control component's opacity
     */
    onTouchStart(e) {
      const { touches } = e;
      startY = touches[0].pageY;
    },

    onTouchMove(e) {
      const { touches } = e;
      endY = touches[0].pageY;

      if (endY - startY <= -OPACITY_DRAG_DISTANCE || endY - startY >= OPACITY_DRAG_DISTANCE) {
        if (isOpacityChanged) {
          return;
        }

        isOpacityChanged = true;
        console.log('opacity appears when swiping');
        this.setData({ infoOpacity: OPACITY_WHEN_SWIPING });
      }
    },

    onTouchEnd(e) {
      startY = 0;
      endY = 0;
      this.setData({ infoOpacity: NO_OPACITY }, () => {
        isOpacityChanged = false;
      });
    },

    /**
     * Slider events
     */
    onSliderDragStart() {
      this.setData({ infoOpacity: ALL_CLEAR });
    },

    onSliderDragEnd({ detail: { progress } }) {
      const { current, list } = this.data;
      const curPost = list[current];

      this._seekVideo(
        this._idPrefix(curPost.id),
        (curPost.du / 1000) * (progress / 100),
        'userDragSliderEnd'
      );

      this.setData({ infoOpacity: NO_OPACITY });
    }
  }
});
