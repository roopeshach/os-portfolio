import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

const Display = styled.div`
  background: rgba(0, 0, 0, 0.2);
  padding: 20px;
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 120px;
`;

const Equation = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  min-height: 20px;
`;

const Result = styled.div`
  font-size: 48px;
  font-weight: 300;
  font-family: 'Rajdhani', sans-serif;
`;

const Keypad = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  flex: 1;
  gap: 1px;
  background: ${props => props.theme.colors.border};
`;

const Button = styled.button<{ $accent?: boolean; $secondary?: boolean }>`
  background: ${props => props.$accent ? props.theme.colors.accent : props.$secondary ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)'};
  color: ${props => props.$accent ? '#000' : props.theme.colors.text};
  border: none;
  font-size: 18px;
  cursor: pointer;
  font-family: 'Rajdhani', sans-serif;
  transition: all 0.1s;
  
  &:hover {
    filter: brightness(1.2);
  }
  &:active {
    filter: brightness(0.9);
  }
`;

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [shouldReset, setShouldReset] = useState(false);

  const handlePress = (key: string) => {
    if (key === 'C') {
      setDisplay('0');
      setEquation('');
      setShouldReset(false);
    } else if (key === '=') {
      try {
        const safeEval = new Function('return ' + equation + display);
        const result = safeEval();
        setEquation('');
        setDisplay(String(result));
        setShouldReset(true);
      } catch {
        setDisplay('Error');
        setShouldReset(true);
      }
    } else if (['+', '-', '*', '/', '%'].includes(key)) {
      setEquation(equation + display + key);
      setDisplay('0');
      setShouldReset(false);
    } else if (['sin', 'cos', 'tan', 'log', 'sqrt'].includes(key)) {
      try {
        const val = parseFloat(display);
        let res = 0;
        switch(key) {
          case 'sin': res = Math.sin(val); break;
          case 'cos': res = Math.cos(val); break;
          case 'tan': res = Math.tan(val); break;
          case 'log': res = Math.log10(val); break;
          case 'sqrt': res = Math.sqrt(val); break;
        }
        setDisplay(String(res));
        setShouldReset(true);
      } catch {
        setDisplay('Error');
      }
    } else if (key === 'pi') {
      setDisplay(String(Math.PI));
      setShouldReset(true);
    } else {
      if (shouldReset) {
        setDisplay(key);
        setShouldReset(false);
      } else {
        setDisplay(display === '0' ? key : display + key);
      }
    }
  };

  return (
    <Container>
      <Display>
        <Equation>{equation}</Equation>
        <Result>{display}</Result>
      </Display>
      <Keypad>
        <Button $secondary onClick={() => handlePress('sin')}>sin</Button>
        <Button $secondary onClick={() => handlePress('cos')}>cos</Button>
        <Button $secondary onClick={() => handlePress('tan')}>tan</Button>
        <Button $secondary onClick={() => handlePress('C')}>C</Button>
        <Button $secondary onClick={() => handlePress('DEL')}>←</Button>

        <Button $secondary onClick={() => handlePress('log')}>log</Button>
        <Button $secondary onClick={() => handlePress('sqrt')}>√</Button>
        <Button $secondary onClick={() => handlePress('^')}>^</Button>
        <Button $secondary onClick={() => handlePress('%')}>%</Button>
        <Button $secondary onClick={() => handlePress('/')}>/</Button>

        <Button $secondary onClick={() => handlePress('pi')}>π</Button>
        <Button onClick={() => handlePress('7')}>7</Button>
        <Button onClick={() => handlePress('8')}>8</Button>
        <Button onClick={() => handlePress('9')}>9</Button>
        <Button $secondary onClick={() => handlePress('*')}>×</Button>

        <Button $secondary onClick={() => handlePress('e')}>e</Button>
        <Button onClick={() => handlePress('4')}>4</Button>
        <Button onClick={() => handlePress('5')}>5</Button>
        <Button onClick={() => handlePress('6')}>6</Button>
        <Button $secondary onClick={() => handlePress('-')}>-</Button>

        <Button $secondary onClick={() => handlePress('(')}>(</Button>
        <Button onClick={() => handlePress('1')}>1</Button>
        <Button onClick={() => handlePress('2')}>2</Button>
        <Button onClick={() => handlePress('3')}>3</Button>
        <Button $secondary onClick={() => handlePress('+')}>+</Button>

        <Button $secondary onClick={() => handlePress(')')}>)</Button>
        <Button onClick={() => handlePress('00')}>00</Button>
        <Button onClick={() => handlePress('0')}>0</Button>
        <Button onClick={() => handlePress('.')}>.</Button>
        <Button $accent onClick={() => handlePress('=')}>=</Button>
      </Keypad>
    </Container>
  );
};

export default Calculator;
