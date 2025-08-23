import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";

const Header = ({
  setShowProviderModal,
  setShowAdminModal,
  setAuthMode,
  setShowAuthModal,
}) => {
  return (
    <Navbar expand="lg" bg="light" className="shadow-sm">
      <Container>
        {/* Logo */}
        <Navbar.Brand as={Link} to="/">
          <img src="/Logo.png" alt="Logo" style={{ height: "50px" }} />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" style={{marginLeft:"3%"}}>
          {/* Navigation Links */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" style={{color:"black", fontWeight:"500", paddingLeft:"30px"}}>Home</Nav.Link>
            <Nav.Link as={Link} to="/becomeshop"  style={{color:"black", fontWeight:"500", paddingLeft:"30px"}}>Become a Shop With Us</Nav.Link>
            <Nav.Link href="#about-us"  style={{color:"black", fontWeight:"500", paddingLeft:"30px"}}>About Us</Nav.Link>
            <Nav.Link style={{color:"black", fontWeight:"500", paddingLeft:"30px"}}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowAdminModal(true);
              }}
            >
              Admin
            </Nav.Link>
          </Nav>

          {/* Right Buttons */}
          <div className="d-flex">
            <Button className="btn me-2 signin_btn" style={{background:"#fbbb12",
    border: "1px solid #d89e05",
    color: "#000"}}
            
              onClick={() => {
                setAuthMode("signin");
                setShowAuthModal(true);
              }}
            >
              <FontAwesomeIcon icon={faLock} /> Sign In
            </Button>

            <Button className="for_btn btn-joinus"
             
              onClick={() => {
                setShowProviderModal(true);
              }}
            >
              <FontAwesomeIcon icon={faUser} /> Provider Sign In
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
