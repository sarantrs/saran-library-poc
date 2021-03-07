import React, {useEffect} from 'react';
import {Button} from "react-bootstrap";

const Bar = props => {
  const variant = props.variant ? props.variant : 'success'

  useEffect(()=>{
      // console.log('props.now', props.now)
  }, [props])
  return (
    <div >
      Saravanan
    </div>
  )
}

export default Bar;