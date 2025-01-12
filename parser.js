const {
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
    console.log("calling parse formula");
    let f1 = this.parseFirstFormula();
    console.log("f1 = ", f1);
    if (f1 == null) return null;
    let f2 = this.parseSecondFormula();
    console.log("f2 = ", f2);
    if (f2 == null) return f1;
    return new BinaryOperatorFormula(f1, "&", f2);
  }

  parseSecondFormula() {
    if (this.formulaString[0] == "&") {
      this.formulaString = this.formulaString.substring(1);
      return this.parseFormula();
    } else return null;
  }

  parseFirstFormula() {
    if (!this.isUnaryFormula()) {
      return this.createLiteralOrReparse();
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
        operator = this.formulaString[0] + this.formulaString[1]; // Operators is either K1, K2, K3
        this.formulaString = this.formulaString.substring(2); // we prepare global formulaString for next recursion
      } else {
        throw new Error("Unknown operator");
      }
    } else {
      operator = this.formulaString[0]; // this must be ! ( negation operator )
      this.formulaString = this.formulaString.substring(1);
    }

    // we continue to create formula recursevly
    let newFormula = this.parseFirstFormula();

    // when recursion finishes we add formula to this unary formula with operator we jst created
    return new UnaryOperatorFormula(operator, newFormula);
  }

  createLiteralOrReparse() {
    // if formula starts with letter we create a literal for it
    // if it starts with ( we remove it from global formula and then we call parse, to parse inside of formula)

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

  isUnaryFormula() {
    return this.formulaString[0] == "!" || this.formulaString[0] == "K";
  }

  isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
  }
}

module.exports = { FormulaParser };
