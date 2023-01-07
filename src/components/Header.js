import React from "react";
import { Container, Navbar } from "react-bootstrap";

export default function Header() {
  return (
    <Navbar bg="white" className="header">
      <Container>
        <img
          src="logo.png"
          height="69"
          className="d-inline-block align-top"
          alt="React Bootstrap logo"
        />
      </Container>
    </Navbar>
  );
}
