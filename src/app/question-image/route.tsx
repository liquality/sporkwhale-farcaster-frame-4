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
          position: 'relative',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <img
          style={{
          height: '80%',
          }}
          alt={question}
          src={`${SERVER_URL}/${image}`}
        />
        <div
          style={{
            width: '100%',
            height: '5rem',
            textAlign: 'center',
            padding: '0 0rem',
          }}
        >
          {question}
        </div>
      </div>
    ),
    // ImageResponse options
    {
      width: 700,
      height: 500,
    }
  )
}
