$(function(){

    var options = {
        html4mode: true,
        proximity: { 
            near: 300, 
            far: -100 
        }
    };

    seoify.init(options);
});

var seoify = (function(){
    var seoify_eventBuffer, seoify_scrollBuffer;

    return {
        init_title: null,
        init_meta: null,
        root_url: null,
        base_url: null,
        init_path: '',
        active_state: null,
        isloaded: false,
        wait: true,
        manualchange: true,
        userscrolling: false,
        proximity: { near: 400, far: -100 },
        html4Mode: true,
        init: function(options) {

            if(options && options.html4mode) {
                History.options.html4Mode = options.html4mode;
            } else if(options && options.proximity) {
                this.proximity = options.proximity;
            } 

            window.History.init();
            this.load();
        },
        load: function(){
            this.scrollWheelEvents();            
            this.init_title = $('title').text();
            this.init_meta = $('meta[name="description"]').attr('content');
            this.root_url = History.getRootUrl();
            
            this.base_url = History.getBasePageUrl();
            this.init_path = '/'+this.base_url.replace(this.root_url, '');

            this.active_state = History.getState().hash;

            var self = this;
            History.Adapter.bind(window, 'statechange', function(){
                self.active_state = History.getState().hash;
                //console.log('History.binder', self.active_state, self.manualchange);
                
                if(self.manualchange == true){
                    var state = self.active_state.replace('#/','').replace('/','');
                    var element = $('body *[data-seoify="'+state+'"]');
                    //console.warn('manualchange', element);
                    self.scrolltoElement(element);
                }
                self.manualchange = true;
            });

            this.setup();
        },
        setup: function() {
            var self = this;
            var seoifyElements = $('body *[data-seoify]');

            $(seoifyElements).each(function(){
                var element = $(this);
                var title = element.attr('data-title');
                var meta = element.attr('data-meta');
                var urlslug = self.init_path+element.attr('data-seoify');
                self.store(urlslug, title, meta, element);
            });

            var waitstate = setTimeout(function(){
                self.wait = false;
            }, 1000); 
        },
        store: function(urlslug, title, meta, element) {

            if(!this.isloaded){
            	var init_state = History.getState().hash.replace('#/','').replace('/','');
                var current_hash = this.init_path+init_state;

                if(current_hash == urlslug){
                    this.scrolltoElement(element);
                    this.isloaded = true;
                }
            }
            
            this.watch(element, urlslug, title, meta);
        },
        watch: function(element, urlslug, title, meta) {
            var self = this;
            $(window).scroll(function() {
                var elementpos = $(element).offset().top - $(window).scrollTop();
                var checkpos = (elementpos < self.proximity.near) && (elementpos > self.proximity.far);

                if(checkpos && self.userscrolling){
                    
                    clearTimeout(seoify_eventBuffer);
                    var seoify_eventBuffer = setTimeout(function(){
                        self.manualchange = false;
                        self.setpushState(urlslug, title, meta);
                    }, 5);
                }
            });
        },
        setpushState: function(slug, title, meta){
            if(this.active_state != slug && !this.wait && !this.manualchange) {
                this.active_state = slug;
                if(this.manualchange == true){
                    return false;
                }

                if(slug == this.init_path){
                    window.history.replaceState(null, this.init_title, this.base_url);
                    this.setMetaDescription(this.init_meta);
                } else {
                    History.pushState(null, title, slug);
                    this.setMetaDescription(meta);
                }

                
                // console.log('setPushState', slug, this.active_state);
            }
        },
        setMetaDescription: function(meta) {
            $('meta[name="description"]').attr('content', meta);
        },
        scrollWheelEvents: function() {
            var self = this;
            $(window).bind('mousewheel DOMMouseScroll', function(event, delta) {
                self.userscrolling = true;
                clearTimeout(seoify_scrollBuffer);
                var seoify_scrollBuffer = setTimeout(function(){
                    self.userscrolling = false;
                }, 5);
            }); 
        },
        scrolltoElement: function(element) {
            $(element).ScrollTo();
        }
    };
})(seoify);
