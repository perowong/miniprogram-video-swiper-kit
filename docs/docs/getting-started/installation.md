---
sidebar_position: 1
---

# Installation
### Install from NPM

It's available as a package on NPM for use with a module bundler or in a Node application.  
In your miniprogram project root directory with package.json, run: 

```
# npm
npm i @miniprogram-video-components/video-swiper

# yarn
yarn add @miniprogram-video-components/video-swiper
```

You can check out this weChat miniprogram official doc to figure out 
[how to use npm](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html) in miniprogram project.

> If you want to install other components, just run:
> ```
> # npm
> npm i @miniprogram-video-components/{{component-name}}
> 
> # yarn
> yarn add @miniprogram-video-components/{{component-name}}
> ```

### All available components

- [video-swiper]()
- [slider]()
- [ ] tiktok-panel
- [ ] wechat-channel-panel

### Import component in page/component's json

> Take `video-swiper` for example

```json
"usingComponents": {
  "videoSwiper": "@miniprogram-video-components/video-swiper"
}
```

### Add component to page/component's wxml

> Take `video-swiper` for example

```html
<!-- list: your video items data with union id, url -->
<videoSwiper
  list="{{list}}"
></videoSwiper>
```