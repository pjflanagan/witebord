export const getPageFromUrl = function (url) {
	return /[^/]*$/.exec(url)[0];
}

export const getRoomId = function (unformattedPage) {
	return unformattedPage.replace(/[\W_]+/g, '_');
};

export const getRoomTitle = function (unformattedPage) {
	return unformattedPage.replace(/[\W_]+/g, ' ');
};