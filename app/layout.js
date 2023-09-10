import './globals.css'


export const metadata = {
  title: 'Multiplayer Connect 4',
  description: 'Harshith (c)',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >{children}</body>
    </html>
  )
}
