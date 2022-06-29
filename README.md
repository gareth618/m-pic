# M-PIC ⛵

M-PIC is an aggregator-type app that helps you organize your photos from various photo-**sharing** platforms, such as Facebook, Twitter and Unsplash.

It was built by two students from their passion for quality **photography**, tired of wasting time by manually organizing their photos and sharing them on so many social platforms.

M-PIC is the all-in-one platform you'll ever need in order to save the time needed to organize your photo collection, letting you create more wonderful **memories** with your loved ones.

The website is live on [Heroku](https://m-p1c.herokuapp.com/). Also, check out the demo on [YouTube](https://www.youtube.com/watch?v=XYHqjYKyZYc)!

## 🚀 team

- Iulian Oleniuc (2B3)
- Elisabeta Dima (2B3)

## 🔭 stack

- **design** [figma](https://www.figma.com/file/FPE0X6J8mfUDaEQ6Sg8xH9/web)
- **deploy** [heroku](https://m-p1c.herokuapp.com/)
- **backend** node
- **database** postgres

![jwt](https://jwt.io/img/badge-compatible.svg)

# 1. app description

M-PIC lets users manage their photos posted on various social media platforms and get various information about each photo like the hashtags associated and the numbers of shares and likes. It is also possible to perform multi-criteria search on their photo collection and to apply filters.

## 1.1. app structure

### 1.1.1. home page

The home page contains a sign-in form alongside a link to the sign-up page designed for users with no M-PIC account. The only fields the user must fill in order to access the app are email and password. They can also check whether they want the browser to keep them logged in. Under the form there is a brief description of the app that hightlights its main features.

### 1.1.2. sign up

The sign up page contains only a form that requires the users to provide their email address and a password in case they have no M-PIC account. If they already have an account, they can click the sign-in button and will be redirected to the **home page** where they can enter their credentials.

### 1.1.3. my photos

After the user has managed to sign in, they are welcomed by the main page of the app, where all the photos the user has posted on the social media accounts saved in M-PIC are displayed in a chronological order. Here it is possible to search for certain photos based on the platforms they were posted on and sort them by the number of shares, likes and date of the post.

The edit mode appears when a photo is clicked and contains multiple filters that can be applied to it and some information about the photo as well: the date and the platform it was posted on, the associated hashtags and the number of likes and shares received on that platform.

On the upper right corner of the page, there is a navigation button that has three options: switch to the **my profiles** page, access the documentation or sign out of the app.

The app provides the option to download information about all displayed photos as a CSV file when the user clicks the icon on the lower left corner of the page. This mode can be exited in two different ways: either with the "x" sign on the right that simply returns to the main page or with the check sign next to it that also saves the edited photo in the user's collection.

### 1.1.4. my profiles

On this page, the user can see all the linked profiles and view or delete them. For every profile M-PIC displays three main social engagement indicators: number of posted photos, followers and total number of likes received. The user can also add a new profile on a certain platform using the "+" sign on the lower left corner.

On the upper right corner of the page, there is the same navigation button except for the first option which redirects the user to the **my photos** page.

## 1.2. app architecture

The UI/UX mockup of the app was designed in Figma. The frontend was written in vanilla HTML, CSS and JavaScript. The backend is mainly built in Node.js with the help of the APIs provided by the social media platforms: Graph API (from Facebook), Twitter API and Unplash API.

In order to use M-PIC, a user needs a stable connection to the internet and a browser. Thanks to the responsiveness of the app, M-PIC provides the best user experience possible, regardless of the screen size of the device used. The data exchange between the client and the server will be performed through a HTTPS protocol.

# 2. project structure

The source files are organized in the following hierarchy:

```
public
  css
  favicons
  images
    avif
    jpg
    webp
  js
src
  controllers
  models
  views
```

## 2.1. frontend

The files stored in `public` are **frontend** resources located at the same URL (relative to the app domain) as their local path (relative to the root directory). These include the `css` files used in styling the pages, the favicons (for *light*-theme and *dark*-theme), the images used in the *front-page auto-scrolling gallery animation* (in the modern and efficient `avif` and `webp` formats, with fallback to `jpg` for old browsers as well) and the client-side `js` scripts.

## 2.2. backend

The files located in `src` are ued directly by the **backend** and are organized in an **MVC** fashion. The `controllers` directory includes two files, namely `router.js` and `templater.js`, defining an **object-oriented model** for the **router** and for the **templating engine** used in **dynamically generating pages server-side**, as well as some `controller-` files defining the routes of the application. The next directory in `src` is `models` and it stores the SQL scripts used in managing the database. The last one is `views`, where the **reusable HTML components** are defined.

## 2.3 controllers

`Router` is the class which manages the application routes. These include the regular pages (`sign-in`, `sign-up`, `my-photos`, `my-profiles`), the resources in the `public` directory and the internal and external APIs. The main methods of this class are the following:

- `mime(dir, type)` adds routes for each file of `dir` in the given MIME-`type`
- `page404(file)` sets the 404 page as the HTML code inside `file`
- `postgres(config)` creates a **connection-pool** for the PostgreSQL database
- `get/post/put/delete(url, callback)` creates a route with the given **HTTP method** and `callback` function
- `listen()` starts listening to requests

A very important aspect is the structure of the `callback` function. It takes three parameters:

- `sql` the database connection associated with this request
  - `call(fun, args)` calls a PLpgSQL function with the given name and parameters and returns its result in JSON
- `req` a **façade** for the Node-like `req` object, containing
  - `cook` decodes the `token` cookie sent in the request header
  - `body` the JSON body of the request or its URL params object if the HTTP method was GET
- `res` a **façade** for the Node-like `res` object, containing
  - `goto(url)` makes a redirect to `url`
  - `html(html)` sends an HTML page as response
  - `code(code)` sets the HTTP status code of the response
  - `cook(user_id, remember)` sends to the client a **JWT-encoded** token with the given information
  - `json(json)` sends the `json` object as response

We use the following controllers:

- `controller-pages` defines the routes for the four main pages as well as for the three authorization pages (for Facebook, Twitter and Unsplash)
- `controller-internal` defines the internal API endpoints, detailed in section `3.1.`
- `controller-{{platform}}` defines the external API endpoints, those communicating with each of the three platforms, detailes in section `3.2.`

## 2.4 models

Regarding the models, `tables.sql` contains the script for creating the database tables, and the following files contain PLpgSQL functions in order to easily communicate with the database:

- `functions-users`
  - `sign_in(email, password)`
  - `sign_up(email, password)`
  - `delete_user(id)`
- `functions-profiles`
  - `add_profile(user_id, platform, code)`
  - `get_profile(id)`
  - `get_profiles(user_id)`
  - `set_profile_token(id, token)`
  - `delete_profile(id)`
- `functions-photos`
  - `add_photo(user_id, uri, created_at)`
  - `get_photos(user_id)`

The tables are:

- `users`
  - `email`
  - `password`
- `profiles`
  - `user_id` FK
  - `platform` name
  - `code` authorization code
  - `token` authorization token(s)
- `photos`
  - `user_id` FK
  - `uri` name of the file in `media` where it's stored
  - `created_at` date when the photo was posted

## 2.5 views

`Templater` is the class associated with *our own* templating engine. It's similar to React and it reduces the amount of duplicate code and it also helps us write **declarative** code for the user interface. Let's analyise its syntax:

- The views are structured in components, defined using the `component` tag.
  ```html
  <component name="Image">
    <picture>
      <source srcset="/public/images/avif/{{$id}}.avif" type="image/avif">
      <source srcset="/public/images/webp/{{$id}}.webp" type="image/webp">
      <img src="/public/images/jpg/{{$id}}.jpg" alt="photo">
    </picture>
  </component>
  ```
- Inside double-curly-braces we can write (arbitrarily-complex) JavaScript expressions.
  ```html
  <a href="{{$altPage.replace(/ /g, '-')}}">
  <!-- or -->
  <Welcome
    crtTitle="'sign in'"
    altTitle="'sign up'"
    fields="[
      { id: 'email', type: 'email', icon: 'envelope' },
      { id: 'password', type: 'password', icon: 'lock' }
    ]"
  >
  ```
- There is also a `for` tag for repeating patterns. In order to refer to a *context*-variable (an attribute of the custom-component), we use the `$` sign.
  ```html
  <for itr="script" arr="['global', ...$scripts]">
    <script src="/public/js/{{$script}}.js" defer></script>
  </for>
  ```

# 3. implementation details

In this section we will discuss about how certain features of M-PIC were implemented.

## 3.1. internal APIs

The internal APIs communicate directly with the database and are called client-side through the **AJAX** `fetch` function.

- **GET** `/api/sign-in` validates credentials
- **POST** `/api/sign-up` creates an account
- **DELETE** `/api/delete` deletes a profile
- **POST** `/api/upload` uploads an edited photo of a user
- **GET** `/api/photos` returns the edited photos of a user

## 3.2. external APIs

Those are used for authorizing Facebook, Twitter or Unsplash apps.

- **POST** `/api/{{platform}}/authorize` creates the profile in the database and sets its `code` – the value returned through the URL params of the corresponding authorization page
- **PUT** `/api/{{platform}}/token` generates the authorization `token` for the given profile
- **GET** `/api/{{platform}}/profile` returns profile-metadata by calling many platform-specific APIs alongside the `/photos` route
- **GET** `/api/{{platform}}/photos` returns photos-metadata by calling many platform-specific APIs

## 3.3. user sessions and JWTs

The user sessions are stored in **JSON Web Tokens** like this:

```json
{
  "user_id": "the database user_id",
  "duration": "the duration of the session in seconds",
  "iat": "the timestamp the token was issued at"
}
```

The duration can be either one minute or one hour, depending on whether the user has checked the *remember me* box or not.

The tokens are set in the client and send to the server using **cookies**. It validates them and eventually redirects the user to another page accordingly. For example, if a user is not signed in, a request to `/my-photos` redirects them to `/sign-in`.

## 3.4. sorting, filtering and searching photos

The photos are aggregated using the external APIs when the user accesses the `/my-photos` route. They are rendered server-side with `data-` attributes. When the client receives the page, it clones the `img` nodes. After that, the sorting, filtering and searching features become just some operations on an array.

The search is based on giving a set of tags. A score is calculated for each photo based on how similar its tags are to the search tags and how many they match. An **Edit-Distance** algorithm was used, namely the **Levenshtein Distance**.

## 3.5. editing and saving photos

The user can edit a photo using CSS filters. The result is drawn on an *imaginary* canvas and is converted to a **base64** representation, which is further send to the server. It generates a random file name for the photo, using a function from the `crypto` library. Then, it saves the photo at `media/{{uri}}.png` and also adds `uri` to the user's photos list in the database.
