const { FormulaParser } = require("./parser");
const { Node } = require("./node");

/*
  returns true or false for isSAT for current node
*/
function build(node) {

  // if nose is contradcitory set of formulas ( if it has formula and its negation) we close it

  if (node.isAnObviouslyContradictorySetOfFormulas()) {
    node.isClosed = true;
    node.isSAT = false;
    return false;
  }


  // if it is not an obviously contradictory set of formulas we check for witnesses
  // witnesses can be in form of double negation witness, conjuction witness and negation conjuction witness

  /* Each time we find a witness we call build with added successors */

  let doubleNegationWittness = node.findDoubleNegationWitness();

  console.log('double negation witness', doubleNegationWittness);
  console.log('-------------------------------------------');

  if (doubleNegationWittness) {
    let successor = node.createSuccessor(
      doubleNegationWittness.formula.formula,
      false
    );

    successor.isSAT = build(successor);
    return successor.isSAT;
  }

  let conjuctionWitness = node.findConjunction();

    console.log("conjutciton witness", conjuctionWitness);
    console.log("-------------------------------------------");

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

      console.log("negation conjutction witness", negationConjuctionWitness);
      console.log("-------------------------------------------");

  if (n6) {
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

  /*
    After we checked for
  */

  node.isTablo = true;
  let mfWitness = node.findExtendedTabloWitness();


  /*
    We check if tablo is completely exapnded, if it is not, we create successors for witnessess
    and call build recursively on them
  */
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
      console.log('modalF.operator', modalF.operator);
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
  let root = new Node(formula.toTextual(), [formula], false);
  root.isSAT = build(root);
  // root.print();
  return root.isSAT;
}

let input = "(a&!b)&b&a";
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
