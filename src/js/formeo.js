'use strict';
import '../sass/formeo.scss';
import helpers from './common/helpers';
import { data } from './common/data';
import events from './common/events';
import actions from './common/actions';
import DOM from './common/dom';
import i18n from 'mi18n';
import { Controls } from './components/controls';
import Stage from './components/stage';

var dom = new DOM();

// Simple object config for the main part of formeo
var formeo = {};
class Formeo {
  constructor(options, formData) {
    // Default options
    const defaults = {
      dataType: 'json',
      debug: false,
      className: 'formeo',
      container: '.formeo',
      prefix: 'formeo-',
      svgSprite: '/assets/img/formeo-sprite.svg',
      events: {},
      i18n: {
        langsDir: '/assets/lang/',
        langs: [
          'en-US'
        ]
      }
    };

    let _this = this;

    this.version = '0.2.2';

    formeo.opts = helpers.extend(defaults, options);
    data.init(formeo.opts, formData);
    i18n.init(formeo.opts.i18n)
      .then(function() {
          formeo.formData = data.get();
          formeo.opts.formID = formeo.formData.id;
          _this.stage = new Stage(formeo.opts);
          formeo.controls = new Controls(formeo.opts);
          helpers.loadIcons(formeo.opts.svgSprite);
          events.init(formeo.opts.events);
          actions.init(formeo.opts.actions);
          _this.render();
        },
        function(err) {
          console.error('There was an error retrieving the language files', err);
        });

    return formeo;
  }

  render() {
    let controls = formeo.controls.dom,
      container = formeo.opts.container;
    // formeo.stage = this.stage;

    if (typeof formeo.opts.container === 'string') {
      container = document.querySelector(formeo.opts.container);
    }

    let fbElem = {
        tag: 'div',
        attrs: {
          className: formeo.opts.className,
          id: formeo.opts.formID
        },
        content: [this.stage, controls]
      },
      formeoElem = dom.create(fbElem);

    container.appendChild(formeoElem);

    events.formeoLoaded = new CustomEvent('formeoLoaded', {
      detail: {
        formeo: formeo
      }
    });

    document.dispatchEvent(events.formeoLoaded);
  }
}

if (window !== undefined) {
  window.Formeo = Formeo;
}

export default Formeo;
