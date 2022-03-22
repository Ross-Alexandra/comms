import styled from '@emotion/styled';
import theme from './theme';

export const AppDiv = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    min-height: 100%;
    width: 100%;
    
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;

    background-color: ${theme.backgroundGreen}
`;
