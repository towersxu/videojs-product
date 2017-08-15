(function () {
  var videoEl, //videojs播放器DOM
      video, // videojs播放器对象
      adsHtmlEl = '';  // 推荐
  
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
  // 播放
  
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
      setRecommendData: constructRecommendHtml
    }
  }
}())