import { TUntrustedData } from '@/types'
import {
  getQuestionFromId,
  saveUser,
  saveUserQuestionResponse,
} from './database-operations'
import { generateFarcasterFrame, SERVER_URL } from './generate-frames'
import { IMAGES } from './image-paths'

export const QUESTION_ID = 1

//to the bottom of the image here
export const HANDLE_QUESTION = async (ud: TUntrustedData) => {
  const question = await getQuestionFromId(QUESTION_ID)
  const user = await saveUser(ud)
  /*   if (ud.inputText && ud.inputText.length) {
    const correctResponse =
      ud.inputText &&
      ud.inputText.toLowerCase() === question?.correct_response?.toLowerCase()
      console.log('Correct response')
    const html = await saveUserQuestionResponse(
      ud,
      user.id,
      correctResponse as boolean,
      ud.inputText
    )
    return html
  } else  */
  console.log('we should come here', question?.options, ud.buttonIndex)
  let questionButtonIndex = question?.options[ud.buttonIndex - 1]
  if (questionButtonIndex) {
    console.log(
      'wat is correct response?',
      questionButtonIndex.toLocaleLowerCase(),
      questionButtonIndex.toLocaleLowerCase()
    )
    const correctResponse =
      questionButtonIndex.toLocaleLowerCase() ===
      question?.correct_response.toLocaleLowerCase()

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
