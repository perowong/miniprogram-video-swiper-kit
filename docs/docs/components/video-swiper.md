---
sidebar_position: 1
---

# video-swiper

## Basic using

```json
{
  "usingComponents": {
    "videoSwiper": "@miniprogram-video-swiper-kit/video-swiper"
  }
}
```

```js
// page js
Page({
  data: {
    list: [
      {
        id: 'videoId-210709224656837141',
        url: 'http://vfx.mtime.cn/Video/2021/07/09/mp4/210709224656837141.mp4',
        du: 167000,
        objectFit: 'contain'
      },
      {
        id: 'videoId-210710094507540173',
        url: 'http://vfx.mtime.cn/Video/2021/07/10/mp4/210710094507540173.mp4',
        du: 132000,
        objectFit: 'contain'
      }
    ]
  },

  onSwiperChanged({ detail }) {
    const { item } = detail;
    console.log('swiper changed to: ', item);
  }
});
```

```html
<!-- page wxml -->
<videoSwiper
  debug="{{true}}"
  list="{{list}}"
  sliderBottom="{{40}}"
  bind:onSwiperChanged="onSwiperChanged"
  generic:swiperItemPanel="view"
></videoSwiper>
```

## API

### video-swiper

| Property                | Type    | Default | Required | Description                                                                                                         |
| :---------------------- | :------ | :------ | :------- | :------------------------------------------------------------------------------------------------------------------ |
| debug                   | Boolean | false   | no       | If true, it will console.log all debug log with `[Log videoSwiper]` prefix from video-swiper                        |
| list                    | Array   | []      | yes      | Swiper's data list. Format: [VideoSwiperItem](#VideoSwiperItem)                                                     |
| sliderBottom            | Number  | 0       | no       | The fixed bottom position of slider                                                                                 |
| bind:onSwiperChanged    | event   | 0       | no       | Triggers at the end of the animation swiper `bindanimationfinish` Event, event.detail = [EventDetail](#EventDetail) |
| generic:swiperItemPanel | String  | 0       | yes      | Abstract Node: render panel above swiper-item. You can set it as `view` if unnecessary                              |

### VideoSwiperItem

### EventDetail
