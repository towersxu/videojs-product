(function () {
  var videoEl, //videojs播放器DOM
      video, // videojs播放器对象
      adsHtmlEl = '',  // 推荐
      clickControlEl = function () {},
      clickCloseEl = function () {},
      resourceChangeCallback = function (){}; // 点击推荐的回调。
      
  function constructRecommendHtml (urls) {
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
    for (var i = 0; i < urls.length; i++) {
      var url = urls[i];
      var div = document.createElement('div');
      div.className = 'vid-complete-source';
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
      var span = document.createElement('span');
      span.className = 'vid-complete-source-txt';
      span.innerText = url.title;
      div.appendChild(img);
      div.appendChild(span);
      fragment.appendChild(div);
    }
    reList.appendChild(fragment);
    wrapEl.appendChild(reList);
    adsHtmlEl = wrapEl
  }
  
  function addVideoTitle (data) {
    console.log(data)
    var head = document.createElement('div');
    head.className = 'vid-header-wrap';
    var title = document.createElement('span');
    title.className = 'vid-header-txt'
    title.innerText = data.title;
    head.appendChild(title);
    var close = document.createElement('close');
    close.className = 'vid-header-close';
    close.addEventListener('click', function () {
      clickCloseEl()
    })
    head.appendChild(close);
    videoEl.appendChild(head);
  }
  
  /**
   * 视频播放完成后显示推荐广告
   */
  function addRecommend () {
    videoEl.appendChild(adsHtmlEl)
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
      removeRecommend()
    })
    video.on('ended', function () {
      addRecommend()
    })
    return {
      setRecommendData: constructRecommendHtml,      
      onResourceChange: function (cb) {
        resourceChangeCallback = cb
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