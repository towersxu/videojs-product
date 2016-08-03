/**
 * Created by taox on 16-2-14.
 */
import Component from '../component';
import * as Dom from '../utils/dom.js';


/**
 * 宽高比控制组件
 * TODO - Future make it click to snap to live
 *
 * @extends Component
 * @class PlayResolutions
 */
class PlayerRatio extends Component {

  constructor(player, options) {
    super(player, options);

    this.updateShowing();
    this.on(this.player(), 'durationchange', this.updateShowing);
    this.on(this.player(),'ready',(object) => {
      if(arguments && arguments[1]){
        var ratios = arguments[1].ratios;
        console.log(ratios);
        if(ratios && ratios.length>0) {
          var idx = arguments[1].idx || 0;
          var html = '<div class="tabs">';
          for(let i=0;i<ratios.length;i++){
            if(idx===i){
              html += '<div class="tab selected" width="'+ratios[i].width+'" height="'+ratios[i].height+'">'+ratios[i].name+'</div>';
              var player = this.player();
              player.dimension('width',ratios[i].width);
              player.dimension('height',ratios[i].height);
            }else{
              html += '<div class="tab" width="'+ratios[i].width+'" height="'+ratios[i].height+'">'+ratios[i].name+'</div>';
            }

          }
          html += '</div>';
          var domEl = this.el();
          this.contentEl2_ = Dom.createEl('div',{
            className:'vjs-gaia-resolution ratio',
            innerHTML:html
          });
          domEl.appendChild(this.contentEl2_);
        }
      }
    });
    this.on('click',(e) => {
      var el = e.target;
      var els = el.parentNode.childNodes;
      for(var i=0;i<els.length;i++){
        Dom.removeElClass(els[i],'selected');
      }
      Dom.addElClass(el,'selected');
      var width = e.target.getAttribute('width');
      var height = e.target.getAttribute('height');
      if(typeof width !== 'number'){
        width = parseInt(width);
        height = parseInt(height);
      }
      var player = this.player();
      if(width && height){
        player.dimension('width',width);
        player.dimension('height',height);
      }
      //e.target.setAttribute('class','tab selected');

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
      className: 'vjs-live-control vjs-control setting'
    });

    this.contentEl_ = Dom.createEl('div', {
      className: 'vjs-live-display',
      innerHTML: `<span class="vjs-control-text">${this.localize('Stream Type')}</span><span class="vjs-icon-cog"></span>`
    }, {
      'aria-live': 'off'
    });
    //this.contentEl2_ = Dom.createEl('div',{
    //  className:'vjs-gaia-resolution',
    //  innerHTML:'<div class="tabs"><div class="tab" val="860:482">Mask</div><div class="tab" val="860:482">2.35</div><div class="tab" val="16:9">1.85</div><div class="tab" val="16:9">16:9</div><div class="tab" val="4:3">4:3</div></div>'
    //});
    //el.appendChild(this.contentEl2_);
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

Component.registerComponent('PlayerRatio', PlayerRatio);
export default PlayerRatio;
