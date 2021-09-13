import React from 'react';
import cl from './MyModal.module.css';
import {CSSTransition} from 'react-transition-group'
const MyModal = ({children, visible, setVisible}) => {

    const rootClasses = [cl.myModal]
    if(visible){
        rootClasses.push(cl.active)
    }

    return (
        <CSSTransition
        in={visible}
        timeout={300}
        classNames="modal"
        unmountOnExit
        onClick={()=>setVisible(false)}
        >
           <div className={rootClasses.join(' ')}>
            <div className={cl.myModalContent} onClick={(e)=> e.stopPropagation()}>
                {children}
            </div>
        </div>
      </CSSTransition>
    )
}

export default MyModal;