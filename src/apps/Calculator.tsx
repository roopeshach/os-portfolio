import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f3f3f3;
  color: black;
`;

const Display = styled.div`
  background: #f3f3f3;
  padding: 20px;
  text-align: right;
  font-size: 32px;
  font-weight: bold;
`;

const Keypad = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  flex: 1;
  gap: 1px;
  background: #ccc;
`;

const Button = styled.button<{ $wide?: boolean; $accent?: boolean; $height2?: boolean }>`
  background: ${props => props.$accent ? '#0078d7' : '#fff'};
  color: ${props => props.$accent ? '#fff' : '#000'};
  border: none;
  font-size: 16px;
  cursor: pointer;
  grid-column: ${props => props.$wide ? 'span 2' : 'span 1'};
  grid-row: ${props => props.$height2 ? 'span 2' : 'span 1'};
  &:hover {
    background: ${props => props.$accent ? '#006cc1' : '#eee'};
  }
  &:active {
    background: #ccc;
  }
`;

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handlePress = (key: string) => {
    if (key === 'C') {
      setDisplay('0');
      setEquation('');
    } else if (key === '=') {
      try {
        // Safe enough for calculator
        // eslint-disable-next-line no-eval
        const result = eval(equation + display);
        setDisplay(String(result));
        setEquation('');
      } catch {
        setDisplay('Error');
      }
    } else if (['+', '-', '*', '/'].includes(key)) {
      setEquation(equation + display + key);
      setDisplay('0');
    } else {
      setDisplay(display === '0' ? key : display + key);
    }
  };

  return (
    <Container>
      <Display>{display}</Display>
      <Keypad>
        <Button onClick={() => handlePress('C')}>C</Button>
        <Button onClick={() => handlePress('/')}>/</Button>
        <Button onClick={() => handlePress('*')}>*</Button>
        <Button onClick={() => handlePress('-')}>-</Button>
        
        <Button onClick={() => handlePress('7')}>7</Button>
        <Button onClick={() => handlePress('8')}>8</Button>
        <Button onClick={() => handlePress('9')}>9</Button>
        <Button onClick={() => handlePress('+')} $height2>+</Button>
        
        <Button onClick={() => handlePress('4')}>4</Button>
        <Button onClick={() => handlePress('5')}>5</Button>
        <Button onClick={() => handlePress('6')}>6</Button>
        
        <Button onClick={() => handlePress('1')}>1</Button>
        <Button onClick={() => handlePress('2')}>2</Button>
        <Button onClick={() => handlePress('3')}>3</Button>
        <Button onClick={() => handlePress('=')} $height2 $accent>=</Button>
        
        <Button onClick={() => handlePress('0')} $wide>0</Button>
        <Button onClick={() => handlePress('.')}>.</Button>
      </Keypad>
    </Container>
  );
};

export default Calculator;
