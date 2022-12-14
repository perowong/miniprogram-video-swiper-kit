let startY, endY, isOpacityChanged;
import { loadingIcon, playIcon } from '../icons/index';
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

    // swiper
    list: Array,
    mutateCurrent: {
      type: Number,
      observer(newVal, oldVal) {
        if (newVal !== oldVal) {
          wx.nextTick(() => {
            this.setData({ current: newVal });
          });
        }
      }
    },
    easingFunction: {
      type: String,
      value: 'easeOutCubic'
    },

    // ui default icon
    playIcon: {
      type: String,
      value: playIcon
    },
    loadingIcon: {
      type: String,
      value: loadingIcon
    },
    disableOpacityWhenSwiping: Boolean,

    // slider
    enableSlider: {
      type: Boolean,
      value: true
    },
    thresholdOfSliderActive: Number, // set in millisecond
    sliderBottom: Number,

    // swiperItemPanel
    swiperItemPanelBottom: Number,

    // debug
    debug: Boolean
  },

  /**
   * component's initial data
   */
  data: initialData(),

  lifetimes: {
    /* attached() {
      wx.onAppHide(() => {
        const { current, list } = this.data;
        this._triggerEvent('releaseVideoSwiperWhenAppHide', { e, current, itemId: list[current]?.id, ctx: this });
      });
    } */
  },

  /**
   * component's methods
   */
  methods: {
    resetPrivateData() {
      this.setData(initialData());
    },

    _log(...args) {
      if (!this.data.debug) {
        return;
      }

      console.log('[Log videoSwiper] ', ...args);
    },

    _idPrefix(vid) {
      return `videoSwiper-${vid}`;
    },

    _triggerEvent(name, { e, current, itemId, item = undefined, ...rest }) {
      const cur = current || this.data._current;
      const iid = itemId || e?.currentTarget?.dataset?.itemId;

      this.triggerEvent(name, {
        nativeEvent: e,
        current: cur,
        itemId: iid,
        item: item || this.data.list[current],
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

      this._triggerEvent('onSwiperChanged', { e, current, itemId: currentItemId });
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
      this._log('on video play: ', id);

      waitingTimer && clearTimeout(waitingTimer);
      waitingTimer = null;

      this.data._isPlayingItems[itemId] = true;
      this.data._isWaitingItems[itemId] = false;
      this.setData({
        isPlayingItems: this.data._isPlayingItems,
        isWaitingItems: this.data._isWaitingItems
      });

      const current = this.data.current;
      this._triggerEvent('onVideoPlay', { e, current, itemId });
    },

    onVideoPause(e) {
      const {
        currentTarget: {
          id,
          dataset: { itemId }
        }
      } = e;
      this._log('on video pause: ', id);

      this.data._isPlayingItems[itemId] = false;
      this.setData({
        isPlayingItems: this.data._isPlayingItems
      });

      const current = this.data.current;
      this._triggerEvent('onVideoPause', { e, current, itemId });
    },

    onVideoTimeUpdate(e) {
      const {
        detail: { currentTime, duration },
        currentTarget: {
          dataset: { itemId }
        }
      } = e;

      const { current, list, enableSlider, thresholdOfSliderActive } = this.data;
      const curItem = list[current];

      // make it compatible with some item without id (e.g. wx advertisement) or exception
      // [wx bug] currentTime and duration sometimes would be 0 and null
      if (!curItem || !curItem.id || !currentTime || !duration) {
        return;
      }

      this._triggerEvent('onVideoTimeUpdate', {
        e,
        current,
        itemId,
        item: curItem,
        // [wx bug, time thread bug] the previous video's ontimeupdate is still active after swiping to the next video small second.
        playItemId: itemId,

        currentTime,
        currentTimeMillisecond: currentTime * 1000,
        duration,
        durationMillisecond: curItem.du || duration * 1000
      });

      if (enableSlider && curItem.du && duration * 1000 >= thresholdOfSliderActive) {
        this.setData({
          sliderProgress: (currentTime / duration) * 100
        });
      }

      // [wx bug] sometimes wx will still play the last one video
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

    onVideoEnded(e) {
      this._triggerEvent('onVideoEnded', { e });
    },
    onVideoWaiting(e) {
      this._triggerEvent('onVideoWaiting', { e });
    },
    onVideoProgress(e) {
      this._triggerEvent('onVideoProgress', { e });
    },
    onVideoError(e) {
      this._triggerEvent('onVideoError', { e });
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
        e,
        current: _current,
        itemId
      });
    },

    /**
     * Control video play, pause, seek, etc.
     */
    _getVideoCtxExec(videoId, { eventName, args, source }) {
      this._log(`${eventName} ${videoId}, args: ${args}, source: ${source}`);

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
      if (this.data.disableOpacityWhenSwiping) {
        return;
      }

      const { touches } = e;
      startY = touches[0].pageY;
    },

    onTouchMove(e) {
      if (this.data.disableOpacityWhenSwiping) {
        return;
      }

      const { touches } = e;
      endY = touches[0].pageY;

      if (endY - startY <= -OPACITY_DRAG_DISTANCE || endY - startY >= OPACITY_DRAG_DISTANCE) {
        if (isOpacityChanged) {
          return;
        }

        isOpacityChanged = true;
        this._log('opaques ui elements when swiping');
        this.setData({ infoOpacity: OPACITY_WHEN_SWIPING });
      }
    },

    onTouchEnd(e) {
      if (this.data.disableOpacityWhenSwiping) {
        return;
      }

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
      const curItem = list[current];

      this._seekVideo(
        this._idPrefix(curItem.id),
        (curItem.du / 1000) * (progress / 100),
        'userDragSliderEnd'
      );

      this.setData({ infoOpacity: NO_OPACITY });
    },

    /**
     * panel
     */
    _triggerSIPEvent(name, e) {
      const {
        currentTarget: {
          dataset: { current }
        },
        detail: { item }
      } = e;
      this._triggerEvent(name, {
        e,
        current,
        itemId: item.id,
        item
      });
    },
    onSIPLikeTap(e) {
      this._triggerSIPEvent('onSwiperItemPanelLikeTap', e);
    },
    onSIPCommentTap(e) {
      this._triggerSIPEvent('onSwiperItemPanelCommentTap', e);
    },
    onSIPShareTap(e) {
      this._triggerSIPEvent('onSwiperItemPanelShareTap', e);
    },
    onSIPMusicTap(e) {
      this._triggerSIPEvent('onSwiperItemPanelMusicTap', e);
    },
    onSIPUserTap(e) {
      this._triggerSIPEvent('onSwiperItemPanelUserTap', e);
    },
    onSIPFollowTap(e) {
      this._triggerSIPEvent('onSwiperItemPanelFollowTap', e);
    }
  }
});
