

class Formula {

    constructor(){

    }

    isNegationOf(otherFormula){
        let negationOfOther = new UnaryOperatorFormula('!', otherFormula)

        if(this.isEqualTo(negationOfOther)){
            return true
        }else{
            return false
        }
    }

    isDoubleNegation(){
        if(this.type == 'Unary'){
            if(this.operator == '!'){
                let formula = this.formula
                if(formula.type == 'Unary'){
                    if(formula.operator == '!'){
                        return true
                    }
                }
            }
        }
        else return false
    }

    print(){
        console.log(this.toTextual())
    }

    getNegation(){
        if(this.operator && this.operator == '!'){
            return this.formula
        }else{
            return new UnaryOperatorFormula('!', this)
        }
    }

}

class BinaryOperatorFormula extends Formula{
    
    constructor(f1, operator, f2){
        super()
        this.operator = operator
        this.f1 = f1
        this.f2 = f2
        this.type = 'Binary'
    }

    isEqualTo(otherFormula){
        if(otherFormula.type == 'Binary'){
            if(this.operator == otherFormula.operator){
                if(this.f1.isEqualTo(otherFormula.f1) && this.f2.isEqualTo(otherFormula.f2)){
                    return true
                }else if(this.f1.isEqualTo(otherFormula.f2) && this.f2.isEqualTo(otherFormula.f1)){
                    return true
                }
            }
        }

        return false
    }

    isModal(){
        return false
    }

    toTextual(){
        return '(' + this.f1.toTextual() + this.operator + this.f2.toTextual() + ')'
    }

    getSubFormulas(){
        return [this].concat(this.f1.getSubFormulas()).concat(this.f2.getSubFormulas())
    }

}

class UnaryOperatorFormula extends Formula{

    constructor(operator, formula){
        super()
        this.operator = operator
        this.formula = formula
        this.type = 'Unary'
    }

    isEqualTo(otherFormula){
        if(otherFormula.type == 'Unary'){
            if(this.operator == otherFormula.operator){
                if(this.formula.isEqualTo(otherFormula.formula)){
                    return true
                }
            }
        }
        return false
    }

    isModal(){
        return this.operator[0] == 'K' ? true : false
    }

    toTextual(){
        return this.operator + this.formula.toTextual()
    }

    getSubFormulas(){
        return [this].concat(this.formula.getSubFormulas())
    }

}

class Literal extends Formula{

    constructor(name){
        super()
        this.name = name
        this.type = 'Literal'
    }

    isEqualTo(otherFormula){
        if(otherFormula.type == 'Literal'){
            if(this.name == otherFormula.name){
                return true
            }
        }
        return false
    }

    isModal(){
        return false
    }

    toTextual(){
        return this.name
    }

    getSubFormulas(){
        return [this]
    }
}

module.exports = {Formula, BinaryOperatorFormula, UnaryOperatorFormula, Literal }