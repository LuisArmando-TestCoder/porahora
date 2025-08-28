import { redirect } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';


import {SECRET_CLIENT_ID,SECRET_CLIENT_SECRET} from '$env/static/private';

async function getUserData(access_token) {
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
  const data = await response.json();
  return data;
}


export const GET = async ({ url, cookies }) => {
    const redirectURL = 'http://localhost:5173/oauth';
    const code = await url.searchParams.get('code');

    try {
        const oAuth2Client = new OAuth2Client(
          SECRET_CLIENT_ID,
          SECRET_CLIENT_SECRET,
          redirectURL
        );
        const r = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(r.tokens);
        const user = oAuth2Client.credentials;

        // Fetch user info from Google
        const userInfo = await getUserData(user.access_token);

        // Only store non-sensitive info in cookie
        const { sub, name, given_name, family_name, picture } = userInfo;
        console.log("userInfo", userInfo, cookies)
        cookies.set(
          'user',
          JSON.stringify({ sub, name, given_name, family_name, picture }),
          {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
            maxAge: 60 * 60 * 24 * 7 // 1 week
          }
        );
    } catch (err) {
        console.log('Error logging in with OAuth2 user', err);
    }

    throw redirect(303, '/dashboard');
};
