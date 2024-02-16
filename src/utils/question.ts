import { TUntrustedData } from '@/types'
import {
  getQuestionFromId,
  saveUser,
  saveUserQuestionResponse,
} from './database-operations'
import { generateFarcasterFrame, SERVER_URL } from './generate-frames'
import { IMAGES } from './image-paths'

export const QUESTION_ID = 1

export const QUESTION_METATAGS = `<meta property="fc:frame:input:text" content="Type your answer" />
 <meta property="fc:frame:button:1" content="Submit ✉️" />`

/* export const QUESTION_METATAGS = `
 <meta property="fc:frame:button:1" content="NYC" />
 <meta property="fc:frame:button:2" content="Berlin" />`
 */

//to the bottom of the image here
export const HANDLE_QUESTION = async (channel: string, ud: TUntrustedData) => {
  const question = await getQuestionFromId(QUESTION_ID)
  const user = await saveUser(ud, channel)
  if (ud.inputText && ud.inputText.length) {
    const correctResponse =
      ud.inputText &&
      ud.inputText.toLowerCase() === question?.correct_response?.toLowerCase()
    const html = await saveUserQuestionResponse(
      ud,
      user.id,
      correctResponse as boolean,
      ud.inputText
    )
    return html
  } else if (question?.options[ud.buttonIndex]) {
    const correctResponse =
      question?.options[ud.buttonIndex].toLocaleLowerCase() ===
      question?.corrent_response.toLocaleLowerCase()

    const html = await saveUserQuestionResponse(
      ud,
      user.id,
      correctResponse as boolean,
      question?.options[ud.buttonIndex]
    )
    return html
  } else
    return generateFarcasterFrame(`${SERVER_URL}/${IMAGES.welcome}`, 'start')
}
