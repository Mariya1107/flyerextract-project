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
          <img src="/assets/Logo.png" alt="Logo" style={{ height: "50px" }} />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          {/* Navigation Links */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/becomeshop">Become a Shop With Us</Nav.Link>
            <Nav.Link href="#about-us">About Us</Nav.Link>
            <Nav.Link
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
            <Button className="btn me-2 signin_btn"
            
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
