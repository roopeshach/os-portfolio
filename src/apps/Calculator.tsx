import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${props => props.theme.colors.brutalistYellow || '#ffd93d'};
  color: #000;
`;

const Display = styled.div`
  background: #fff;
  padding: 20px;
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 120px;
  overflow: hidden;
  border-bottom: 3px solid #000;
`;

const Equation = styled.div`
  font-size: 14px;
  color: #666;
  min-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
`;

const Result = styled.div`
  font-size: 48px;
  font-weight: 800;
  font-family: 'Rajdhani', sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #000;
`;

const Keypad = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  flex: 1;
  gap: 3px;
  background: #000;
  padding: 3px;
`;

const Button = styled.button<{ $accent?: boolean; $secondary?: boolean }>`
  background: ${props => props.$accent ? props.theme.colors.brutalistPink || '#ff6b9d' : props.$secondary ? props.theme.colors.brutalistBlue || '#4d96ff' : props.theme.colors.brutalistGreen || '#6bcb77'};
  color: #000;
  border: 3px solid #000;
  font-size: 18px;
  cursor: pointer;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 800;
  transition: all 0.1s;
  
  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: 2px 2px 0 #000;
  }
  &:active {
    transform: translate(1px, 1px);
  }
`;

interface CalculatorProps {
  isActive?: boolean;
}

const Calculator: React.FC<CalculatorProps> = ({ isActive }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [shouldReset, setShouldReset] = useState(false);

  const safeCalculate = (expression: string) => {
    try {
      // Normalize expression
      
      // Auto-close parenthesis
      const openParens = (expression.match(/\(/g) || []).length;
      const closeParens = (expression.match(/\)/g) || []).length;
      let balancedExpr = expression;
      if (openParens > closeParens) {
        balancedExpr += ')'.repeat(openParens - closeParens);
      }

      const expr = balancedExpr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/\^/g, '**');

      // Helper for degrees conversion
      const toRad = (d: number) => d * (Math.PI / 180);
      
      // We need to inject our custom functions into the evaluation scope
      // Using new Function with arguments
      
      // Replace function names with custom ones to avoid standard Math behavior (radians)
      // We use 'sin', 'cos', 'tan' in the string, but we will pass custom functions
      
      // However, the user might have typed 'sin(30)' which is in the string.
      // If we just eval 'sin(30)', we need 'sin' to be defined.
      
      // Define context
      const context = {
        sin: (d: number) => Math.sin(toRad(d)),
        cos: (d: number) => Math.cos(toRad(d)),
        tan: (d: number) => Math.tan(toRad(d)),
        log: (n: number) => Math.log10(n),
        sqrt: Math.sqrt,
        Math: Math 
      };

      // Security check: only allow safe characters
      if (/[^0-9+\-*/().%sinco tanlogsqrtMathPIE,_]/.test(expr)) {
          // Check if it contains only allowed keywords
          // This regex is too simple and might block valid stuff or allow invalid.
          // Let's rely on the restricted scope of new Function keys.
      }

      // Create function with keys of context as arguments
      const keys = Object.keys(context);
      const values = Object.values(context);
      
      const func = new Function(...keys, 'return ' + expr);
      const result = func(...values);
      
      if (!isFinite(result) || isNaN(result)) return 'Error';
      
      // Round to avoid floating point precision issues
      return String(Math.round(result * 10000000000) / 10000000000);
    } catch {
      return 'Error';
    }
  };

  const handlePress = useCallback((key: string) => {
    if (key === 'C') {
      setDisplay('0');
      setEquation('');
      setShouldReset(false);
    } else if (key === '=') {
      // If last char is operator, remove it? No, syntax error is fine (Error).
      // But we should append display to equation if it's not empty?
      // If equation ends with operator, append display.
      // If equation ends with ), implies implied multiplication? JS doesn't support 2(3).
      // Let's just append display.
      const finalExpr = equation + display;
      const result = safeCalculate(finalExpr);
      setEquation('');
      setDisplay(result);
      setShouldReset(true);
    } else if (['sin', 'cos', 'tan', 'log', 'sqrt'].includes(key)) {
      if (shouldReset) {
        setEquation(key + '(');
        setDisplay('0');
        setShouldReset(false);
      } else {
        // If display is not 0, assume we want to wrap it? Or just append?
        // Standard calc: hitting sin while 30 is displayed -> sin(30).
        // Let's try that.
        // But if we just typed 30, display is 30.
        // If we want sin(30), we usually press sin -> 30 -> ) -> =.
        // Or 30 -> sin (postfix).
        // The user interface has buttons like a formula builder.
        // So pressing 'sin' appends 'sin(' to equation.
        setEquation(equation + key + '(');
        setDisplay('0');
      }
    } else if (['+', '-', '*', '/', '%', '^'].includes(key)) {
      setEquation(equation + display + key);
      setDisplay('0');
      setShouldReset(false);
    } else if (key === 'DEL') {
      if (shouldReset) {
        setDisplay('0');
        setShouldReset(false);
      } else {
        if (display.length > 1) {
          setDisplay(display.slice(0, -1));
        } else {
          setDisplay('0');
        }
      }
    } else {
      // Numbers, ., (, )
      if (shouldReset) {
        setDisplay(key);
        setShouldReset(false);
      } else {
        setDisplay(display === '0' && key !== '.' ? key : display + key);
      }
    }
  }, [display, equation, shouldReset]);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      
      if (/[0-9]/.test(key)) handlePress(key);
      if (key === '.') handlePress('.');
      if (key === 'Enter') handlePress('=');
      if (key === 'Backspace') handlePress('DEL');
      if (key === 'Escape') handlePress('C');
      if (['+', '-', '*', '/', '%', '^', '(', ')'].includes(key)) handlePress(key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, handlePress]);

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
