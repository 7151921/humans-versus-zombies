import styled from 'styled-components'
import {Link as LinkR} from 'react-router-dom'
import {Link as LinkS} from 'react-scroll'


export const Nav = styled.nav`
  background: #000;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
  
  @media screen and (max-width: 960px) {
    transition: 0.8s all ease;
  }
`

export const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  z-index: 1;
  width: 100%;
  padding: 0 24px;
  max-width: 1100px;
`;

export const NavLogo = styled(LinkR) `
  color: #fff;
  justify-self: flex-start;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  font-weight: bold;
  text-decoration: none;

  &:hover {
    transition: all 0.2s ease-in-out;
    color: #04ff82;
  }
`

export const MobileIcon = styled.div`
  display: none;
  color: #fff;
  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 60%);
    font-size: 1.8rem;
    cursor: pointer;
  }
`

export const NavMenu = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  text-align: center;
  
  @media screen and (max-width: 768px) {
    display: none;
  }
`

export const NavItem = styled.li`
  height: 80px;
`

export const NavLinks = styled(LinkS)`
  color: #e4e2de;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;

  &.active {
    border-bottom: 3px solid #04ff82;
    color: #04ff82;

  }

  &:hover {
    transition: all 0.2s ease-in-out;
    color: #04ff82;
  }
`;

export const NavRoute = styled(LinkR)`
  color: #e4e2de;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;

  &.active {
    border-bottom: 3px solid #04ff82;
    color: #04ff82;

  }

  &:hover {
    transition: all 0.2s ease-in-out;
    color: #04ff82;
  }
`;

export const NavBtn = styled.nav`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavBtnLink = styled(LinkR)`
  border-radius: 50px;
  background-color: #01bf71;
  color: #e4e2de;
  white-space: nowrap;
  padding: 10px 20px;
  font-size: 16px;
  outline: none;
  border-style: solid;
  border-color: #01BF71;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;

  &:hover {
    transition: all 0.2s ease-in-out;
    background: #181d1c;
    color: #ffffff;
  }
`

export const NavHiddenBtnLink = styled(LinkR)`
  background-color: transparent;
  white-space: nowrap;
  color: white;
  font-size: 16px;
  outline: none;
  border: none;
  cursor: pointer;
  padding: 0 1rem;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  text-align: center; 
  line-height: 60px;
  
  &:hover {
    color: #04ff82;
  }
`