---
sidebar_position: 1
---

# video-swiper

## Introduction

video-swiper is a basic component that we can use it to construct smoothly swiping user experience
in playing video scenario, specifically, e.g tiktok video swiper, wechat channel swiper, etc.

## Installation

```
# npm
npm i @miniprogram-video-swiper-kit/video-swiper

# yarn
yarn add @miniprogram-video-swiper-kit/video-swiper
```

## Basic usage

`page.json`

```json
{
  "usingComponents": {
    "videoSwiper": "@miniprogram-video-swiper-kit/video-swiper"
  }
}
```

`page.js`

```js
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

`page.wxml`

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

| Property                         | Type    | Default      | Required | Description                                                                                                                                                                              |
| :------------------------------- | :------ | :----------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| debug                            | Boolean | false        | no       | If true, it will console.log all debug log with `[Log videoSwiper]` prefix from video-swiper                                                                                             |
| list                             | Array   | []           | yes      | Swiper's data list. Format: [VideoSwiperItem](#videoswiperitem)                                                                                                                          |
| generic:swiperItemPanel          | String  | view         | yes      | Abstract Node: render panel above swiper-item. You can set it as `view` if unnecessary                                                                                                   |
| safeBottom                       | Number  | 0            | no       | Container's safe area distance to the window bottom                                                                                                                                      |
| easingFunction                   | String  | easeOutCubic | no       | Designation swiper Toggle Slow Animation Type                                                                                                                                            |
| mutateCurrent                    | Number  |              | no       | It is used to jump to a specific location of swiper list, and set the swiper current to the mutateCurrent                                                                                |
| disableOpacityWhenSwiping        | Boolean | false        | no       | when swiping to the another, disable the element's opacity animation                                                                                                                     |
| playIcon                         | String  |              | no       | The URL of play icon                                                                                                                                                                     |
| loadingIcon                      | String  |              | no       | The URL of loading icon                                                                                                                                                                  |
| enableSlider                     | Boolean | true         | no       | Enable the default [slider](./slider) component                                                                                                                                          |
| thresholdOfSliderActive          | Number  | 0            | no       | The progress threshold of activating slider with it's current progress/duration (unit: millisecond)                                                                                      |
| sliderBottom                     | Number  | 0            | no       | The fixed bottom position of slider                                                                                                                                                      |
| bind:onSwiperChanged             | Event   |              | no       | Triggered when the animation swiper `bindanimationfinish` Event ended. event.detail = { ...[EventDetail](#eventdetail) }                                                                 |
| bind:onVideoPlay                 | Event   |              | no       | Triggered when the video start playing. event.detail = { ...[EventDetail](#eventdetail) }                                                                                                |
| bind:onVideoPause                | Event   |              | no       | Triggered when pausing the video. event.detail = { ...[EventDetail](#eventdetail) }                                                                                                      |
| bind:onVideoTimeUpdate           | Event   |              | no       | Triggered when the video current playing time updated. event.detail = { ...[EventDetail](#eventdetail), playItemId, currentTime, currentTimeMillisecond, duration, durationMillisecond } |
| bind:onVideoEnded                | Event   |              | no       | Triggered when the video ended play. event.detail = { ...[EventDetail](#eventdetail) }                                                                                                   |
| bind:onVideoWaiting              | Event   |              | no       | Triggered when the video buffer appears. event.detail = { ...[EventDetail](#eventdetail) }                                                                                               |
| bind:onVideoProgress             | Event   |              | no       | Triggered when the video progress updated. event.detail = { ...[EventDetail](#eventdetail) }                                                                                             |
| bind:onVideoError                | Event   |              | no       | Triggered when the video encountered some error. event.detail = { ...[EventDetail](#eventdetail) }                                                                                       |
| bind:onLoadedMetadata            | Event   |              | no       | Triggered when the video metadata is loaded. event.detail = { ...[EventDetail](#eventdetail) }                                                                                           |
| bind:onSwiperItemPanelLikeTap    | Event   |              | no       | Triggered when the generic panel's like button tapped. event.detail = { ...[EventDetail](#eventdetail) }                                                                                 |
| bind:onSwiperItemPanelCommentTap | Event   |              | no       | Triggered when the generic panel's comment button tapped. event.detail = { ...[EventDetail](#eventdetail) }                                                                              |
| bind:onSwiperItemPanelShareTap   | Event   |              | no       | Triggered when the generic panel's share button tapped. event.detail = { ...[EventDetail](#eventdetail) }                                                                                |
| bind:onSwiperItemPanelMusicTap   | Event   |              | no       | Triggered when the generic panel's music button tapped. event.detail = { ...[EventDetail](#eventdetail) }                                                                                |
| bind:onSwiperItemPanelUserTap    | Event   |              | no       | Triggered when the generic panel's user profile button tapped. event.detail = { ...[EventDetail](#eventdetail) }                                                                         |
| bind:onSwiperItemPanelFollowTap  | Event   |              | no       | Triggered when the generic panel's follow user button tapped. event.detail = { ...[EventDetail](#eventdetail) }                                                                          |

### VideoSwiperItem

| Property  | Type          | Default | Required | Description                                                                                                                                                                                                                                                                              |
| :-------- | :------------ | :------ | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | Number/String |         | yes      | The union ID of item                                                                                                                                                                                                                                                                     |
| url       | String        |         | yes      | The item's video url                                                                                                                                                                                                                                                                     |
| du        | Number        |         | yes      | The item's video duration                                                                                                                                                                                                                                                                |
| poster    | String        |         | no       | The item's poster cover url                                                                                                                                                                                                                                                              |
| objectFit | String        | cover   | no       | The video representation when container size is inconsistent. If the value of (`cover`, `fill`, `contain`) is given, the container will use the corresponding value. You can also set the vw, vh, and ratio, <br />if `vw/vh <= item.ratio`, it will be `cover`, or it will be `contain` |
| vw        | Number        |         | no       | The video's width                                                                                                                                                                                                                                                                        |
| vh        | Number        |         | no       | The video's height                                                                                                                                                                                                                                                                       |
| ratio     | Number        | 0.6     | no       | Ratio of the video's width to height                                                                                                                                                                                                                                                     |

Other properties is depended on your customized abstract swiperItemPanel node's data structure.

### EventDetail

| Property    | Type            | Description                                         |
| :---------- | :-------------- | :-------------------------------------------------- |
| nativeEvent | Boolean         | weChat miniprogram's native event                   |
| current     | Number          | The current index of list when user event triggered |
| itemId      | Number/String   | The item's id when user event triggered             |
| item        | VideoSwiperItem | The item when user event triggered                  |

Other properties is depended on the particular event triggered.
