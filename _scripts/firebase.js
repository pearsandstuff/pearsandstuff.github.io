(function() {
	if (window.firebase) {
		var firebaseConfig = {
			apiKey: "AIzaSyCXHw_oa7u8vOi39iJu8cHCBEdZhKnn-Nc",
			authDomain: "pears-and-stuff-64a54.firebaseapp.com",
			databaseURL: "https://pears-and-stuff-64a54.firebaseio.com",
			projectId: "pears-and-stuff-64a54",
			storageBucket: "pears-and-stuff-64a54.appspot.com",
			messagingSenderId: "447970505533",
			appId: "1:447970505533:web:774f5db0ab78bc41",
			measurementId: "G-VD09D8ZM7Q"
		};
		firebase.initializeApp(firebaseConfig);
		firebase.analytics();
	}
})();
