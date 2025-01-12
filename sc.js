const { FormulaParser } = require("./parser");
const Node = require("./node");

function build(node) {
  if (node.isAnObviouslyContradictorySetOfFormulas()) {
    node.isClosed = true;
    node.isSAT = false;
    return false;
  }

  let doubleNegationWittness = node.findDoubleNegationWitness();

  if (doubleNegationWittness) {
    let successor = node.createSuccessor(
      doubleNegationWittness.formula.formula,
      false
    );
    successor.isSAT = build(successor);
    return successor.isSAT;
  }

  let conjuctionWitness = node.findConjunction();

  if (conjuctionWitness) {
    let toBeAdded = [];

    if (!node.contains(conjuctionWitness.f1)) {
      toBeAdded.push(conjuctionWitness.f1);
    }

    if (!node.contains(conjuctionWitness.f2)) {
      toBeAdded.push(conjuctionWitness.f2);
    }

    let successor = node.createSuccesorWithTwoMore(toBeAdded);
    successor.isSAT = build(successor);

    return successor.isSAT;
  }

  let negationConjuctionWitness = node.findConjunctionNegation();

  if (negationConjuctionWitness[0]) {
    if (negationConjuctionWitness[1] && negationConjuctionWitness[2]) {
      let successor1 = node.createSuccessor(negationConjuctionWitness[1], true);
      successor1.isSAT = build(successor1);

      if (successor1.isSAT == true) {
        node.isSAT = true;
        return true;
      }

      let successor2 = node.createSuccessor(negationConjuctionWitness[2], true);
      successor2.isSAT = build(successor2);

      if (successor2.isSAT == true) {
        node.isSAT = true;
        return true;
      }
    }

    node.isSAT = false;
    return false;
  }

  node.isTablo = true;
  let mfWitness = node.findExtendedTabloWitness();

  if (mfWitness[0]) {
    if (mfWitness[1] && mfWitness[2]) {
      let successor1 = node.createSuccessor(mfWitness[1], true);
      successor1.isSAT = build(successor1);

      if (successor1.isSAT == true) {
        node.isSAT = true;
        return true;
      }

      let successor2 = node.createSuccessor(mfWitness[2], true);
      successor2.isSAT = build(successor2);

      if (successor2.isSAT == true) {
        node.isSAT = true;
        return true;
      }
    }
    node.isSAT = false;
    return false;
  }

  node.isExtendedTablo = true;

  let nKFormulas = node.findNKF();

  if (nKFormulas.length > 0) {
    var result = true;

    for (let i = 0; i < nKFormulas.length; i++) {
      let formula = nKFormulas[i];
      let negationF = formula;
      let modalF = negationF.formula;
      let phi = modalF.formula;
      let formulaNegation = phi.getNegation();
      let reducedSet = node.getReducedSet(modalF.operator);
      let successor = node.createISuccessor(reducedSet, formulaNegation);
      successor.isSAT = build(successor);
      result = result && successor.isSAT;

      if (result == false) {
        break;
      }
    }

    node.isSAT = result;
    return result;
  }

  node.isSAT = true;
  return true;
}

function KmSAT(formula) {
  let root = new Node.Node(formula.toTextual(), [formula], false);
  root.isSAT = build(root);
  // root.print();
  return root.isSAT;
}

function main() {
  let input = "(a&!b)&b";
  try {
    let rootFormula = new FormulaParser(input).parse();
    console.log("rootFormula = ", rootFormula);
    let result = KmSAT(rootFormula);
    console.log(
      "\n--------------------------------\nZadovoljivost formule: ",
      result
    );
  } catch (e) {
    // there could be errors for invalid input with invalid order of elements
    // or invalid operators
    console.log(e);
  }
}

main();
