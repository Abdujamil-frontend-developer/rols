import styled from "styled-components";

export const LoginStyled = styled.div `
display: flex;
align-items: center;
justify-content: center;
width: 100%;
height: 100vh;
.login{
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap:15px;
}

.login__btn:not(:disabled) {
  background: #1677ff !important;
  color: #fff !important;
}


.login__remember{
  display: flex;
  justify-content: space-between;
  padding: 0px 10px 0px 10px;
  margin-bottom:15px;
}


`;