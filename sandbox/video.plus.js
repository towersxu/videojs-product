(function () {
  var videoEl, //videojs播放器DOM
      video, // videojs播放器对象
      adsHtmlEl = '',  // 推荐
      clickControlEl = function () {},
      clickCloseEl = function () {},
      resourceChangeCallback = function (){}; // 点击推荐的回调。
  /**
   * 视频推荐和重播
   */
  function constructRecommendHtml (urls) {
    if (urls.length === 0) {
      return
    }
    var wrapEl = document.createElement('div');
    wrapEl.className = 'vid-complete-poster';
    wrapEl.setAttribute('id', 'video-complete-recommend');
    // 左侧重新加载
    var reloadEl = document.createElement('div');
    reloadEl.className = 'vid-complete-right';    
    var reloadImg = document.createElement('img');
    reloadImg.className = 'vid-complete-reload';
    reloadImg.setAttribute('src', './img/replay.png');
    reloadEl.appendChild(reloadImg);    
    reloadEl.addEventListener('click', function () {
      video.currentTime(0);
      video.play();
    });
    var reloadTxt = document.createElement('span');
    reloadTxt.className = 'vid-complete-reload-txt';
    reloadTxt.innerText = '重播';
    reloadEl.appendChild(reloadTxt);    
    wrapEl.appendChild(reloadEl);
    
    // 右侧推荐列表
    var reList = document.createElement('div');
    reList.className = 'vid-complete-right';
    var fragment = document.createDocumentFragment();
    var title = document.createElement('h2');
    title.innerText = '热门排行榜';
    fragment.appendChild(title);
    var switchTab = document.createElement('div');
    switchTab.className = 'vid-complete-thumbs';
    for (var j = 0; j < (Math.floor(urls.length / 5) + 1); j++) {
      var wrap = document.createElement('div');
      wrap.className = 'vid-complete-source-wrap';
      var switchBtn = document.createElement('span');
      switchBtn.className = 'vid-complete-thumb';
      if (j === 0) {
        wrap.className = 'vid-complete-source-wrap show';
        switchBtn.className = 'vid-complete-thumb selected';
      }
      (function(i){
        switchBtn.addEventListener('click', function (e) {
          var me = e.target;
          if (/selected/.test(me.className)) {
            return
          }        
          Array.prototype.map.call(me.parentNode.children, function (el) {
            el.className = el.className.replace('selected', '').trim();
          })
          me.className = me.className + ' selected';
          var sels = document.getElementsByClassName('vid-complete-source-wrap');
          Array.prototype.map.call(sels, function (el) {
            if (/show/.test(el.className)) {
              el.className = el.className.replace('show', 'hide');
              setTimeout(function(){
                el.className = el.className.replace('hide', '');
              }, 300)
            }            
          })
          sels[i].className = sels[i].className + ' show'
        })
      })(j)      
      switchTab.appendChild(switchBtn);
      for (var i = j * 5; i < (j + 1) * 5; i++) {
        if (i < urls.length) {
          var url = urls[i];
          var div = document.createElement('div');
          div.className = 'vid-complete-source page' + Math.floor(i / 5);
          div.setAttribute('index', i);
          (function addEvent(i) {        
            div.addEventListener('click', function () {
              video.src(urls[i].videos);
              video.currentTime(0);
              video.play();
              resourceChangeCallback(urls[i]);          
            })
          })(i)    
          var img = document.createElement('img');
          img.setAttribute('src', url.poster);
          var des = document.createElement('div');
          des.className = 'vid-complete-source-txt';          
          var h3 = document.createElement('h3');
          h3.className = 'vid-complete-source-title';
          h3.innerText = url.title;
          des.appendChild(h3);
          var name = document.createElement('span');
          name.className = 'vid-complete-source-name';
          name.innerText = url.author;
          des.appendChild(name);
          
          div.appendChild(img);
          div.appendChild(des);
          wrap.appendChild(div);
        }
      }
      fragment.appendChild(wrap);
    }
    reList.appendChild(fragment);
    reList.appendChild(switchTab);
    wrapEl.appendChild(reList);
    adsHtmlEl = wrapEl
  }
  /**
   * 播放器上方的提交按钮
   * @param {[type]} data [description]
   */
  function addVideoTitle (data) {
    var head = document.createElement('div');
    head.className = 'vid-header-wrap';
    var title = document.createElement('span');
    title.className = 'vid-header-txt'
    title.innerText = data.title;
    head.appendChild(title);
    var close = document.createElement('close');
    close.className = 'vid-header-close';
    close.addEventListener('click', function () {
      clickCloseEl();
    })
    head.appendChild(close);
    videoEl.appendChild(head);
  }
  
  /**
   * 视频播放完成后显示推荐广告
   */
  function addRecommend () {
    videoEl.appendChild(adsHtmlEl);
  }
  /**
   * 在开始播放后去掉推荐广告
   */
  function removeRecommend () {
    var el = document.getElementById('video-complete-recommend');
    if (el) {
      el.parentNode.removeChild(el);      
    }
  }
  /**
   * 视频播放完成后显示推荐页面
   * @param  {video} v videojs对象
   * @return {object}   videoRecommend对象
   */
  window.videoRecommend = function (v) {
    video = v;
    videoEl = v.el_;
    video.on('playing', function () {
      removeRecommend();
    })
    video.on('ended', function () {
      addRecommend();
    })
    return {
      setRecommendData: constructRecommendHtml,      
      onResourceChange: function (cb) {
        resourceChangeCallback = cb;
      }
    }
  }
  
  /**
   * 在播放控制栏设置业务DOM
   * @return {[type]} [description]
   */
  window.videoSetControl = function (v) {
    video = v;
    videoEl = v.el_;
    return {
      setControlData: setControlData,
      onClickEl: function (cb) {
        clickControlEl = cb;
      },
      onClickClose: function (cb) {
        clickCloseEl = cb;
      }
    }
  }
  /**
   * 设置控制条上的点赞-观看等
   * @param {[type]} data [description]
   */
  function setControlData (data) {
    data = data || {};
    var vcm = videoEl.querySelector('.video-control-more');
    if (vcm) {
      vcm.parentNode.removeChild(vcm); 
    }
    var fragment = document.createElement('div');
    fragment.className = 'video-control-more';
    if (data.author) {
      var authorEl = document.createElement('span');
      authorEl.className = 'video-control-author';
      authorEl.innerText = '作者：' + data.author;
      fragment.appendChild(authorEl);
    }
    if (data.views) {
      var viewsEl = document.createElement('span');
      viewsEl.className = 'video-control-views';
      viewsEl.innerText = data.views + '次';
      fragment.appendChild(viewsEl);
    }
    if (data.likes) {
      var viewsEl = document.createElement('span');
      viewsEl.className = 'video-control-likes';
      var likeBtn = document.createElement('span');
      likeBtn.className = 'video-likes-btn';
      if (data.liked) {
        likeBtn.className = 'video-likes-btn liked';
      }
      likeBtn.addEventListener('click', function (e) {
        if (data.liked) {
          e.target.className = e.target.className.replace('liked', '').trim();
          data.liked = false;
          data.likes -= 1;
        }
        else {
          e.target.className = e.target.className + ' liked';
          data.liked = true;
          data.likes += 1;
        }
        // 点击后改变人数和选中状态。
        var likeTxt1 = document.createElement('span');
        likeTxt1.innerText = data.likes + '人';
        likeTxt1.className = 'videos-likes-txt';
        var vlt = videoEl.querySelector('.videos-likes-txt');
        var lbt = videoEl.querySelector('.video-control-likes');
        if (vlt) {
          vlt.parentNode.removeChild(vlt);
          lbt.appendChild(likeTxt1);
        }
        clickControlEl('like');
      });
      viewsEl.appendChild(likeBtn);
      var likeTxt = document.createElement('span');
      likeTxt.innerText = data.likes + '人';
      likeTxt.className = 'videos-likes-txt';      
      viewsEl.appendChild(likeTxt);
      fragment.appendChild(viewsEl);
    }
    var controlBar = videoEl.querySelector('.vjs-control-bar');
    controlBar.appendChild(fragment);
    addVideoTitle(data);
  }
}())