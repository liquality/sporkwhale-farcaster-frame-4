export const SERVER_URL = process.env.NGROK_OR_HOSTED_SERVER_URL
import { TPostData, TUntrustedData } from '../types'
import { IMAGES } from './image-paths'
import { QUESTION_METATAGS } from './question'
import querystring from 'querystring';
// generate an html page with the relevant opengraph tags
export function generateFarcasterFrame(
  image: string,
  postData: TPostData,
  text?: string
) {
  let metaTags = ''
  console.log(postData, `${SERVER_URL}/question-image?question=${querystring.escape(text || '')}&image=${image}`)
  switch (postData) {
    case 'question':
      metaTags += `
			<meta property="fc:frame:image" content="${SERVER_URL}/question-image?question=${text}&image=${image}" />
		  "${QUESTION_METATAGS}"
			`
      break

    case 'error-see-leaderboard':
      metaTags += `
		<meta property="fc:frame:image" content="${image}" />
		<meta property="fc:frame:button:1" content="Go to leaderboard" />
    <meta property="fc:frame:button:2" content="See leaderboard in frame" />
		<meta property="fc:frame:button:1:action" content="post_redirect" />`
      break
    case 'error-be-a-follower':
      metaTags += `
      <meta property="fc:frame:image" content="${image}" />
      <meta property="fc:frame:button:1" content="Go follow channel!" />
      <meta property="fc:frame:button:1:action" content="post_redirect" />`
      break
  }

  const postUrl = `${SERVER_URL}/api/post?data=${postData}`

  return `
	  <!DOCTYPE html>
	  <html lang="en">
	  <head>
		<meta property="fc:frame" content="vNext" />
		${metaTags}
		<meta property="fc:frame:post_url" content="${postUrl}" />
	  </head>
	  <body>
	  </body>
	  </html>
	`
}
