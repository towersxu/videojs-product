/**
 * Created by taox on 16-2-16.
 */
/**
 * @file logo-text.js
 */
import Button from '../button.js';
import Component from '../component.js';

/**
 * Button to toggle between play and pause
 *
 * @param {Player|Object} player
 * @param {Object=} options
 * @extends Button
 * @class PlayToggle
 */
class LogoText extends Button {

  constructor(player, options){
    super(player, options);

    //this.on(player, 'play', this.handlePlay);
    //this.on(player, 'pause', this.handlePause);
    this.on('click', () => {
      if(typeof arguments[1].click ==='function'){
        arguments[1].click.call(this);
      }
    });
  }

  /**
   * Allow sub components to stack CSS class names
   *
   * @return {String} The constructed class name
   * @method buildCSSClass
   */
  buildCSSClass() {
    return `vjs-play-control vjs-logo-control ${super.buildCSSClass()}`;
  }

  /**
   * Handle click to toggle between play and pause
   *
   * @method handleClick
   */
  //handleClick() {
  //  console.log(this);
  //  console.log(this.player());
  //  var fnClick = this.options('click');
  //  if(fnClick && typeof fnClick==='function'){
  //    fnClick.call(this);
  //  }
  //}

  /**
   * Add the vjs-playing class to the element so it can change appearance
   *
   * @method handlePlay
   */
  handlePlay() {
    this.removeClass('vjs-paused');
    this.addClass('vjs-playing');
    this.controlText('Pause'); // change the button text to "Pause"
  }

  /**
   * Add the vjs-paused class to the element so it can change appearance
   *
   * @method handlePause
   */
  handlePause() {
    this.removeClass('vjs-playing');
    this.addClass('vjs-paused');
    this.controlText('Play'); // change the button text to "Play"
  }

}

LogoText.prototype.controlText_ = 'Logo';

Component.registerComponent('LogoText', LogoText);
export default LogoText;
