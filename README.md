# Demo middleware app that can use VUE
Hey GTel Team, I threw this together quickly with some scraps from other bits of code.
I'm not sure if any of this will be helpful or useful, but hopefully it's a start.

# Startup:
From the `/server` directory run (use `sudo` if necessary):

`node app.js`

Direct to `localhost` in your browser and it should show the login page.

The email is "test@test.com" and password "password". Once signed in, the server will then generate a json record in the sessions folder. This record is used by the passport, express-session, and file-store packages to log sessions and manage user variables.

Please et me know if I can help explain any of this, or help write anything else.

# Resources:
This has a good explanation of sessions and using passport, especially with login and user storage
* [https://medium.com/@evangow/server-authentication-basics-express-sessions-passport-and-curl-359b7456003d](https://medium.com/@evangow/server-authentication-basics-express-sessions-passport-and-curl-359b7456003d)

Here has a lot of branching links that might have what you guys are looking for
* [https://www.npmjs.com/package/vue](https://www.npmjs.com/package/vue)

This has some useful guides for server side rendering, although I don't know if it applies to what yall need
* [https://ssr.vuejs.org/guide/#using-a-page-template](https://ssr.vuejs.org/guide/#using-a-page-template)

Good Luck!! :smile:
