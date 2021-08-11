## Screenshot

![Admin Dashboard Screenshot](https://github.com/moogle-cc/moogle-blog-admin/blob/main/images/admin-dashboard.png?raw=true)

### Getting Started

#### Prerequisites

0. Familiarity with React and SPA concepts
1. `node` and `npm` installed locally. I use `16.4.0` and `7.18.1` respectively.
2. Familiarity with `bulma` (if you want to customize the admin dashboard's UI)
3. `node-sass` should be available globally (if you want to customize the admin dashboard's UI)
4. Moogle account*
*If you don't want to use a Moogle account, I will be adding a section titled `Working without a Moogle Account`.


#### Build and Deploy the app

1. Clone this repo
2. cd into the PROJECT_ROOT
3. `npm install`
4. `npm run build`
5. Copy the contents of the `build` directory to your hosting under say `/admin`
6. Visit your blog in the browser

## Securing the Dashboard

The moogle admin dashboard uses AWS Cognito to authenticate and securely call the backend APIs. The logic for checking user credentials and redirecting users to AWS Cognito in case they are not logged in sits inside `App.js`. 

P.S. JWT is read from local storage. Not ideal but a definitely a To-Do!

## Getting Oriented

The Moogle Blog is driven by two important files - `index.json` and `constants.json`. The admin dashboard helps you manage the contents of both these files.

In the above screenshot, the left half of the page is how you manage `constants.json` while the right half helps you manage `index.json`

## Conclusion

This is an early cut of the code and there is lots of room to cleanup and optimize the code. I am releasing this code just to close the loop on letting people use the Moogle blog.