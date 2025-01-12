const {
  Formula,
  BinaryOperatorFormula,
  UnaryOperatorFormula,
  Literal,
} = require("./formula");

class FormulaParser {
  constructor(formulaString) {
    this.setFormulaString(formulaString);
  }

  setFormulaString(formula) {
    this.formulaString = formula;
  }

  setFormula(formula) {
    this.formula = formula;
  }

  parse() {
    return this.parseFormula();
  }

  parseFormula() {
    let f1 = this.formulaTypeTwo();
    if (f1 == null) return null;
    let f2 = this.parseFormulaNext();
    if (f2 == null) return f1;
    return new BinaryOperatorFormula(f1, "&", f2);
  }

  parseFormulaNext() {
    if (this.formulaString[0] == "&") {
      this.formulaString = this.formulaString.substring(1);
      return this.parseFormula();
    } else return null;
  }

  isUnaryFormula() {
    return this.formulaString[0] == "!" || this.formulaString[0] == "K";
  }

  formulaTypeTwo() {
    if (!this.isUnaryFormula()) {
      return this.formulaTypeThree();
    }

    // this is a logic for creating unary formula

    let operator;

    //this if checks for operators, beacuase we can have operators that are strings or legnth 1 or more with K1, K2, K3

    if (this.formulaString[0] == "K") {
      if (
        this.formulaString[1] == "1" ||
        this.formulaString[1] == "2" ||
        this.formulaString[1] == "3"
      ) {
        operator = this.formulaString[0] + this.formulaString[1];
        this.formulaString = this.formulaString.substring(2);
      } else {
        throw new Error("Unknown operator");
      }
    } else {
      operator = this.formulaString[0];
      this.formulaString = this.formulaString.substring(1);
    }

    let newFormula = this.formulaTypeTwo();

    return new UnaryOperatorFormula(operator, newFormula);
  }

  formulaTypeThree() {
    if (this.isLetter(this.formulaString[0])) {
      let charLiteral = this.formulaString[0];
      this.formulaString = this.formulaString.substring(1);
      return new Literal(charLiteral);
    } else if (this.formulaString[0] == "(") {
      this.formulaString = this.formulaString.substring(1);
      let f = this.parseFormula();
      this.formulaString = this.formulaString.substring(1);
      return f;
    } else {
      throw new Error("Unknown character type three");
    }
  }

  isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
  }
}

module.exports = { FormulaParser };
