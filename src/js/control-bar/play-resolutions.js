/**
 * Created by taox on 16-2-14.
 */
import Component from '../component';
import * as Dom from '../utils/dom.js';
import MediaError from '../media-error.js';

/**
 * 分辨率选择控件
 * TODO - Future make it click to snap to live
 *
 * @extends Component
 * @class PlayResolutions
 */
class PlayResolutions extends Component {

  constructor(player, options) {
    super(player, options);
    this.updateShowing();
    this.on(this.player(), 'durationchange', this.updateShowing);
    this.on(this.player(),'ready',() => {
      if(arguments && arguments[1]){
        var videos = arguments[1].videos || [];
        var idx = arguments[1].idx || 0;
        var html = '<div class="tabs">';
        for(let i=0;i<videos.length;i++){
          html += '<div class="tab" t="'+videos[i].type+'" val="'+videos[i].src+'">'+videos[i].name+'</div>';
        }
        html += '</div>';
        var domEl = this.el();
        this.contentEl2_ = Dom.createEl('div',{
          className:'vjs-gaia-resolution',
          innerHTML:html
        });
        if(videos.length === 1){
          this.contentEl2_.style.display = 'none';
          domEl.style.cursor = 'default';
        }
        else{
          domEl.appendChild(this.contentEl2_);
        }
        this.contentEl_.innerHTML=videos[idx].name;
        var player = this.player();
        if (!videos[idx] || !videos[idx].src || videos[idx].src === 'TRANSCODING') {
          player.addClass('vjs-error');
          player.addClass('show-poster');
          // this.trigger('error');
          var message = '没有播放地址';
          if(videos[idx]){
            message = videos[idx].errorMessage || '视频正在转码中,暂时不能播放...';
          }
          player.error_ = new MediaError(message);
          player.trigger('error');
          return ;
        }
        player.src({
          src: videos[idx].src,
          type: videos[idx].type || 'video/mp4'
        });
        if(player.progressed){
          player.progressed();
        }
      }
    });
    this.on('click',(e) => {
      var el = e.target.getAttribute('val');
      var player = this.player();
      if(el && player){
        var name = e.target.innerText;
        var type = e.target.getAttribute('t');
        var playTime = player.currentTime();
        player.src({
          src: el,
          type: type || 'video/mp4'
        });
        player.currentTime(playTime);
        player.play();
        this.contentEl_.innerHTML=name;
      }
    });
  }

  /**
   * Create the component's DOM element
   *
   * @return {Element}
   * @method createEl
   */
  createEl() {
    var el = super.createEl('div', {
      className: 'vjs-live-control vjs-control'
    });

    this.contentEl_ = Dom.createEl('div', {
      className: 'vjs-live-display',
      innerHTML: `<span class="vjs-control-text">${this.localize('Stream Type')}</span>1080P`
    }, {
      'aria-live': 'off'
    });
    el.appendChild(this.contentEl_);
    return el;
  }

  updateShowing() {
    //if (this.player().duration() === Infinity) {
    this.show();
    //} else {
    //  this.hide();
    //}
  }

}

Component.registerComponent('PlayResolutions', PlayResolutions);
export default PlayResolutions;
