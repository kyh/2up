import React from 'react' 
import { useTrivia } from 'hooks/useTrivia';
import Debug from 'components/Debug'

export const DebugTV = () => {
  const [state, broadcast] = useTrivia()

  return (
    <div>
      <h1>TestTV</h1>
      <Debug state={state} />
    </div>
  )
}
