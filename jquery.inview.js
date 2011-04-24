/* Copyright 2011, Murray M. Moss */
(function($, w){
	var $w = $(w),
		queue = [],
		viewTestInterval = null;

	function isInView($el) {
		var viewTop = $w.scrollTop(),
			viewBottom = viewTop + $w.height(),
			elTop = $el.offset().top,
			elBottom = elTop + $el.height();

		return elBottom >= viewTop && elTop <= viewBottom;
	}

	function resolvePromises() {
		if(queue.length > 0){
			var i;
			for(i=queue.length-1; i>=0; i--) {
				var itm = queue[i];
				var $target = $(itm.target);
				if(isInView($target)) {
					itm.deferred.resolve($target);
					queue.splice(i, 1);
				}
			}

			if(queue.length < 1) {
				clearInterval(viewTestInterval);
				viewTestInterval = null;
			}
		}
	}

	$.fn.inView = function(){
		var $target = this,
			$deferred = $.Deferred();
			
		$target.each(function(){
			queue.push({
				target: this,
				deferred: $deferred
			});
		});

		if(queue.length > 0 && viewTestInterval === null) {
			viewTestInterval = setInterval(resolvePromises, 350);
		}

		return $deferred.promise();
	};

	$.fn.inView.getQueue = function(){ return queue; };
	$.fn.inView.getInterval = function(){ return viewTestInterval; };
}(jQuery, window));
