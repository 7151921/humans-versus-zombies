import styled from "styled-components";
import {Link as LinkR, Link} from 'react-router-dom'

export const Container = styled.div`
  min-height: 692px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  z-index: 0;
  overflow: hidden;
  background: linear-gradient(108deg, rgba(1, 147, 86, 1) 0%,
  rgba(10, 201, 122, 1));


  background: linear-gradient(108deg,
  rgba(1, 147, 86, 1) 0%,
  rgba(10, 201, 122, 1) 100%,);
`

export const FormWrap = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media screen and (max-width: 400px) {
    margin-left: 16px;
    margin-top: 8px;
  }
`

export const Icon = styled(Link)`
  margin-left: 32px;
  margin-top: 32px;
  text-decoration: none;
  color: #fff;
  font-weight: 700;
  font-size: 32px;

  @media screen and (max-width: 400px) {
    margin-left: 16px;
    margin-top: 8px;
  }
`

export const FormContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media screen and (max-width: 400px) {
    padding: 10px;
  }
`


export const XFormWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

export const XFormContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const XForm = styled.form`

  display: flex;
  flex-direction: column;
  z-index: 1;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

export const Form = styled.form`
  background: rgba(1, 1, 1, 0.65);
  max-width: 400px;
  height: auto;
  width: 100%;
  z-index: 1;
  display: grid;
  margin: 0 auto;
  padding: 80px 32px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);

  @media screen and (max-width: 400px) {
    padding: 32px 32px;
  }
`

export const FormH1 = styled.h1`
  margin-bottom: 40px;
  color: #e4e2de;
  font-size: 20px;
  font-weight: 400;
  text-align: center;
`

export const FormH3 = styled.h3`
  margin-bottom: 20px;
  color: #e4e2de;
  font-size: 15px;
  font-weight: 400;
  text-align: center;
`

export const FormLabel = styled.label`
  margin-bottom: 8px;
  font-size: 14px;
  color: #e4e2de;
`

export const FormInput = styled.input`
  padding: 16px 16px;
  margin-bottom: 32px;
  border: none;
  border-radius: 4px;
`

export const FormButton = styled.button`
  background: #01bf71;
  padding: 16px 0;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
`

export const Text = styled.span`
  text-align: center;
  margin-top: 24px;
  color: #fff;
  font-size: 14px;
`

export const HelperText = styled(Link)`
  color: #fff;
  justify-self: start;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  font-weight: bold;

  &:hover {
    color: #04ff82;
    transition: 0.3s ease-out;
  }
`


export const ForgotPasswordLink = styled.a`
  color: #fff;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;

  &:hover {
    color: #04ff82;
    transition: 0.3s ease-out;
  }
`;

export const SignUpLink = styled.a`
  color: #fff;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;

  &:hover {
    color: #04ff82;
    transition: 0.3s ease-out;
  }
`;


// export const LinkText = styled.a`

// ;
// `

export const LinkText = styled(LinkR)`
  color: #e4e2de;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;

  &:hover {
    color: #04ff82;
    transition: 0.3s ease-out;
  }
`