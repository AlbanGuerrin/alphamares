import React, { useEffect, useState } from 'react'
import SignInform from './SignInForm';
import SignUpForm from './SignUpForm';

const Log = (props) => {
    const [signUpModal, setSignUpModal] = useState(props.signup);
    const [signInModal, setSignInModal] = useState(props.signin);


    useEffect(() => {
        setSignInModal(props.signin);
        setSignUpModal(props.signup);
    }, [props])


    return (
        <div style={{color:'white', display:'flex', flexDirection:'column', alignItems:'center'}}>
            {signUpModal && <SignUpForm />}
            {signInModal && <SignInform />}
        </div>
    );
};

export default Log;