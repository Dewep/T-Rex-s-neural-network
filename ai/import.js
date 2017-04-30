window.importAI = function (intelligence) {
    var Runner = window.Runner
    var r = Runner.instance_

    var getInputs = function (r) {
        var defaultObstacle = { xPos: 650, width: 30, typeConfig: { height: 40 }, yPos: 100 }
        var o = r.horizon.obstacles.length ? r.horizon.obstacles[0] : defaultObstacle
        if (o.xPos - 50 <= 0) {
            o = r.horizon.obstacles.length > 1 ? r.horizon.obstacles[1] : defaultObstacle
        }
        return { speed: r.currentSpeed, distance: o.xPos - 50, width: o.width, height: o.typeConfig.height, altitude: (150 - 10 - o.yPos - o.typeConfig.height) > 40 ? 1 : 0 }
    }
    var getOutput = function (network, inputs) {
        var output = {}
        for (var i = 1; i < network.length; i++) {
            var layer = network[i]
            output = {}
            for (var nodeName in layer) {
                var node = layer[nodeName]
                var sum = node.bias
                for (var edgeName in node.weights) {
                    sum += node.weights[edgeName] * inputs[edgeName]
                }
                output[nodeName] = (1 / (1 + Math.exp(-sum)))
            }
            inputs = output
        }
        return output
    }
    var shouldJump = function (network, inputs) {
        var output = getOutput(network, inputs)
        return output.jump > 0.5
    }
    var generateIntelligence = function (values) {
        var generateNode = function generateNode (index, isFirstLayer) {
            var offset = index * 6
            var keys = isFirstLayer ? ['speed', 'distance', 'width', 'height', 'altitude'] : [0, 1, 2, 3, 4]
            return {
                bias: values[offset + 0],
                weights: { [keys[0]]: values[offset + 1], [keys[1]]: values[offset + 2], [keys[2]]: values[offset + 3], [keys[3]]: values[offset + 4], [keys[4]]: values[offset + 5] }
            }
        }
        return [
            { speed: {}, distance: {}, width: {}, height: {}, altitude: {} },
            { 0: generateNode(0, true), 1: generateNode(1, true), 2: generateNode(2, true), 3: generateNode(3, true), 4: generateNode(4, true) },
            { jump: generateNode(5) }
        ]
    }

    var init = null
    var neuralNetwork = generateIntelligence(intelligence)

    setInterval(function () {
        if (r && init === null) {
            r.startGame()
            r.playIntro()
            init = false
        } else if (init === false && r.playingIntro === false) {
            r.tRex.startJump(r.currentSpeed)
            init = true
        } else if (init && !r.playing) {
            r.restart()
        } else if (init) {
            if (!r.tRex.jumping) {
                var inputs = getInputs(r)
                if (shouldJump(neuralNetwork, inputs)) {
                    r.tRex.startJump(r.currentSpeed)
                }
            }
        }
    }, 50)
}
