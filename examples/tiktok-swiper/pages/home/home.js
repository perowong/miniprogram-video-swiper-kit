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
    console.log(item);
  }
});
