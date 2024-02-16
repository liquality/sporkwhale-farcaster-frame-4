/* eslint-disable @next/next/no-img-element */
import { SERVER_URL } from '@/utils/generate-frames'
import { ImageResponse } from 'next/og'

export async function GET({ url }: Request) {
  const { searchParams } = new URL(url)
  const question = searchParams.get('question') || ''
  const image = searchParams.get('image')
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem'
        }}
      >
       
        <div
          style={{
            width: '100%',
            height: '15px',
            textAlign: 'center',
            padding: '0 0rem',
          }}
        >
          {question}
        </div>
        <img
        style={{
          height: '100px',

          textAlign: 'center',
          marginTop: '15px',
        }}
          alt={question}
          src={`${SERVER_URL}/${image}`}
        />
      </div>
    ),
    // ImageResponse options
    {
      width: 400,
      height: 200,
    }
  )
}
