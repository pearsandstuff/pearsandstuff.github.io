if (window.firebase) {
	auth.listenFor.init(function(user) {
		if (!user) {
			location.replace(`/login.html?return=${encodeURIComponent(location.pathname)}`);
		}
	});
}