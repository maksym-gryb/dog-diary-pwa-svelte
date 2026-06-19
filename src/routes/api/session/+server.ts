import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { uid } = await request.json();

  cookies.set('uid', uid, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: true
  });

  return new Response('ok');
};

export const DELETE: RequestHandler = async ({ cookies }) => {
  cookies.delete('uid', { path: '/' });
  return new Response('ok');
};