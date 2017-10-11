/**
 * http://usejsdoc.org/
 */

/* jslint node: true */
/* jslint esversion: 6 */
/* jshint -W117 */

'use strict';

module.exports = function (content, log4n) {
//	log4n.object(content, 'content');
	if(typeof content.error === 'undefined') {
		log4n.error(content.error);
	} else {
		log4n.error(content.error.message);
	}
};
