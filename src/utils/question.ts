import { TUntrustedData } from '@/types'
import { saveUser, saveUserQuestionResponse } from './database-operations'
import { generateFarcasterFrame, SERVER_URL } from './generate-frames'
import { IMAGES } from './image-paths'

export const QUESTION = {
  id: 1,
  question: 'What is Johannas last name?',
  correct_response: 'fransson',
}

export const QUESTION_METATAGS = `<meta property="fc:frame:input:text" content="Type your answer" />
 <meta property="fc:frame:button:1" content="Submit ✉️" />`

/* export const QUESTION_METATAGS = `
 <meta property="fc:frame:button:1" content="NYC" />
 <meta property="fc:frame:button:2" content="Berlin" />`
 */
export const BUTTON_INDEX_MAPPING: { [key: string]: string } = {
  '1': 'fransson',
  '2': 'mehrain',
}

export const HANDLE_QUESTION = async (channel: string, ud: TUntrustedData) => {
  const user = await saveUser(ud, channel)
  if (ud.inputText && ud.inputText.length) {
    const correctResponse =
      ud.inputText && ud.inputText.toLowerCase() === QUESTION.correct_response
    const html = await saveUserQuestionResponse(
      ud,
      user.id,
      correctResponse as boolean,
      ud.inputText
    )
    return html
  } else if (BUTTON_INDEX_MAPPING[ud.buttonIndex]) {
    const correctResponse =
      BUTTON_INDEX_MAPPING[ud.buttonIndex].toLocaleLowerCase() ===
      QUESTION.correct_response.toLocaleLowerCase()
    console.log(
      BUTTON_INDEX_MAPPING[ud.buttonIndex],
      'is correct?',
      correctResponse
    )
    const html = await saveUserQuestionResponse(
      ud,
      user.id,
      correctResponse as boolean,
      BUTTON_INDEX_MAPPING[ud.buttonIndex]
    )
    return html
  } else return generateFarcasterFrame(`${SERVER_URL}/${IMAGES.whale}`, 'start')
}
