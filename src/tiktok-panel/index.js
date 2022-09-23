Component({
  properties: {
    item: {
      type: Object,
      value: {}
    },
    opacity: {
      type: Number,
      value: 1
    },
    isCurrent: Boolean,
    isPlaying: Boolean,
    bottom: Number
  },

  data: {},

  methods: {
    onLikeTap: function () {
      const { item } = this.data;

      wx.vibrateShort({ type: 'short' });
      this.triggerEvent('onLikeTap', { item });
    },

    onCommentTap: function () {
      const { item } = this.data;
      this.triggerEvent('onCommentTap', { item });
    },

    onShareTap: function () {
      const { item } = this.data;

      wx.vibrateShort({ type: 'short' });
      this.triggerEvent('onShareTap', { item });
    },
    onMusicTap: function () {
      const { item } = this.data;
      this.triggerEvent('onMusicTap', { item });
    },

    onUserTap: function () {
      const { item } = this.data;
      this.triggerEvent('onUserTap', { item });
    }
  }
});
