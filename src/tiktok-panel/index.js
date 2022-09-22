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

  data: {
    
  },

  methods: {
    onLikeTap: function () {
      const { item } = this.data;

      wx.vibrateShort({ type: 'short' });
      this.triggerEvent('likeTap', { item });
    },

    onCommentTap: function () {
      const { item } = this.data;
      this.triggerEvent('commentTap', { item });
    },

    onShareTap: function () {
      const { item } = this.data;

      wx.vibrateShort({ type: 'short' });
      this.triggerEvent('shareTap', { item });
    }
  }
});
