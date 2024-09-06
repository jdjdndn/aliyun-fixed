// ==UserScript==
// @name         yc-阿里云盘PC端保存按钮固定
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  阿里云盘PC端保存按钮固定
// @author       wcbblll
// @match        https://www.aliyundrive.com/s/*
// @run-at       document-end
// @license      MIT
// ==/UserScript==

(function () {
  "use strict";
  function isElementInViewportAndVisible(element) {
    const rect = element.getBoundingClientRect();
    const isVisible = (rect.top >= 0 || rect.left >= 0 || rect.right <= window.innerWidth || rect.bottom <= window.innerHeight) && rect.width != 0 && rect.height != 0
    return isVisible && (window.getComputedStyle(element).display !== 'none');
  }

  // 找到唯一一个在页面中的元素
  function findOne(selector) {
    const list = [...document.querySelectorAll(selector)].filter(item => isElementInViewportAndVisible(item))
    if (list.length == 1) return list[0]
    return null
  }

  function loopFunc(fn) {
    function callback(mutationsList, observer) {
      if (lastExecutionTime + delay < Date.now()) {
        fn(mutationsList, observer)
        lastExecutionTime = Date.now();
      }
    }

    let observer = new MutationObserver(callback);

    let delay = 500; // 间隔时间，单位毫秒
    let lastExecutionTime = 0;

    observer.observe(document.body, { childList: true, attributes: true, subtree: true });
  }

  loopFunc(() => {
    const ID = 'has-changed-position'
    const selector = `[class*=top-element-wrapper]:not(${ID})`
    // 要固定的元素  [class*=top-element-wrapper]:not([has-changed-position])
    const needFixedBox = findOne(selector)
    if (!needFixedBox || needFixedBox.getAttribute(ID)) return
    // 固定到该元素下面
    const fixedBox = findOne('[class*=node-list-grid-view--]')
    if (!fixedBox) return
    needFixedBox.setAttribute(ID, true)
    document.querySelectorAll(selector).forEach(it => it.remove())
    fixedBox.appendChild(needFixedBox)
  })
})();
