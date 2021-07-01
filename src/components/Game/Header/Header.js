import React, { useState, useEffect, useRef } from "react";
import {
  Nav,
  NavBarContainer,
  NavLogo,
  NavImg,
  NavMenu,
  NavItem,
  NavCoin,
  DropDownMenu,
  NavDropDown,
  DropDownOption,
} from "./Header.elements";
import logoImg from "../../../images/runcoin-logo-img.svg";
import ButtonLog from "../../Logic/ButtonLog";
import { useLogin } from "../../../hooks/useLogin";
import { addToken, claimToken, countToken } from "../../../services/server";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Tooltip from '@material-ui/core/Tooltip';
// import Alert from "../Alert/Alert";

const Header = ({ reload, setReload }) => {
  const [click, setClick] = useState(false);
  // const [open, setOpen] = useState(false);
  const [countRun, setCountRun] = useState(0);
  const { logued } = useLogin();
  const ref = useRef(null);

  const handleClick = () => {
    setClick(!click)
  };
  const handleClickHome = () => {
    window.open("https://runcoin.page/", '_blank');
  }

  function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      setClick(false);
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    countToken().then(
      (res) => {
        setCountRun(res)
      }
    )
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  const handleClaim = () => {
    console.log('Claim');
    claimToken().then(
      (res) => {
        if (res) {
          console.log("reclamado");
          countToken().then(
            (res) => {
              setCountRun(res)
            }
          )
        }
      }
    )
  }

  const handleCheck = (event) => {
    setReload(event.target.checked)
  }

  const handleAdd = () => {
    addToken()
  }


  return (
    <Nav className="shadow-sm">
      {/* <Alert icon="success" msg="Token added" open={open} type="success" /> */}
      <NavBarContainer>
        <NavLogo onClick={handleClickHome} >
          <NavImg  src={logoImg} alt="logo-img" ></NavImg>RUNCOIN
        </NavLogo>
        <NavMenu>
          <FormControlLabel
            value="end"
            control={<Checkbox
              checked={reload}
              onChange={handleCheck}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />}
            label={
              <Tooltip title="Reload Every Minute">
                <h6 style={{ color: 'white', fontFamily: 'Lexend Mega', fontWeight: 'lighter'  }}>Reload</h6>
              </Tooltip>
            }
            labelPlacement="end"
          />

          <NavCoin >
            <a style={{ color: 'white', textDecoration: 'none' }} target="_blank" href="https://quickswap.exchange/#/swap?outputCurrency=0x648A372552725EE4ABFC8E8F3006d80124D63B44&inputCurrency=MATIC">
              Buy
            </a>
          </NavCoin>
          {logued ? (
            <DropDownMenu ref={ref}>
              <NavCoin onClick={handleClick}>{countRun} RUN</NavCoin>
              <NavDropDown click={click}>
                <DropDownOption onClick={handleClaim}>Claim Run</DropDownOption>
                <DropDownOption onClick={handleAdd}>Add to Metamask</DropDownOption>
              </NavDropDown>
            </DropDownMenu>
          ) : null}
          <NavItem>
            <ButtonLog />
          </NavItem>
        </NavMenu>
      </NavBarContainer>
    </Nav>
  );
};

export default Header;
