import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";

const PageNotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #252525;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: #ffca3a;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: 1.5rem;
  color: #fff;
`;

function PageNotFound() {
  return (
    <PageNotFoundContainer>
      <Title>404</Title>
      <Message>Page not found</Message>
      <Typography sx={{ color: "white" }}>
        Go To Home Page{" "}
        <Link to={"/"} sx={{ color: "#ffca3a" }}>
          Click here
        </Link>
      </Typography>
    </PageNotFoundContainer>
  );
}

export default PageNotFound;
