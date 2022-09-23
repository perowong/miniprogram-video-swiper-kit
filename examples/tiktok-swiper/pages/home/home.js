// pages/home/home.js
import mockData from './mockData.js';

Page({
  /**
   * Page initial data
   */
  data: {
    list: mockData.list
  },

  onSwiperChanged({ detail }) {
    const { item } = detail;
    console.log('swiper changed to: ', item);
  },

  onSwiperItemPanelLikeTap(e) {
    const {
      detail: { item }
    } = e;
    console.log('like: ', item);

    const list = this.data.list.map((i) => {
      if (i.id === item.id) {
        return {
          ...i,
          hasLiked: !item.hasLiked
        };
      }
      return i;
    });

    this.setData({
      list
    });
  },

  onSwiperItemPanelCommentTap(e) {
    const {
      detail: { item }
    } = e;
    console.log('comment: ', item);
  },

  onSwiperItemPanelShareTap(e) {
    const {
      detail: { item }
    } = e;
    console.log('share: ', item);
  },

  onSwiperItemPanelUserTap(e) {
    const {
      detail: { item }
    } = e;
    console.log('user: ', item);
  },

  onSwiperItemPanelMusicTap(e) {
    const {
      detail: { item }
    } = e;
    console.log('music: ', item);
  }
});
