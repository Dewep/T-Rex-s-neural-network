const SOLUTIONS = require('./data')
const common = require('./common')

const SIZE_NETWORK = 36
const MIN_VAL = -20
const MAX_VAL = 20
const POP_SIZE = 1000
const TURNS = 50
const PROBA_CROSSOVER = 0.80
const PROBA_MUTATION = 0.15
const PROBA_MUTATION_VAL = 0.05
const RATE_MUTATION = 0.01

let pop = []

function compareIndividualSolutions(a, b) {
    return b.fitness - a.fitness
}

class IndividualSolution {
    constructor (network) {
        if (!network) {
            network = []
            for (let i = 0; i < SIZE_NETWORK; i++) {
                network.push(Math.random() * (MAX_VAL - MIN_VAL) + MIN_VAL)
            }
        }
        this.network = network
        this.fitness = this.computeFitness()
    }

    computeFitness () {
        /*for (let i = 0; i < SIZE_NETWORK; i++) {
            this.network[i] = Math.min(MAX_VAL, Math.max(MIN_VAL, this.network[i]))
        }*/

        let success = 0
        let total = 0
        let network = common.generateIntelligence(this.network)
        for (let i = 0; i < SOLUTIONS.length; i++) {
            if (common.shouldJump(network, SOLUTIONS[i].i) === (SOLUTIONS[i].o === 1)) {
                success += 1
            }
        }
        return success * 100 / SOLUTIONS.length
    }

    mutation () {
        for (let i = 0; i < SIZE_NETWORK; i++) {
            if (Math.random() < PROBA_MUTATION_VAL) {
                if (Math.random() < 0.5) {
                    this.network[i] += this.network[i] * RATE_MUTATION
                } else {
                    this.network[i] -= this.network[i] * RATE_MUTATION
                }
            }
        }
        this.computeFitness()
    }

    crossover (other) {
        const network1 = []
        const network2 = []
        const network3 = []

        for (let i = 0; i < SIZE_NETWORK; i++) {
            network1.push(0.5 * this.network[i] + 0.5 * other.network[i])
            network2.push(1.5 * this.network[i] - 0.5 * other.network[i])
            network3.push(-0.5 * this.network[i] + 1.5 * other.network[i])
        }

        let childs = [new IndividualSolution(network1), new IndividualSolution(network2), new IndividualSolution(network3)].sort(compareIndividualSolutions)
        childs.sort(compareIndividualSolutions)
        childs.splice(-1, 1)
        return childs
    }
}

function breeding (ind1, ind2) {
    if (Math.random() < PROBA_CROSSOVER) {
        const crossoverRes = ind1.crossover(ind2)
        ind1 = crossoverRes[0]
        ind2 = crossoverRes[1]
    }
    if (Math.random() < PROBA_MUTATION) {
        ind1.mutation()
    }
    if (Math.random() < PROBA_MUTATION) {
        ind2.mutation()
    }
    return [ind1, ind2]
}

while (pop.length < POP_SIZE) {
    pop.push(new IndividualSolution())
}

for (let t = 0; t < TURNS; t++) {
    pop.sort(compareIndividualSolutions)

    let newPop = [pop[0], pop[1]]
    for (let i = 1; i < POP_SIZE / 2; i++) {
        Array.prototype.push.apply(newPop, breeding(pop[i * 2], pop[i * 2 + 1]))
    }

    pop = newPop
    console.info('Turn', t, ': Fitness', pop[0].fitness, JSON.stringify(pop[0].network))
}
