# Miniprogram-video-swiper-kit

<p align="center">
  <img
    src="https://raw.githubusercontent.com/perowong/miniprogram-video-swiper-kit/main/logo/miniprogram-video-swiper-kit-logo.svg"
    height="120"
  />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@miniprogram-video-swiper-kit/video-swiper" alt="NPM Version">
    <img src="https://img.shields.io/npm/v/@miniprogram-video-swiper-kit/video-swiper?color=brightgreen" />
  </a>
  <a href="https://github.com/perowong/miniprogram-video-swiper-kit/actions/workflows/deploy-docs.yml" alt="NPM Version">
    <img src="https://github.com/perowong/miniprogram-video-swiper-kit/actions/workflows/deploy-docs.yml/badge.svg" />
  </a>
</p>

If this kit is useful to you, you can support me by [staring the repo ⭐️](https://github.com/perowong/miniprogram-video-swiper-kit)

This is an out-of-box open-source miniprogram components kit in video community scenario.  
It includes basic UI components, such as `video-swiper`, `slider`, `comments-half-dialog`,  
and some business UI components like `tiktok-panel`, and `wechat-channel-panel`, etc.

Miniprogram-video-swiper-kit is based on the real massive user product in weChat miniprogram, and
features a suite of customization options that make it easy to implement your own custom business
design on top of these components.

These components are now used by the top miniprogram developers
which they have grown to **over 500 millions users** in weChat.

## Requirements

1. Node.js version 10+
2. NPM version 5+
3. weChat miniprogram devtools version 1.02.1808300+
4. weChat miniprogram lib version 2.2.1+

## Installation

It's available as a package on NPM for use with a module bundler or in a Node application.  
In your miniprogram project root directory with package.json, run:

```
# npm
npm i @miniprogram-video-swiper-kit/video-swiper

# yarn
yarn add @miniprogram-video-swiper-kit/video-swiper
```

You can check out this weChat miniprogram official doc to figure out
[how to use npm](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html) in miniprogram project.

> If you want to install other components, just run:
>
> ```
> # npm
> npm i @miniprogram-video-swiper-kit/{{component-name}}
>
> # yarn
> yarn add @miniprogram-video-swiper-kit/{{component-name}}
> ```

Check out [all available components here](https://docs.overio.space/miniprogram-video-swiper-kit/docs/category/components).

## Documentation

The miniprogram-video-swiper-kit docs are located at https://docs.overio.space/miniprogram-video-swiper-kit/

- [Introduction](https://docs.overio.space/miniprogram-video-swiper-kit/docs/intro)
- [Getting Started](https://docs.overio.space/miniprogram-video-swiper-kit/docs/getting-started)
- [Components](https://docs.overio.space/miniprogram-video-swiper-kit/docs/category/components)
- Business components
- FAQ

## Before Proceeding Further

@Miniprogram-video-swiper-kit/video-swiper is an easy-using component, but you should also consider weather it's
appropriate for your situation. Please don't use this kit just because someone said you should, instead, you should
take some time to understand the benefit and tradeoffs of using it.

Here are some suggestions on when it make sense to use it:

- Your business scenario is based on social community.
- You want a stable component that have been tested by massive client user.
- The @miniprogram-components-plus/video-swiper of weChat team doesn't meet your demand, you can take a try.

On the other hand, this component's features about ui properties or events are not fully exported for you,
some of them are hard code in pkg now, I will pick them out progressively.  
So, if you have any help-wanted, feature idea, or bug report, please
[commit a issue](https://github.com/perowong/miniprogram-video-swiper-kit/issues)
or [initiate a discussion](https://github.com/perowong/miniprogram-video-swiper-kit/discussions)
to let me know;)  
By the way, you can also join the [Discord Chat Room](https://discord.gg/zFUkQdcHkC) with other developers.

## Basic Examples

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

Here are [video-swiper's api of all properties and events](https://docs.overio.space/miniprogram-video-swiper-kit/docs/components/video-swiper#api)

## Examples

- [tiktok-swiper](https://github.com/perowong/miniprogram-video-swiper-kit/tree/main/examples/tiktok-swiper)
- wechat-channel-swiper

## Motivation

why this project?

As the requirements of watching short video becoming increasingly common,
the feature swiping up videos turning into an essential fundamental part of most products,
especially in the community product.

So, it's essential to build an easy using, out of box swiping video component. The component is not provided
by miniprogram officially, though it has a video-swiper component in miniprogram-component-plus of weChat team,  
which is not perfectly compatible with some scenarios,
such as some unexpected other video's voice playing when swiping the screen quickly,
customizing play/pause state, and community interactive features, etc.

Based on the video-swiper, other out-of-box component follows, such as `slider`, `comments-half-dialog`, `tiktok-panel`,
and `wechat-channel-panel` etc., with business bias features to build user friendly ui.

## Logo

You can find the designed logo [on GitHub](https://github.com/perowong/miniprogram-video-swiper-kit/tree/main/logo).

## License

[MIT](https://github.com/perowong/miniprogram-video-swiper-kit/blob/main/LICENSE)

## More doc is on the way...
