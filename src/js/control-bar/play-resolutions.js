/**
 * Created by taox on 16-2-14.
 */
import Component from '../component';
import * as Dom from '../utils/dom.js';

/**
 * Displays the live indicator
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
    this.contentEl2_ = Dom.createEl('div',{
      className:'vjs-gaia-resolution',
      innerHTML:'<div class="tabs"><div class="tab" val="4k">4K</div><div class="tab" val="2k">2K</div><div class="tab" val="1080p">1080P</div><div class="tab" val="720p">720P</div></div>'
    });
    el.appendChild(this.contentEl2_);
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
