/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
  let user = null;
  const userCookie = cookies.get('user');
  console.log("Cookie value in +layout.server.js:", userCookie);
  if (userCookie) {
    try {
      user = JSON.parse(userCookie);
      console.log("Parsed user in +layout.server.js:", user);
    } catch (e) {
      user = null;
      console.log("Error parsing user cookie in +layout.server.js:", e);
    }
  }
  return {
    user
  };
}
