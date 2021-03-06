
import './../scss/style.scss';
import 'document-register-element'; // Polyfill for custom tagnames

import * as CONST   from './components/const';

import {Collector}  from './components/collector';

import {Controller} from './components/controller';
import {Sequence}   from './components/image';
import {Mask}       from './components/mask';
import {Sound}      from './components/sound';
import {Markup}     from './components/markup'; 
import {Vector}     from './components/vector';
import {Minimap}    from './components/minimap';
import {Fullscreen} from './components/fullscreen';
import {Grid}       from './components/grid';

//import {isElementVisible}   from './utils/isElementVisible';

export var version = '1.0';

export var init = function( options ) {

    if ( !options ) options = {};

    var settings = {

        ui:             typeof options.ui === 'boolean' ? {
                            controllers:  options.ui, // show controller buttons
                            fullscreen:   options.ui, // show fullscreen button
                            minimap:      options.ui, // show minimap similar to facebook's 360° videos
                            fade:         options.ui, // fade out on mouse-out, in on mouse-in
                            minimal:      options.ui, // gather buttons in context menus
                            sound:        options.ui, // true, false, mute
                        } : 
                        typeof options.ui === 'object' ? {
                            controllers:  options.ui.controllers,
                            fullscreen:   options.ui.fullscreen,
                            minimap:      options.ui.minimap,
                            fade:         options.ui.fade,
                        } : {
                            controllers:  true,
                            fullscreen:   true,
                            minimap:      true,
                            fade:         true,
                        },

        grid:           typeof options.grid === 'boolean' ? {
                            xy: options.grid,
                            yz: options.grid,
                            xz: options.grid
                        } : 
                        typeof options.grid === 'object' ? {
                            xy: options.gird.xy,
                            yz: options.grid.yz,
                            xz: options.grid.xz
                        } : {
                            xy: false,
                            yz: false,
                            xz: false
                        },

         bindFontSize:  default_( options.bindFontSize, true ),

    }

    var collector = new Collector();
        collector.init();
    
    var wakkles = collector.collect(),
        wakkle,

        controller  = [],
        components  = [],
        image       = [], 
        mask        = [],
        sound       = [],
        markup      = [],
        vector      = [],
        minimap     = [],
        fullscreen  = [],
        ui,

        grid = new Grid({
            xy: settings.grid.xy,
            yz: settings.grid.yz,
            xz: settings.grid.xz
        });


    for (var i = 0; i < wakkles.length; i++) {

        wakkle             = wakkles[i];
        wakkle.ui          = settings.ui;

        if ( wakkle.ui ) {
            wakkle.ui.wrapper                  = document.createElement('div');
            wakkle.ui.wrapper.className        = CONST.pref + 'ui';
            wakkle.wrapper.appendChild( wakkle.ui.wrapper )
        }

        //if ( !isElementVisible( wakkle ) ) { // Needs to be fixed

            controller[i] = new Controller( wakkle );
            controller[i].init();

            image[i] = new Sequence( wakkle );
            image[i].init();
            controller[i].control( image[i] );

            mask[i] = new Mask( wakkle );
            mask[i].init();
            controller[i].control( mask[i] );

            sound[i] = new Sound( wakkle );
            !sound[ i==0?0 : i-1 ].initialized && sound[i].init();
            controller[i].control( sound[i] );

            markup[i] = new Markup( wakkle );
            markup[i].init();
            if ( settings.grid.xy ) markup[i].insert( grid.xy );
            if ( settings.grid.yz ) markup[i].insert( grid.yz );
            if ( settings.grid.xz ) markup[i].insert( grid.xz );
            controller[i].control( markup[i] );

            vector[i] = new Vector( wakkle );
            vector[i].init();
            controller[i].control( vector[i] );

            minimap[i] = new Minimap( wakkle );
            minimap[i].init();
            controller[i].control( minimap[i] );

            fullscreen[i] = new Fullscreen( wakkle );
            fullscreen[i].init();
            
            // TODO: implement global control switch + control switch UI
            // TODO: watch() or listen() if wakkle is in viewport

        //}
    }

    function default_( overwrite, default_ ) {
        return overwrite !== undefined ? overwrite : default_
    }
}
