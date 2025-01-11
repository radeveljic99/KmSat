const Parser = require("./parser");
const Node = require("./node");

function build(node) {
  if (node.isAnObviouslyContradictorySetOfFormulas()) {
    node.isClosed = true;
    node.isSAT = false;
    return false;
  } else {
    let dnWitness = node.findDoubleNegationWitness();
    if (dnWitness) {
      let successor = node.createSuccessor(dnWitness.formula.formula, false);
      successor.isSAT = build(successor);
      return successor.isSAT;
    }

    let cWitness = node.findConjunction();
    if (cWitness) {
      let toBeAdded = [];

      if (!node.contains(cWitness.f1)) {
        toBeAdded.push(cWitness.f1);
      }

      if (!node.contains(cWitness.f2)) {
        toBeAdded.push(cWitness.f2);
      }

      let successor = node.createSuccesorWithTwoMore(toBeAdded);
      successor.isSAT = build(successor);

      return successor.isSAT;
    }

    let ncWitness = node.findConjunctionNegation();

    if (ncWitness[0]) {
      if (ncWitness[1] && ncWitness[2]) {
        let successor1 = node.createSuccessor(ncWitness[1], true);
        successor1.isSAT = build(successor1);

        if (successor1.isSAT == true) {
          node.isSAT = true;
          return true;
        }

        let successor2 = node.createSuccessor(ncWitness[2], true);
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
}

function KmSAT(formula) {
  let root = new Node.Node(formula.toTextual(), [formula], false);
  root.isSAT = build(root);
  root.print();
  return root.isSAT;
}

function main() {
  let input = "(a&a)&b&c";
  let rootFormula = Parser.parse(input);
  console.log(rootFormula);
  let result = KmSAT(rootFormula);
  console.log(
    "\n--------------------------------\nZadovoljivost formule: ",
    result
  );
}

main();
