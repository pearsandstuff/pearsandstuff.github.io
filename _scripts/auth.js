(function() {
	// This is just an interface for firebase's auth to make common tasks easier.
	
	// The list of user emails to try.
	const USERS = [
		"cheto1807@gmail.com",
		"glco1314@gmail.com",
	];

	// Mapping of Firebase User UIDs to easier-to-remember IDs
	const firebaseToReadableID = {
		"IAKv57QVOBTxMoLlwun5CK9gO1A2": "s",
		"iQZOru9PwQYS03nrZpQ7kE5zKiZ2": "p",
	};

	if (window.firebase) {
		// Get the firebase auth instance that this will interact with.
		let instance = firebase.auth();

		// An event listener for when the user changes or gets signed on/off.
		instance.onIdTokenChanged(function(user) {
			// If this is the first change, trigger the handler that was assigned, if any.
			if (!auth.initted) {
				auth.initted = true;
				triggerEvent("init", user);
			}

			// Save the new firebase auth instance.
			auth.instance = firebase.auth();

			if (auth.user && !user) {
				// The user was signed off.
				auth.signedIn = false;
				auth.user = null;
				auth.userID = null;
				triggerEvent("signOut", user);
			} else if (!auth.user && user) {
				// The user was signed on.
				auth.signedIn = true;
				auth.user = user;
				auth.userID = firebaseToReadableID[user.uid];
				triggerEvent("signIn", user);
			} else if (auth.user && user) {
				// The user was changed.
				auth.user = user;
				auth.userID = firebaseToReadableID[user.uid];
				triggerEvent("userChange", user);
			}
		});

		function attachListener(type, cb) {
			auth.listeners[type].push(cb);
		}
		function triggerEvent(type, user) {
			for (let i = 0, l = auth.listeners[type].length; i < l; i++) {
				auth.listeners[type][i](user);
			}
		}

		window.auth = {
			instance: instance,
			// Reference to firebase's auth.currentUser.
			user: instance.currentUser,
			// A readable ID for the user, either "s", "p", or null
			userID: instance.currentUser ? firebaseToReadableID[instance.currentUser.uid] : null,
			// Boolean indicating if there is currently a signed on user.
			signedIn: !!instance.currentUser,
			// Reauthorizes the currently signed on user by checking if the provided argument signs them on.
			// Returns a Promise that succeeds or fails if the password successfully reauthorized the user.
			// This is useful for requesting they resupply their password without having to sign them out.
			reauth: function(pw) {
				return this.instance.currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(this.instance.currentUser.email, pw));
			},
			// Signs a user on.
			// Since there are only two accounts to check, the password is supplied to both of them and checked.
			// If either one succeeds, that user is signed on and the Promise that gets returned is resovled.
			// If both fail, the Promise is rejected and gets an array of the errors from both sign on attempts.
			signIn: function(pw) {
				return new Promise(function(resolve, reject) {
					let doneAttempts = 0;
					const totalAttempts = USERS.length;

					let rejections = [];

					for (let i = 0; i < totalAttempts; i++) {
						const user = USERS[i];
						auth.instance.signInWithEmailAndPassword(user, pw).then(function(e) {
							doneAttempts++;
							resolve(e, rejections);
						}).catch(function(rejection) {
							rejections.push({error: rejection, user: user});
							if (++doneAttempts == totalAttempts) {
								reject(rejections);
							}
						});
					}
				});
			},
			// Signs the user out if there is one currently signed in.
			signOut: function() {
				if (!auth.signedIn) return;
				auth.instance.signOut();
			},
			// Attaches repeatable event listeners to certain events.
			listenFor: {
				signIn: function(cb) {
					attachListener("signIn", cb);
				},
				signOut: function(cb) {
					attachListener("signOut", cb);
				},
				userChange: function(cb) {
					attachListener("changeUser", cb);
				},
				init: function(cb) {
					// If already initted, run immediately.
					if (auth.initted) {
						cb();
					} else {
						attachListener("init", cb);
					}
				}
			},
			// Keeps track of attached listeners.
			listeners: {
				signIn: [],
				signOut: [],
				userChange: [],
				init: [],
			},
			initted: false,
			connected: true
		}
	} else {
		window.auth = {
			connected: false
		};
	}
})();
