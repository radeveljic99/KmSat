module.exports = { parse };

const Formulas = require("./formula");

var globalFormula = "";

function parse(sFormula) {
  globalFormula = sFormula;
  let formula = parseFormula();
  return formula;
}

function parseFormula() {
  let f1 = formulaTypeTwo();
  if (f1 == null) return null;
  let f2 = parseFormulaNext();
  if (f2 == null) return f1;
  return new Formulas.BinaryOperatorFormula(f1, "&", f2);
}

function parseFormulaNext() {
  if (globalFormula[0] == "&") {
    globalFormula = globalFormula.substring(1);
    return parseFormula();
  } else return null;
}

function formulaTypeTwo() {
  if (globalFormula[0] == "!" || globalFormula[0] == "K") {
    let operator;

    if (globalFormula[0] == "K") {
      if (
        globalFormula[1] == "1" ||
        globalFormula[1] == "2" ||
        globalFormula[1] == "3"
      ) {
        operator = globalFormula[0] + globalFormula[1];
        globalFormula = globalFormula.substring(2);
      } else {
        throw new Error("Unknown operator");
      }
    } else {
      operator = globalFormula[0];
      globalFormula = globalFormula.substring(1);
    }

    let newFormula = formulaTypeTwo();

    return new Formulas.UnaryOperatorFormula(operator, newFormula);
  } else return formulaTypeThree();
}

function formulaTypeThree() {
  if (isLetter(globalFormula[0])) {
    let charLiteral = globalFormula[0];
    globalFormula = globalFormula.substring(1);
    return new Formulas.Literal(charLiteral);
  } else if (globalFormula[0] == "(") {
    globalFormula = globalFormula.substring(1);
    let f = parseFormula();
    globalFormula = globalFormula.substring(1);
    return f;
  } else {
    throw new Error("Unknown character type three");
  }
}

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}
