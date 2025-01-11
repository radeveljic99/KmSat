
const Formulas = require('./formula')

class Node {

    constructor(formulaString, formulas, parent){
        this.parent = parent
        this.label = formulaString
        this.isSAT = false
        this.formulas = formulas
        this.successors = []
        this.isTablo = false
        this.isExtendedTablo = false
        this.isClosed = false
    }

    copyArray(arr){
        let newArr = []
        for(let i = 0; i < arr.length; i++){
            newArr.push(arr[i])
        }
        return newArr
    }

    print(){
        console.log(this.label)
        for(let i = 0; i < this.successors.length; i++){
            let succ = this.successors[i]
            succ.print()
        }

        
    }

    deepCopyFormulas(){
        let copy = []
        let i, formula;
        for (i = 0; i < this.formulas.length; i++){
            formula = this.formulas[i]
            copy.push(formula)
        }

        return copy
    }

    createSuccessor(formula, deepCopy){
        let newFormulas;
        if(deepCopy){
            newFormulas = this.deepCopyFormulas()
        }else{
            newFormulas = this.formulas
        }
        newFormulas.push(formula)
        let successor = new Node(this.label + ', ' + formula.toTextual(), newFormulas, this)
        this.successors.push(successor)
        return successor
    }

    createSuccesorWithTwoMore(formulas){
        let newFormulas = this.formulas
        let newLabel = ''
        let removeLastTick = false
        for(let i = 0; i < formulas.length; i++){
            newFormulas.push(formulas[i])
            newLabel = newLabel + formulas[i].toTextual() + ', '
            removeLastTick = true
        }

        if(removeLastTick){
            newLabel = newLabel.substring(0, newLabel.length - 2)
        }
        
        let successor = new Node(this.label + ', ' + newLabel, newFormulas, this)
        this.successors.push(successor)
        return successor
    }

    findDoubleNegationWitness(){
        let i, formula;
        for(i = 0; i < this.formulas.length; i++){
            formula = this.formulas[i]
            if(formula.isDoubleNegation()){
                if(!this.contains(formula.formula.formula)){
                    return formula
                }
            }
        }

        return false
    }

    findConjunction(){
        let i, formula;
        for(i = 0 ; i < this.formulas.length; i++){
            formula = this.formulas[i]
            if(formula.type == 'Binary'){
                if(!(this.contains(formula.f1) && this.contains(formula.f2))){
                    return formula
                }
            }
        }
        return false
    }

    findConjunctionNegation(){
        let i, formula;
        for(i = 0 ; i < this.formulas.length; i++){
            formula = this.formulas[i]
            if(formula.type == 'Unary' && formula.operator == '!'){
                let innerFormula = formula.formula
                if(innerFormula.type == 'Binary'){
                    let f1Negation = new Formulas.UnaryOperatorFormula('!', innerFormula.f1)
                    let f2Negation = new Formulas.UnaryOperatorFormula('!', innerFormula.f2)

                    if(!this.contains(f1Negation) && !this.contains(f2Negation)){
                        return [true, f1Negation, f2Negation]
                    }
                }
            }
        }

        return [false, false, false]
    }

    findExtendedTabloWitness(){
        let i, formula, j, sf;
        for(i = 0 ; i < this.formulas.length; i++){
            formula = this.formulas[i]
            let subFormulas = formula.getSubFormulas()
            for(j = 0; j < subFormulas.length; j++){
                sf = subFormulas[j]
                let nsf = sf.getNegation()
                
                if(!this.contains(sf) && !this.contains(nsf)){
                    return [true, sf, nsf]
                }

            }

        }
        return [false, false, false]
    }

    createISuccessor(newFormulas, formula){

        let newLabel = ''
        for(let i = 0; i < newFormulas.length; i++){
            if(i == newFormulas.length - 1){
                newLabel += newFormulas[i].toTextual()
            }else{
                newLabel += newFormulas[i].toTextual() + ', '
            }
        }
        newFormulas.push(formula)
        let successor = new Node(newFormulas.length > 1 ?  newLabel + ', ' + formula.toTextual() : formula.toTextual(), newFormulas, this)
        this.successors.push(successor)
        return successor
    }

    getReducedSet(operator){
        let reducedSet = []
        let i, formula;
        for(i = 0; i < this.formulas.length; i++){
            formula = this.formulas[i]
            if(formula.operator == operator){
                reducedSet.push(formula.formula)
            }
        }

        return reducedSet
    }

    findNKF(){
        let nKFormulas = []
        let i, formula
        for(i = 0; i < this.formulas.length; i++){
            formula = this.formulas[i]
            if(formula.type == 'Unary' && formula.operator == '!'){
                let innerFormula = formula.formula
                if(innerFormula.type == 'Unary' && innerFormula.operator[0] == 'K'){
                    nKFormulas.push(formula)
                }
            }
        }

        return nKFormulas
    }

    x(){
        let modalFormulas = []
        let i, formula, innerFormula;
        for(i = 0; i < this.formulas.length; i++){
            formula = this.formulas[i]
            innerFormula = formula.formula ? formula.formula : false
            if(formula.isModal()){
                modalFormulas.push(formula)
            }else if(innerFormula.isModal()){
                modalFormulas.push(formula)
            }
        }

        return modalFormulas
    }

    contains(formula){
        let i, currentFormula;
        for(i = 0; i < this.formulas.length; i++){
            currentFormula = this.formulas[i]
            if(currentFormula.isEqualTo(formula)){
                return true
            }
        }
        return false
    }

    isAnObviouslyContradictorySetOfFormulas(){
       let i, j, f1, f2;
       for(i = 0; i < this.formulas.length; i++){
            f1 = this.formulas[i]
            for(j = 0; j < this.formulas.length; j++){
                if(i != j){
                    f2 = this.formulas[j]
                    if(f1.isNegationOf(f2)){
                        return true
                    }
                }
            }
       }
       return false
    }

}

module.exports = {Node}