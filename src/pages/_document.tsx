import { Html, Head, Main, NextScript } from 'next/document'
 
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body style={{
        background: 'black',
        color: 'rgba(255, 255, 255, 0.87)',
      }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}